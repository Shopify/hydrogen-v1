import React, {type ElementType, useMemo} from 'react';
import type {Props} from '../types.js';
import {useLocalization} from '../../hooks/useLocalization/useLocalization.js';
import {getMeasurementAsString} from '../../utilities/measurement.js';
import type {Measurement, ParsedMetafield, Rating} from '../../types.js';
import {Image} from '../Image/index.js';
import type {
  MediaImage,
  Page,
  ProductVariant,
  Product,
  GenericFile,
  Video as VideoType,
  Metafield,
} from '../../storefront-api-types.js';
import {Video} from '../Video/index.js';
import {flattenConnection} from '../../utilities/flattenConnection/index.js';
import type {PartialDeep} from 'type-fest';
import {parseMetafield} from '../../utilities/parseMetafield/index.js';

export interface MetafieldProps<TTag> {
  /** An object with fields that correspond to the Storefront API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield). */
  data: PartialDeep<Metafield> | null;
  /** An HTML tag to be rendered as the base element wrapper. The default value varies depending on [metafield.type](https://shopify.dev/apps/metafields/types). */
  as?: TTag;
}

/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).
 *
 * Renders a smart default of the Metafield's `value`. For more information, refer to the [Default output](#default-output) section.
 */
export function Metafield<TTag extends ElementType>(
  props: Props<TTag> & MetafieldProps<TTag>
) {
  const {data, children, as, ...passthroughProps} = props;
  const {locale} = useLocalization();

  const parsedMetafield = useMemo<PartialDeep<ParsedMetafield> | null>(
    () => parseMetafield(data),
    [data]
  );

  if (!parsedMetafield) {
    if (__HYDROGEN_DEV__) {
      console.warn(`<Metafield/>: nothing was passed to the data prop 'data'`);
    }
    return null;
  }

  if (parsedMetafield.value === null || parsedMetafield.value === undefined) {
    if (__HYDROGEN_DEV__) {
      console.warn(
        `<Metafield/>: No metafield value for metafield ${
          parsedMetafield.id ?? parsedMetafield.key
        }`
      );
    }
    return null;
  }

  switch (parsedMetafield.type) {
    case 'date': {
      const Wrapper = as ?? 'time';
      return (
        <Wrapper {...passthroughProps}>
          {(parsedMetafield.value as Date).toLocaleDateString(locale)}
        </Wrapper>
      );
    }
    case 'date_time': {
      const Wrapper = as ?? 'time';
      return (
        <Wrapper {...passthroughProps}>
          {(parsedMetafield.value as Date).toLocaleString(locale)}
        </Wrapper>
      );
    }
    case 'weight':
    case 'dimension':
    case 'volume': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>
          {getMeasurementAsString(parsedMetafield.value as Measurement, locale)}
        </Wrapper>
      );
    }
    case 'rating': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>
          {(parsedMetafield.value as Rating).value}
        </Wrapper>
      );
    }
    case 'single_line_text_field': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper
          {...(passthroughProps as any)}
          dangerouslySetInnerHTML={{__html: parsedMetafield.value as string}}
        />
      );
    }
    case 'multi_line_text_field': {
      const Wrapper = as ?? 'div';
      return (
        <Wrapper
          {...(passthroughProps as any)}
          dangerouslySetInnerHTML={{
            __html: (parsedMetafield.value as string).split('\n').join('<br/>'),
          }}
        />
      );
    }
    case 'url': {
      const protocolLessUrl = new URL(parsedMetafield.value as string);
      return (
        <a
          href={protocolLessUrl.href.replace(protocolLessUrl.protocol, '')}
          {...passthroughProps}
        >
          {parsedMetafield.value as string}
        </a>
      );
    }
    case 'json': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>
          {JSON.stringify(parsedMetafield.value)}
        </Wrapper>
      );
    }
    case 'product_reference':
    case 'variant_reference':
    case 'page_reference': {
      const Wrapper = as ?? 'span';
      const ref = parsedMetafield.reference as Page | ProductVariant | Product;
      return (
        <Wrapper {...passthroughProps}>{ref?.title ?? ref?.id ?? ''}</Wrapper>
      );
    }
    case 'list.single_line_text_field': {
      const Wrapper = as ?? 'ul';
      const refArray = parsedMetafield.references
        ? (flattenConnection(parsedMetafield.references) as string[])
        : [];
      return (
        <Wrapper {...passthroughProps}>
          {refArray.map((ref, index) => (
            // there's no unique way to identify these strings, so we do our best by combining the string with the index for the key
            // eslint-disable-next-line react/no-array-index-key
            <li key={`${ref ?? ''}-${index}`}>{ref}</li>
          ))}
        </Wrapper>
      );
    }
    case 'file_reference': {
      if (parsedMetafield.reference?.__typename === 'MediaImage') {
        const ref = parsedMetafield.reference as MediaImage;
        return ref.image ? (
          <Image data={ref.image} {...passthroughProps} />
        ) : null;
      } else if (parsedMetafield.reference?.__typename === 'GenericFile') {
        const ref = parsedMetafield.reference as GenericFile;
        return ref.previewImage ? (
          <a href={parsedMetafield.reference?.url ?? ''} {...passthroughProps}>
            <Image data={ref.previewImage} />
          </a>
        ) : null;
      } else if (parsedMetafield.reference?.__typename === 'Video') {
        const ref = parsedMetafield.reference as VideoType;
        return <Video {...passthroughProps} data={ref} />;
      }
    }
  }

  const Wrapper = as ?? 'span';
  return (
    <Wrapper {...passthroughProps}>{parsedMetafield.value?.toString()}</Wrapper>
  );
}
