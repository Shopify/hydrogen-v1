import React, {ElementType, ReactElement} from 'react';
import {Props} from '../types';
import {useShop} from '../../foundation';
import {getMeasurementAsString} from '../../utilities';
import {StarRating} from './components/StarRating';
import {RawHtml} from '../RawHtml';
import {ParsedMetafield, Measurement, Rating} from '../../types';
import {MetafieldFragment as Fragment} from '../../graphql/graphql-constants';
import {Image} from '../Image';
import {MediaImage} from '../../types';

export interface MetafieldProps {
  /** A [Metafield object](/api/storefront/reference/common-objects/metafield) from the Storefront API. */
  metafield: ParsedMetafield;
  /** A render function that takes a `Metafield` object as an argument. Refer to [Render props](#render-props). */
  children?: (value: ParsedMetafield) => ReactElement;
}

/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](/api/storefront/reference/common-objects/metafield).
 *
 * When a render function is provided, it passes the Metafield object with a value
 * that was parsed according to the Metafield's `type` field. For more information,
 * refer to the [Render props](#render-props) section.

 * When no render function is provided, it renders a smart default of the
 * Metafield's `value`. For more information, refer to the [Default Output](#default-output) section.
 */
export function Metafield<TTag extends ElementType>(
  props: Props<TTag> & MetafieldProps
) {
  const {metafield, children, as, ...passthroughProps} = props;
  const {locale} = useShop();

  if (metafield.value == null) {
    console.warn(`No metafield value for ${metafield}`);
    return null;
  }

  if (typeof children === 'function') {
    return children(metafield);
  }

  switch (metafield.type) {
    case 'date': {
      const Wrapper = as ?? 'time';
      return (
        <Wrapper {...passthroughProps}>
          {(metafield.value as Date).toLocaleDateString(locale)}
        </Wrapper>
      );
    }
    case 'date_time': {
      const Wrapper = as ?? 'time';
      return (
        <Wrapper {...passthroughProps}>
          {(metafield.value as Date).toLocaleString(locale)}
        </Wrapper>
      );
    }
    case 'weight':
    case 'dimension':
    case 'volume': {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>
          {getMeasurementAsString(metafield.value as Measurement, locale)}
        </Wrapper>
      );
    }
    case 'rating': {
      return (
        <StarRating rating={metafield.value as Rating} {...passthroughProps} />
      );
    }
    case 'single_line_text_field': {
      return (
        <RawHtml
          {...(passthroughProps as any)}
          as={as ?? 'span'}
          string={metafield.value as string}
        />
      );
    }
    case 'multi_line_text_field': {
      return (
        <RawHtml
          {...(passthroughProps as any)}
          as={as}
          string={(metafield.value as string).split('\n').join('<br/>')}
        />
      );
    }
    case 'url':
      return (
        <a href={metafield.value as string} {...passthroughProps}>
          {metafield.value}
        </a>
      );
    case 'json':
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>
          {JSON.stringify(metafield.value)}
        </Wrapper>
      );
    case 'file_reference': {
      if (metafield.reference?.__typename === 'MediaImage') {
        const ref = metafield.reference as MediaImage;
        return ref.image ? (
          <Image image={ref.image} {...passthroughProps} />
        ) : null;
      }
    }
    default: {
      const Wrapper = as ?? 'span';
      return (
        <Wrapper {...passthroughProps}>{metafield.value.toString()}</Wrapper>
      );
    }
  }
}

Metafield.Fragment = Fragment;

export const MetafieldFragment = Fragment;
