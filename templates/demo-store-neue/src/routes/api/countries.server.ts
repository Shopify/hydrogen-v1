import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';
import type {Country} from '@shopify/hydrogen/storefront-api-types';

export async function api(
  request: HydrogenRequest,
  {queryShop}: HydrogenApiRouteOptions,
) {
  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop({
    query: COUNTRIES_QUERY,
  });

  return availableCountries.sort((a: Country, b: Country) =>
    a.name.localeCompare(b.name),
  );
}

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
