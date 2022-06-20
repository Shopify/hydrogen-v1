import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';
import type {Localization} from '@shopify/hydrogen/storefront-api-types';

export async function api(
  _request: HydrogenRequest,
  {queryShop}: HydrogenApiRouteOptions,
) {
  // I have zero clue what's happening with this const declaration, it's wild
  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop<{
    localization: Localization;
  }>({
    query: COUNTRIES_QUERY,
  });

  return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
}

// I feel like we're consistent elsewhere with using gql. Any reason not to here?
const COUNTRIES_QUERY = `
  query Localization {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
        }
      }
    }
  }
`;
