import React, {ElementType} from 'react';
import {Props} from '../types';
import {useShop} from '../../foundation';
import {getMeasurementAsString} from '../../utilities';
import {RawHtml} from '../RawHtml/RawHtml.client';
import {ParsedMetafield, Measurement, Rating} from '../../types';
import {MetafieldFragment as Fragment} from '../../graphql/graphql-constants';
import {Image} from '../Image';
import {MediaImage} from '../../types';

export interface MetafieldProps<TTag> {
  /** A [Metafield object](/api/storefront/reference/common-objects/metafield) from the Storefront API. */
  data: ParsedMetafield;
  /** An HTML tag to be rendered as the base element wrapper. The default value varies depending on [metafield.type](/apps/metafields/types). */
  as?: TTag;
}

/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](/api/storefront/reference/common-objects/metafield).
 *
 * Renders a smart default of the
 * Metafield's `value`. For more information, refer to the [Default Output](#default-output) section.
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
      return (
        <RawHtml
          {...(passthroughProps as any)}
          as={as ?? 'span'}
          string={data.value as string}
        />
      );
    }
    case 'multi_line_text_field': {
      return (
        <RawHtml
          {...(passthroughProps as any)}
          as={as ?? 'span'}
          string={(data.value as string).split('\n').join('<br/>')}
        />
      );
    }
    case 'url':
      return (
        <a href={data.value as string} {...passthroughProps}>
          {data.value}
        </a>
      );
    case 'json':
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>{JSON.stringify(data.value)}</Wrapper>
      );
    case 'file_reference': {
      if (data.reference?.__typename === 'MediaImage') {
        const ref = data.reference as MediaImage;
        return ref.data ? (
          <Image data={ref.data} {...passthroughProps} />
        ) : null;
      }
    }
    default: {
      const Wrapper = as ?? 'span';
      return <Wrapper {...passthroughProps}>{data.value.toString()}</Wrapper>;
    }
  }
}

Metafield.Fragment = Fragment;

export const MetafieldFragment = Fragment;
