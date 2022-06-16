import SanityClient from '@sanity/client';
import {HydrogenUseQueryOptions, useQuery} from '@shopify/hydrogen';
import {sanityConfig} from '../sanity.config';

const client = SanityClient(sanityConfig);

export function useSanityQuery({
  query,
  params = {},
  hydrogenQueryOptions,
}: {
  query: string;
  params?: any;
  hydrogenQueryOptions?: HydrogenUseQueryOptions;
}) {
  return useQuery(
    [query, params],
    async () => await client.fetch(query, params),
    hydrogenQueryOptions
  );
}
