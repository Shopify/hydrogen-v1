import type {
  ProductVariant,
  Product as ProductType,
  SellingPlanAllocationConnection,
  ProductVariantConnection,
  MoneyV2,
  SellingPlanGroupConnection,
} from './storefront-api-types.js';
import type {PartialDeep} from 'type-fest';
import {faker} from '@faker-js/faker';
import {getRawMetafield} from './Metafield.test.helpers.js';
import {getUnitPriceMeasurement, getPrice} from './Money.test.helpers.js';
import {getPreviewImage} from './Image.test.helpers.js';
import {getMedia} from './MediaFile.test.helpers.js';

export function getProduct(
  product: PartialDeep<ProductType> = {}
): PartialDeep<ProductType> {
  return {
    id: product.id ?? faker.datatype.uuid(),
    handle: product.handle ?? faker.random.word(),
    title: product.title ?? faker.random.words(),
    descriptionHtml:
      product.descriptionHtml ?? `<p>${faker.random.words()}</p>`,
    priceRange: {
      maxVariantPrice: getPrice(product.priceRange?.maxVariantPrice),
      minVariantPrice: getPrice(product.priceRange?.minVariantPrice),
    },
    compareAtPriceRange: {
      maxVariantPrice: getPrice(product.compareAtPriceRange?.maxVariantPrice),
      minVariantPrice: getPrice(product.compareAtPriceRange?.minVariantPrice),
    },
    media: product.media ?? {
      nodes: [getMedia(), getMedia(), getMedia(), getMedia(), getMedia()],
    },
    variants: product.variants ?? {
      nodes: [
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
      ],
    },
    metafields: product.metafields ?? [
      getRawMetafield(),
      getRawMetafield(),
      getRawMetafield(),
    ],
    sellingPlanGroups: product.sellingPlanGroups ?? {nodes: []},
  };
}

export function getVariant(
  variant: PartialDeep<ProductVariant> = {}
): PartialDeep<ProductVariant> {
  return {
    id: variant.id ?? faker.random.words(),
    title: variant.title ?? faker.random.words(),
    availableForSale: variant.availableForSale ?? faker.datatype.boolean(),
    image: getPreviewImage(variant?.image ?? undefined),
    unitPrice: getPrice(variant?.unitPrice ?? undefined),
    unitPriceMeasurement: getUnitPriceMeasurement(
      variant?.unitPriceMeasurement ?? undefined
    ),
    priceV2: getPrice(variant.priceV2),
    compareAtPriceV2: getPrice(variant?.compareAtPriceV2 ?? undefined),
    selectedOptions: [
      {name: faker.random.word(), value: faker.random.word()},
      {name: faker.random.word(), value: faker.random.word()},
    ],
    // sellingPlanAllocations: [],
    metafields: variant.metafields ?? [
      getRawMetafield(),
      getRawMetafield(),
      getRawMetafield(),
    ],
  };
}

const priceV2: MoneyV2 = {
  amount: '9.99',
  currencyCode: 'CAD',
};

export const VARIANTS: PartialDeep<ProductVariantConnection> = {
  nodes: [
    {
      id: '1',
      title: 'Black / Small',
      selectedOptions: [
        {
          name: 'Color',
          value: 'Black',
        },
        {
          name: 'Size',
          value: 'Small',
        },
      ],
      availableForSale: true,
      unitPrice: priceV2,
      unitPriceMeasurement: getUnitPriceMeasurement(),
      priceV2,
      metafields: [],
    },
    {
      id: '2',
      title: 'Black / Large',
      selectedOptions: [
        {
          name: 'Color',
          value: 'Black',
        },
        {
          name: 'Size',
          value: 'Large',
        },
      ],
      availableForSale: true,
      unitPrice: priceV2,
      unitPriceMeasurement: getUnitPriceMeasurement(),
      priceV2,
      metafields: [],
    },
    {
      id: '3',
      title: 'White / Small',
      selectedOptions: [
        {
          name: 'Color',
          value: 'White',
        },
        {
          name: 'Size',
          value: 'Small',
        },
      ],
      availableForSale: true,
      unitPrice: priceV2,
      unitPriceMeasurement: getUnitPriceMeasurement(),
      priceV2,
      metafields: [],
    },
    {
      id: '4',
      title: 'White / Large',
      selectedOptions: [
        {
          name: 'Color',
          value: 'White',
        },
        {
          name: 'Size',
          value: 'Large',
        },
      ],
      availableForSale: false,
      unitPrice: priceV2,
      unitPriceMeasurement: getUnitPriceMeasurement(),
      priceV2,
      metafields: [],
    },
  ],
};

export const SELLING_PLAN_GROUPS_CONNECTION: PartialDeep<SellingPlanGroupConnection> =
  {
    nodes: [
      {
        name: 'Subscribe & Save',
        options: [
          {
            name: 'Deliver every',
            values: ['week', '2 weeks'],
          },
        ],
        sellingPlans: {
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
          nodes: [
            {
              id: 'abc',
              name: 'Deliver every week',
              options: [
                {
                  name: 'Deliver every',
                  value: 'week',
                },
              ],
              priceAdjustments: [],
              recurringDeliveries: false,
            },
            {
              id: 'def',
              name: 'Deliver every 2 weeks',
              options: [
                {
                  name: 'Deliver every',
                  value: '2 weeks',
                },
              ],
              priceAdjustments: [],
              recurringDeliveries: false,
            },
          ],
        },
      },
    ],
  };

export const VARIANTS_WITH_SELLING_PLANS: PartialDeep<ProductVariantConnection> =
  {
    nodes: (VARIANTS.nodes ?? []).map((edge) => {
      const sellingPlanAllocations: PartialDeep<SellingPlanAllocationConnection> =
        {
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
          nodes: [
            {
              sellingPlan: {
                id: 'abc',
                name: 'Deliver every week',
                options: [
                  {
                    name: 'Deliver every',
                    value: 'week',
                  },
                ],
                priceAdjustments: [],
                recurringDeliveries: false,
              },
              priceAdjustments: [
                {
                  price: {
                    amount: '10',
                    currencyCode: 'USD',
                  },
                  compareAtPrice: {
                    amount: '10',
                    currencyCode: 'USD',
                  },
                  perDeliveryPrice: {
                    amount: '10',
                    currencyCode: 'USD',
                  },
                  unitPrice: {
                    amount: '10',
                    currencyCode: 'USD',
                  },
                },
              ],
            },
            {
              sellingPlan: {
                id: 'def',
                name: 'Deliver every 2 weeks',
                options: [
                  {
                    name: 'Deliver every',
                    value: '2 weeks',
                  },
                ],
                priceAdjustments: [],
                recurringDeliveries: false,
              },
              priceAdjustments: [
                {
                  price: {
                    amount: '9',
                    currencyCode: 'USD',
                  },
                  compareAtPrice: {
                    amount: '9',
                    currencyCode: 'USD',
                  },
                  perDeliveryPrice: {
                    amount: '9',
                    currencyCode: 'USD',
                  },
                  unitPrice: {
                    amount: '9',
                    currencyCode: 'USD',
                  },
                },
              ],
            },
          ],
        };

      return {
        ...edge,
        sellingPlanAllocations,
      };
    }),
  };
