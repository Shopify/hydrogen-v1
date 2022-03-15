import {CacheDays} from '@shopify/hydrogen';

export async function api(request, {queryShop}) {
  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop({
    query: QUERY,
    cache: CacheDays(),
  });

  return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
}

const QUERY = `
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
