import {
  CurrencyCode,
  SellingPlanAllocationConnection,
  ProductVariantConnection,
  MoneyV2,
} from '../../../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';
import {getUnitPriceMeasurement} from '../../../utilities/tests/unitPriceMeasurement.js';

const priceV2: MoneyV2 = {
  amount: '9.99',
  currencyCode: CurrencyCode.Cad,
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

export const SELLING_PLAN_GROUPS_CONNECTION = {
  nodes: [
    {
      id: 'abc',
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
                    currencyCode: CurrencyCode.Usd,
                  },
                  compareAtPrice: {
                    amount: '10',
                    currencyCode: CurrencyCode.Usd,
                  },
                  perDeliveryPrice: {
                    amount: '10',
                    currencyCode: CurrencyCode.Usd,
                  },
                  unitPrice: {
                    amount: '10',
                    currencyCode: CurrencyCode.Usd,
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
                    currencyCode: CurrencyCode.Usd,
                  },
                  compareAtPrice: {
                    amount: '9',
                    currencyCode: CurrencyCode.Usd,
                  },
                  perDeliveryPrice: {
                    amount: '9',
                    currencyCode: CurrencyCode.Usd,
                  },
                  unitPrice: {
                    amount: '9',
                    currencyCode: CurrencyCode.Usd,
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
