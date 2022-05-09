import React, {ElementType} from 'react';
import {Props} from '../types';
import {useShop} from '../../foundation';
import {getMeasurementAsString} from '../../utilities';
import {ParsedMetafield, Measurement, Rating} from '../../types';
import {Image} from '../Image';
import type {MediaImage} from '../../storefront-api-types';

export interface MetafieldProps<TTag> {
  /** An object with fields that correspond to the Storefront API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield). */
  data: ParsedMetafield;
  /** An HTML tag to be rendered as the base element wrapper. The default value varies depending on [metafield.type](https://shopify.dev/apps/metafields/types). */
  as?: TTag;
}

/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).
 *
 * When a render function is provided, it passes the Metafield object with a value
 * that was parsed according to the Metafield's `type` field. For more information,
 * refer to the [Render props](#render-props) section.
 *
 * When no render function is provided, it renders a smart default of the
 * Metafield's `value`. For more information, refer to the [Default output](#default-output) section.
 */
export function Metafield<TTag extends ElementType>(
  props: Props<TTag> & MetafieldProps<TTag>
) {
  const {data, children, as, ...passthroughProps} = props;
  const {locale} = useShop();

  if (data.value == null) {
    console.warn(`No metafield value for ${data}`);
    return null;
  }

  switch (data.type) {
    case 'date': {
      const Wrapper = as ?? 'time';
      return (
        <Wrapper {...passthroughProps}>
          {(data.value as Date).toLocaleDateString(locale)}
        </Wrapper>
      );
    }
    case 'date_time': {
      const Wrapper = as ?? 'time';
      return (
        <Wrapper {...passthroughProps}>
          {(data.value as Date).toLocaleString(locale)}
        </Wrapper>
      );
    }
    case 'weight':
    case 'dimension':
    case 'volume': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>
          {getMeasurementAsString(data.value as Measurement, locale)}
        </Wrapper>
      );
    }
    case 'rating': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>{(data.value as Rating).value}</Wrapper>
      );
    }
    case 'single_line_text_field': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper
          {...(passthroughProps as any)}
          dangerouslySetInnerHTML={{__html: data.value as string}}
        />
      );
    }
    case 'multi_line_text_field': {
      const Wrapper = as ?? 'div';
      return (
        <Wrapper
          {...(passthroughProps as any)}
          dangerouslySetInnerHTML={{
            __html: (data.value as string).split('\n').join('<br/>'),
          }}
        />
      );
    }
    case 'url':
      return (
        <a href={data.value as string} {...passthroughProps}>
          {data.value}
        </a>
      );
    case 'json': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>{JSON.stringify(data.value)}</Wrapper>
      );
    }
    case 'file_reference': {
      if (data.reference?.__typename === 'MediaImage') {
        const ref = data.reference as MediaImage;
        return ref.image ? (
          <Image data={ref.image} {...passthroughProps} />
        ) : null;
      }
    }
  }

  const Wrapper = as ?? 'span';
  return <Wrapper {...passthroughProps}>{data.value.toString()}</Wrapper>;
}
