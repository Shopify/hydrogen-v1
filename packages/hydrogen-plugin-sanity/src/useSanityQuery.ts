import {useQuery} from '@shopify/hydrogen';
import sanityClient from 'picosanity';

import {SanityQueryClientOptions, UseSanityQueryResponse} from './types';
import useSanityConfig from './useSanityConfig';
import useSanityShopifyProducts from './useSanityShopifyProducts';

interface UseSanityQueryProps extends SanityQueryClientOptions {
  /** A string of the GROQ query. */
  query: string;

  /** An object of the variables for the GROQ query. */
  params?: {[key: string]: any};
}

/**
 * Hook to make server-only GROQ queries to a Sanity dataset.
 */
function useSanityQuery<T>({
  query,
  params = {},
  ...props
}: UseSanityQueryProps): UseSanityQueryResponse<T> {
  const config = useSanityConfig(props.clientConfig);
  const client = new sanityClient(config);

  const {data: sanityData, error} = useQuery<T>([query, params], async () => {
    const data = await client.fetch(query, params);
    return data;
  });

  const shopifyProducts = useSanityShopifyProducts(sanityData, props);

  return {
    sanityData,
    errors: error,
    shopifyProducts,
  };
}

export default useSanityQuery;
