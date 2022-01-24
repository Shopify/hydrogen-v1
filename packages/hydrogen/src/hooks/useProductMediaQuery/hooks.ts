// eslint-disable-next-line node/no-extraneous-import
import type {CountryCode} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

const DEFAULT_NUM_MEDIA = 10;

export function useProductMediaQuery({
  handle,
  country,
  count: mediaCount = DEFAULT_NUM_MEDIA,
  cursor,
  paginateDirection = 'next',
}: {
  handle: string;
  country: CountryCode;
  cursor?: string;
  count?: number;
  paginateDirection?: 'previous' | 'next';
}): any {
  const SFAPIClient = useSFAPIClient();

  const mediaCursor = cursor
    ? {
        value: cursor,
        getNodesBeforeAfterCursor:
          paginateDirection === 'next'
            ? ('afterCursor' as const)
            : ('beforeCursor' as const),
      }
    : undefined;

  const {gql, variables} = SFAPIClient.product.queryProductMedia({
    handle,
    mediaCount,
    mediaCursor,
    country,
  });
  const data = useShopQuery({query: gql, variables});
  return data;
}
