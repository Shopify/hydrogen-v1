import { useShop } from '../../foundation/useShop';
import { getLoggerWithContext } from '../../utilities/log';
import { graphqlRequestBody } from '../../utilities';
import { useServerRequest } from '../../foundation/ServerRequestProvider';
import { injectGraphQLTracker } from '../../utilities/graphql-tracker';
import { sendMessageToClient } from '../../utilities/devtools';
import { fetchSync } from '../../foundation/fetchSync/server/fetchSync';
import { META_ENV_SSR } from '../../foundation/ssr-interop';
import { getStorefrontApiRequestHeaders } from '../../utilities/storefrontApi';
import { parseJSON } from '../../utilities/parse';
// Check if the response body has GraphQL errors
// https://spec.graphql.org/June2018/#sec-Response-Format
const shouldCacheResponse = ([body]) => {
    try {
        return !parseJSON(body)?.errors;
    }
    catch {
        // If we can't parse the response, then assume
        // an error and don't cache the response
        return false;
    }
};
/**
 * The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShopQuery({ query, variables = {}, cache, preload = false, }) {
    /**
     * If no query is passed, we no-op here to allow developers to obey the Rules of Hooks.
     */
    if (!query) {
        return { data: undefined, errors: undefined };
    }
    if (!META_ENV_SSR) {
        throw new Error('Shopify Storefront API requests should only be made from the server.');
    }
    const serverRequest = useServerRequest(); // eslint-disable-line react-hooks/rules-of-hooks
    const log = getLoggerWithContext(serverRequest);
    const body = query ? graphqlRequestBody(query, variables) : '';
    const { url, requestInit } = useCreateShopRequest(body); // eslint-disable-line react-hooks/rules-of-hooks
    let text;
    let data;
    let useQueryError;
    try {
        text = fetchSync(url, {
            ...requestInit,
            cache,
            preload,
            shouldCacheResponse,
        }).text();
        try {
            data = JSON.parse(text);
        }
        catch (error) {
            useQueryError = new Error('Unable to parse response:\n' + text);
        }
    }
    catch (error) {
        // Pass-through thrown promise for Suspense functionality
        if (error?.then) {
            throw error;
        }
        useQueryError = error;
    }
    /**
     * The fetch request itself failed, so we handle that differently than a GraphQL error
     */
    if (useQueryError) {
        const errorMessage = createErrorMessage(useQueryError);
        log.error(errorMessage);
        log.error(useQueryError);
        if (__HYDROGEN_DEV__ && !__HYDROGEN_TEST__) {
            throw new Error(errorMessage);
        }
        else {
            // in non-dev environments, we probably don't want super-detailed error messages for the user
            throw new Error(`The fetch attempt failed; there was an issue connecting to the data source.`);
        }
    }
    /**
     * GraphQL errors get printed to the console but ultimately
     * get returned to the consumer.
     */
    if (data?.errors) {
        const errors = Array.isArray(data.errors) ? data.errors : [data.errors];
        for (const error of errors) {
            if (__HYDROGEN_DEV__ && !__HYDROGEN_TEST__) {
                throw new Error(error.message);
            }
            else {
                log.error('GraphQL Error', error);
            }
        }
        log.error(`GraphQL errors: ${errors.length}`);
    }
    if (__HYDROGEN_DEV__ &&
        (log.options().showUnusedQueryProperties ||
            serverRequest.ctx.hydrogenConfig?.__EXPERIMENTAL__devTools) &&
        query &&
        data?.data) {
        const fileLine = new Error('').stack
            ?.split('\n')
            .find((line) => line.includes('.server.'));
        const [, functionName, fileName] = fileLine?.match(/^\s*at (\w+) \(([^)]+)\)/) || [];
        injectGraphQLTracker({
            query,
            data,
            onUnusedData: ({ queryName, properties }) => {
                const footer = `Examine the list of fields above to confirm that they are being used.\n`;
                const header = `Potentially overfetching fields in GraphQL query.\n`;
                let info = `Query \`${queryName}\``;
                if (fileName) {
                    info += ` in file \`${fileName}\` (function \`${functionName}\`)`;
                }
                const n = 6;
                const shouldTrim = properties.length > n + 1;
                const shownProperties = shouldTrim
                    ? properties.slice(0, n)
                    : properties;
                const hiddenInfo = shouldTrim
                    ? `  ...and ${properties.length - shownProperties.length} more\n`
                    : '';
                const warning = header +
                    info +
                    `:\n• ${shownProperties.join(`\n• `)}\n` +
                    hiddenInfo +
                    footer;
                if (log.options().showUnusedQueryProperties) {
                    log.warn(warning);
                    sendMessageToClient('browser-console', { type: 'warn', data: warning });
                }
                if (serverRequest.ctx.hydrogenConfig?.__EXPERIMENTAL__devTools) {
                    sendMessageToClient('dev-tools', { type: 'warn', data: warning });
                }
            },
        });
    }
    return data;
}
function useCreateShopRequest(body) {
    const { storeDomain, storefrontToken, storefrontApiVersion } = useShop();
    const request = useServerRequest();
    const buyerIp = request.getBuyerIp();
    const extraHeaders = getStorefrontApiRequestHeaders({
        buyerIp,
        storefrontToken,
    });
    return {
        key: [storeDomain, storefrontApiVersion, body],
        url: `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
        requestInit: {
            body,
            method: 'POST',
            headers: {
                'X-SDK-Variant': 'hydrogen',
                'X-SDK-Version': storefrontApiVersion,
                'content-type': 'application/json',
                ...extraHeaders,
            },
        },
    };
}
function createErrorMessage(fetchError) {
    if (fetchError instanceof Response) {
        return `An error occurred while fetching from the Storefront API. ${
        // 403s to the SF API (almost?) always mean that your Shopify credentials are bad/wrong
        fetchError.status === 403
            ? `You may have a bad value in 'hydrogen.config.js'`
            : `${fetchError.statusText}`}`;
    }
    else {
        return `Failed to connect to the Storefront API: ${fetchError.message}`;
    }
}
