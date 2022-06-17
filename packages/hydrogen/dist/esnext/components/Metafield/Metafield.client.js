import React, { useMemo } from 'react';
import { useShop } from '../../foundation';
import { getMeasurementAsString } from '../../utilities';
import { Image } from '../Image';
import { Video } from '../Video';
import { flattenConnection } from '../../utilities/flattenConnection/index';
import { parseMetafield } from '../../utilities/parseMetafield/index';
/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).
 *
 * Renders a smart default of the Metafield's `value`. For more information, refer to the [Default output](#default-output) section.
 */
export function Metafield(props) {
    const { data, children, as, ...passthroughProps } = props;
    const { locale } = useShop();
    const parsedMetafield = useMemo(() => parseMetafield(data), [data]);
    if (!parsedMetafield) {
        if (__HYDROGEN_DEV__) {
            console.warn(`<Metafield/>: nothing was passed to the data prop 'data'`);
        }
        return null;
    }
    if (parsedMetafield.value === null || parsedMetafield.value === undefined) {
        if (__HYDROGEN_DEV__) {
            console.warn(`<Metafield/>: No metafield value for metafield ${parsedMetafield.id ?? parsedMetafield.key}`);
        }
        return null;
    }
    switch (parsedMetafield.type) {
        case 'date': {
            const Wrapper = as ?? 'time';
            return (React.createElement(Wrapper, { ...passthroughProps }, parsedMetafield.value.toLocaleDateString(locale)));
        }
        case 'date_time': {
            const Wrapper = as ?? 'time';
            return (React.createElement(Wrapper, { ...passthroughProps }, parsedMetafield.value.toLocaleString(locale)));
        }
        case 'weight':
        case 'dimension':
        case 'volume': {
            const Wrapper = as ?? 'span';
            return (React.createElement(Wrapper, { ...passthroughProps }, getMeasurementAsString(parsedMetafield.value, locale)));
        }
        case 'rating': {
            const Wrapper = as ?? 'span';
            return (React.createElement(Wrapper, { ...passthroughProps }, parsedMetafield.value.value));
        }
        case 'single_line_text_field': {
            const Wrapper = as ?? 'span';
            return (React.createElement(Wrapper, { ...passthroughProps, dangerouslySetInnerHTML: { __html: parsedMetafield.value } }));
        }
        case 'multi_line_text_field': {
            const Wrapper = as ?? 'div';
            return (React.createElement(Wrapper, { ...passthroughProps, dangerouslySetInnerHTML: {
                    __html: parsedMetafield.value.split('\n').join('<br/>'),
                } }));
        }
        case 'url': {
            const protocolLessUrl = new URL(parsedMetafield.value);
            return (React.createElement("a", { href: protocolLessUrl.href.replace(protocolLessUrl.protocol, ''), ...passthroughProps }, parsedMetafield.value));
        }
        case 'json': {
            const Wrapper = as ?? 'span';
            return (React.createElement(Wrapper, { ...passthroughProps }, JSON.stringify(parsedMetafield.value)));
        }
        case 'product_reference':
        case 'variant_reference':
        case 'page_reference': {
            const Wrapper = as ?? 'span';
            const ref = parsedMetafield.reference;
            return (React.createElement(Wrapper, { ...passthroughProps }, ref?.title ?? ref?.id ?? ''));
        }
        case 'list.single_line_text_field': {
            const Wrapper = as ?? 'ul';
            // @ts-expect-error references currently only exists on 'unstable' SFAPI, but as soon as it does exist we can remove this ts-expect-error because I believe 'list.single_line_text_field' will also only be availabe in the same setting and we also handle if it doesn't exist
            const refArray = parsedMetafield.references
                ? // @ts-expect-error references currently only exists on 'unstable' SFAPI, but as soon as it does exist we can remove this ts-expect-error
                    flattenConnection(parsedMetafield.references)
                : [];
            return (React.createElement(Wrapper, { ...passthroughProps }, refArray.map((ref, index) => (
            // there's no unique way to identify these strings, so we do our best by combining the string with the index for the key
            // eslint-disable-next-line react/no-array-index-key
            React.createElement("li", { key: `${ref ?? ''}-${index}` }, ref)))));
        }
        case 'file_reference': {
            if (parsedMetafield.reference?.__typename === 'MediaImage') {
                const ref = parsedMetafield.reference;
                return ref.image ? (React.createElement(Image, { data: ref.image, ...passthroughProps })) : null;
            }
            else if (parsedMetafield.reference?.__typename === 'GenericFile') {
                const ref = parsedMetafield.reference;
                return ref.previewImage ? (React.createElement("a", { href: parsedMetafield.reference?.url ?? '', ...passthroughProps },
                    React.createElement(Image, { data: ref.previewImage }))) : null;
            }
            else if (parsedMetafield.reference?.__typename === 'Video') {
                const ref = parsedMetafield.reference;
                return React.createElement(Video, { ...passthroughProps, data: ref });
            }
        }
    }
    const Wrapper = as ?? 'span';
    return (React.createElement(Wrapper, { ...passthroughProps }, parsedMetafield.value?.toString()));
}
