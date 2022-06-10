import SanityClient from "@sanity/client";
import {useQuery} from "@shopify/hydrogen";
import {sanityConfig} from "../sanity.config";

const client = SanityClient(sanityConfig);

export function useSanityQuery({
  query,
  params = {},
  hydrogenQueryOptions,
}) {
  return useQuery(
    [query, params],
    async () => await client.fetch(query, params),
    hydrogenQueryOptions
  )
}