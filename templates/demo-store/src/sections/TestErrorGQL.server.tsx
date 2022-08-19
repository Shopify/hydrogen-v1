import React from 'react';
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

const ErrorWithFallback = () => {
  if (__HYDROGEN_DEV__) {
    return (
      <div className="border border-notice p-6">
        <p>DEV only fallback</p>
      </div>
    );
  }
  return <></>;
};

export const TestErrorGQL = defineSection({
  section: 'TestErrorGQL',
  component: ErrorWithGQL,
  cache: CacheShort(),
  fallback: ErrorWithFallback,
});

const SHOP_QUERY = gql`
  query shopInfoError {
    shop {
      names
    }
  }
`;
