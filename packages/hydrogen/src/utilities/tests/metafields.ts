import faker from 'faker';
import type {Metafield} from '../../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

export type MetafieldType =
  | 'single_line_text_field'
  | 'multi_line_text_field'
  | 'page_reference'
  | 'product_reference'
  | 'variant_reference'
  | 'file_reference'
  | 'number_integer'
  | 'number_decimal'
  | 'date'
  | 'date_time'
  | 'url'
  | 'json'
  | 'boolean'
  | 'color'
  | 'weight'
  | 'volume'
  | 'dimension'
  | 'rating';

export const METAFIELDS: MetafieldType[] = [
  'single_line_text_field',
  'multi_line_text_field',
  'page_reference',
  'product_reference',
  'variant_reference',
  'file_reference',
  'number_integer',
  'number_decimal',
  'date',
  'date_time',
  'url',
  'json',
  'boolean',
  'color',
  'weight',
  'volume',
  'dimension',
  'rating',
];

export function getRawMetafield(
  metafield: PartialDeep<Metafield> & {
    type?: MetafieldType;
  } = {}
): PartialDeep<Metafield> {
  const type: MetafieldType =
    metafield.type == null
      ? faker.random.arrayElement(METAFIELDS)
      : metafield.type;

  return {
    __typename: 'Metafield',
    createdAt: metafield.createdAt ?? faker.date.recent().toString(),
    description: metafield.description ?? faker.random.words(),
    id: metafield.id ?? faker.random.words(),
    key: metafield.key ?? `${faker.random.word()}.${faker.random.word()}`,
    namespace: metafield.namespace ?? faker.random.word(),
    type,
    updatedAt: metafield.updatedAt ?? faker.date.recent().toString(),
    value: metafield.value ?? getMetafieldValue(type),
    reference: metafield.reference,
  };
}

export function getMetafieldValue(type: MetafieldType) {
  switch (type) {
    case 'single_line_text_field':
      return faker.random.words();
    case 'multi_line_text_field':
      return `${faker.random.words()}\n${faker.random.words()}\n${faker.random.words()}`;
    case 'page_reference':
    case 'product_reference':
    case 'variant_reference':
    case 'file_reference':
      return faker.random.words();
    case 'number_integer':
      return faker.datatype.number().toString();
    case 'number_decimal':
      return faker.datatype.float().toString();
    case 'date':
    case 'date_time':
      return faker.datatype.datetime().toString();
    case 'url':
      return faker.internet.url();
    case 'json':
      return JSON.stringify(faker.datatype.json());
    case 'boolean':
      return faker.datatype.boolean().toString();
    case 'color':
      return faker.internet.color();
    case 'weight':
      return JSON.stringify({
        value: faker.datatype.number(),
        unit: faker.random.arrayElement(['kg', 'g', 'lb', 'oz']),
      });
    case 'volume':
      return JSON.stringify({
        value: faker.datatype.number(),
        unit: faker.random.arrayElement([
          'ml',
          'l',
          'us_gal',
          'us_oz',
          'cl',
          'm3',
          'us_pt',
          'us_qt',
          'imp_pt',
          'imp_fl_oz',
          'imp_qt',
          'imp_gal',
        ]),
      });
    case 'dimension':
      return JSON.stringify({
        value: faker.datatype.number(),
        unit: faker.random.arrayElement(['mm', 'cm', 'm', 'in', 'ft', 'yd']),
      });
    case 'rating': {
      const max = faker.datatype.number({min: 5, max: 10});
      const min = faker.datatype.number({min: 1, max: 4});
      return JSON.stringify({
        scale_max: max,
        scale_min: min,
        value: faker.datatype.float({min, max, precision: 0.0001}),
      });
    }
    default:
      return JSON.stringify(faker.datatype.json());
  }
}
