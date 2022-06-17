// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import entrypoint from '__SERVER_ENTRY__';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import indexTemplate from '__INDEX_TEMPLATE__?raw';
const handleRequest = entrypoint;
export default {
    async fetch(request, env, context) {
        if (!globalThis.Oxygen) {
            globalThis.Oxygen = { env };
        }
        try {
            return (await handleRequest(request, {
                indexTemplate,
                cache: await caches.open('oxygen'),
                context,
                buyerIpHeader: 'oxygen-buyer-ip',
            }));
        }
        catch (error) {
            return new Response(error.message || error.toString(), { status: 500 });
        }
    },
};
