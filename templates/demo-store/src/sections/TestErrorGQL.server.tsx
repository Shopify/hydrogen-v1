import {defineSection, gql, useShopQuery, CacheShort} from '@shopify/hydrogen';

const ErrorWithGQL = () => {
  const {
    data: {
      shop: {names},
    },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheShort(),
    preload: false,
  });

  return <p>Working GQL {names}</p>;
};

export const TestErrorGQL = defineSection({
  section: 'TestErrorGQL',
  component: ErrorWithGQL,
  cache: CacheShort(),
});

const SHOP_QUERY = gql`
  query shopInfoError {
    shop {
      names
    }
  }
`;
