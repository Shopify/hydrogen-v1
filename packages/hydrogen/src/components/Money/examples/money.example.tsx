import {Money} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  productByHandle(handle: "my-product") {
    variants(first: 1) {
      edges {
        node {
          priceV2 {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export default function Product() {
  const {data} = useShopQuery({query: QUERY});

  return <Money money={data.product.variants.edges[0].node.priceV2} />;
}

export default function ProductWithCustomMoney() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <Money money={data.product.variants.edges[0].node.priceV2}>
      {({amount, currencyCode, currencyNarrowSymbol}) => {
        return (
          <>
            <span>{`${currencyNarrowSymbol}${amount}`}</span>
            <span>{currencyCode}</span>
          </>
        );
      }}
    </Money>
  );
}
