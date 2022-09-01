import {type ElementType, useMemo, type ComponentPropsWithoutRef} from 'react';
import {useShop} from './ShopifyProvider.js';
import {Image} from './Image.js';
import type {
  MediaImage,
  Page,
  ProductVariant,
  Product,
  GenericFile,
  Video as VideoType,
  Metafield as MetafieldType,
} from './storefront-api-types.js';
import {Video} from './Video.js';
import {flattenConnection} from './flatten-connection.js';
import type {PartialDeep, JsonValue} from 'type-fest';

export interface MetafieldProps<ComponentGeneric extends ElementType> {
  /** An object with fields that correspond to the Storefront API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield). */
  data: PartialDeep<MetafieldType> | null;
  /** An HTML tag or React component to be rendered as the base element wrapper. The default value varies depending on [metafield.type](https://shopify.dev/apps/metafields/types). */
  as?: ComponentGeneric;
}

/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).
 * Relies on the `locale` property of the `useShop()` hook, so it must be a desendent of `<ShopifyProvider/>`
 *
 * Renders a smart default of the Metafield's `value`. For more information, refer to the [Default output](#default-output) section.
 */
export function Metafield<ComponentGeneric extends ElementType>(
  props: ComponentPropsWithoutRef<ComponentGeneric> &
    MetafieldProps<ComponentGeneric>
) {
  const {data, as, ...passthroughProps} = props;
  const {locale} = useShop();

  const parsedMetafield = useMemo(() => parseMetafield(data), [data]);

  if (!parsedMetafield) {
    const noDataPropWarning = `<Metafield/>: nothing was passed to the data prop 'data'. Rendering 'null'`;
    if (__HYDROGEN_DEV__) {
      throw new Error(noDataPropWarning);
    } else {
      console.warn(noDataPropWarning);
    }
    return null;
  }

  if (parsedMetafield.value === null || parsedMetafield.value === undefined) {
    const noValueWarning = `<Metafield/>: No metafield value for metafield ${
      parsedMetafield.id ?? parsedMetafield.key
    }. Rendering 'null'`;
    if (__HYDROGEN_DEV__) {
      throw new Error(noValueWarning);
    } else {
      console.warn(noValueWarning);
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
          {...passthroughProps}
          dangerouslySetInnerHTML={{__html: parsedMetafield.value as string}}
        />
      );
    }
    case 'multi_line_text_field': {
      const Wrapper = as ?? 'div';
      return (
        <Wrapper
          {...passthroughProps}
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
      // @deprecated
      // @ts-expect-error references currently only exists on 'unstable' SFAPI, but as soon as it does exist we can remove this ts-expect-error because I believe 'list.single_line_text_field' will also only be availabe in the same setting and we also handle if it doesn't exist
      const refArray = parsedMetafield.references
        ? // @ts-expect-error references currently only exists on 'unstable' SFAPI, but as soon as it does exist we can remove this ts-expect-error
          (flattenConnection(parsedMetafield.references) as string[])
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

  if (__HYDROGEN_DEV__) {
    console.info(
      `<Metafield/>: the 'type' of your metafield does not yet have a custom renderer. Your 'value' will be rendered as '.toString()'`
    );
  }

  const Wrapper = as ?? 'span';
  return (
    <Wrapper {...passthroughProps}>{parsedMetafield.value?.toString()}</Wrapper>
  );
}

/**
 * The `parseMetafield` utility transforms a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield)
 * into a new object whose `values` have been parsed according to the metafield `type`.
 * If the metafield is `null`, then it returns `null` back.
 */
export function parseMetafield(
  /** A [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield) or null */
  metafield: PartialDeep<MetafieldType> | null
): PartialDeep<ParsedMetafield> | null {
  if (!metafield) {
    return null;
  }
  if (
    __HYDROGEN_DEV__ &&
    (metafield.value === null || metafield.value === undefined)
  ) {
    console.warn(
      `'parseMetafield()' was passed ${metafield.value} for 'metafield.value'`
    );
  }

  return {
    ...metafield,
    value: parseMetafieldValue(metafield),
  };
}

/**
 * The `parseMetafieldValue` function parses a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `type`.
 */
export function parseMetafieldValue(
  metafield: PartialDeep<MetafieldType> | null
): ParsedMetafield['value'] {
  if (!metafield) {
    return null;
  }

  if (metafield.value === null || metafield.value === undefined) {
    if (__HYDROGEN_DEV__) {
      console.warn(
        `'parseMetafieldValue()' was passed ${metafield.value} for 'metafield.value'`
      );
    }
    return metafield.value;
  }

  switch (metafield.type) {
    case 'boolean':
      return metafield.value === 'true';
    case 'number_integer':
      return parseInt(metafield.value);
    case 'number_decimal':
      return parseFloat(metafield.value);
    case 'date':
    case 'date_time':
      return new Date(metafield.value);
    case 'json':
    case 'weight':
    case 'dimension':
    case 'volume':
    case 'rating':
      return parseJSON(metafield.value);
    case 'color':
    case 'single_line_text_field':
    case 'multi_line_text_field':
    case 'product_reference':
    case 'page_reference':
    case 'variant_reference':
    case 'file_reference':
    case 'url':
    default:
      return metafield.value;
  }
}

/**
 * Parses a JSON string while preventing prototype injection attacks.
 */
export function parseJSON(json: string) {
  if (String(json).includes('__proto__')) {
    return JSON.parse(json, (k, v) => {
      if (k !== '__proto__') return v;
    });
  }

  return JSON.parse(json);
}

const UNIT_MAPPING: Record<string, string> = {
  // Dimension
  mm: 'millimeter',
  cm: 'centimeter',
  m: 'meter',
  in: 'inch',
  ft: 'foot',
  yd: 'yard',
  // Volume
  ml: 'milliliter',
  l: 'liter',
  us_fl_oz: 'fluid-ounce',
  us_gal: 'gallon',
  // Weight
  kg: 'kilogram',
  g: 'gram',
  lb: 'pound',
  oz: 'ounce',
};

export function getMeasurementAsString(
  measurement: Measurement,
  locale = 'en-us',
  options: Intl.NumberFormatOptions = {}
) {
  let measure: {value: number; unit: string} = {
    value: measurement.value,
    unit: UNIT_MAPPING[measurement.unit],
  };

  if (measure.unit == null) {
    measure = convertToSupportedUnit(measurement.value, measurement.unit);
  }

  return new Intl.NumberFormat(locale, {
    ...options,
    unit: measure.unit,
    style: 'unit',
  }).format(measure.value);
}

export function getMeasurementAsParts(
  measurement: Measurement,
  locale = 'en-us',
  options: Intl.NumberFormatOptions = {}
) {
  let measure: {value: number; unit: string} = {
    value: measurement.value,
    unit: UNIT_MAPPING[measurement.unit],
  };

  if (measure.unit == null) {
    measure = convertToSupportedUnit(measurement.value, measurement.unit);
  }

  return new Intl.NumberFormat(locale, {
    ...options,
    unit: measure.unit,
    style: 'unit',
  }).formatToParts(measure.value);
}

function convertToSupportedUnit(value: number, unit: string) {
  switch (unit) {
    case 'cl':
      return {
        value: value / 1000,
        unit: 'liter',
      };
    case 'm3':
      return {
        value: value * 1000,
        unit: 'liter',
      };
    case 'us_pt':
      return {
        value: value * 0.125,
        unit: 'gallon',
      };
    case 'us_qt':
      return {
        value: value * 0.5,
        unit: 'gallon',
      };
    case 'us_oz':
      return {
        value: value / 128,
        unit: 'gallon',
      };
    case 'imp_pt':
      return {
        value: value / 6.661, // approximate conversion
        unit: 'gallon',
      };
    case 'imp_qt':
      return {
        value: value / 3.331, // approximate conversion
        unit: 'gallon',
      };
    case 'imp_gal':
      return {
        value: value / 1.201, // approximate conversion
        unit: 'gallon',
      };
    case 'imp_fl_oz':
      return {
        value: value * 0.96076, // approximate conversion
        unit: 'fluid-ounce',
      };
    default:
      throw new Error(`Unit not supported: ${unit}`);
  }
}

type ParsedMetafield = Omit<PartialDeep<MetafieldType>, 'value'> & {
  value?: string | number | boolean | JsonValue | Date | Rating | Measurement;
};

export interface Rating {
  value: number;
  scale_min: number;
  scale_max: number;
}

interface Measurement {
  unit: string;
  value: number;
}
