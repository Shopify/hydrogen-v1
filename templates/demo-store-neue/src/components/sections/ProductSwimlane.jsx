import {gql, useShopQuery} from '@shopify/hydrogen';
import Section from './Section';
import {ProductCard} from '~/components/blocks';
import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';

const mockProducts = new Array(12).fill('');

export default function ProductSwimlane({
  title = 'Featured Products',
  data = mockProducts,
  count = 12,
  ...passthroughProps
}) {
  const products = (data) => {
    if (typeof data === 'array') {
      return data;
    }

    if (typeof data === 'string') {
      const {data: products} = useShopQuery({
        query: RECOMMENDED_PRODUCTS,
        variables: {
          count: 12,
          productId: data,
        },
      });

      const mergedProducts = products.recommended
        .concat(products.additional.nodes)
        .filter(
          (value, index, array) =>
            array.findIndex((value2) => value2.id === value.id) === index,
        );

      return mergedProducts;
    }

    const {
      data: {products},
    } = useShopQuery({
      query: TOP_PRODUCTS,
      variables: {
        count: 12,
      },
    });

    return products.nodes;
  };

  return (
    <Section heading={title} padding="y" {...passthroughProps}>
      <div className="grid grid-flow-col gap-6 px-4 pb-4 overflow-x-scroll md:pb-8 snap-x scroll-px-4 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
        {products(data).map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className={'snap-start w-80'}
          />
        ))}
      </div>
    </Section>
  );
}

const RECOMMENDED_PRODUCTS = gql`
  ${PRODUCT_CARD_FIELDS}
  query productRecommendations($productId: ID!) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCardFields
    }
    additional: products(first: 12, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;

const TOP_PRODUCTS = gql`
  ${PRODUCT_CARD_FIELDS}
  query topProducts($count: Int) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;
