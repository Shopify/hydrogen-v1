import SanityClient from "@sanity/client";
import { HydrogenUseQueryOptions, useQuery } from "@shopify/hydrogen";
import {sanityConfig} from "../sanity.config";

interface Props {
  query: string;
  params?: Record<string, unknown>;
  hydrogenQueryOptions?: HydrogenUseQueryOptions;
}

const client = SanityClient(sanityConfig);

export function useSanityQuery<T>({
  query,
  params = {},
  hydrogenQueryOptions,
}: Props) {
  return useQuery<T>(
    [query, params],
    async () => await client.fetch(query, params),
    hydrogenQueryOptions
  )
}