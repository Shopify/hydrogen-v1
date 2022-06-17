import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';

export async function api(
  request: HydrogenRequest,
  {queryShop, session}: HydrogenApiRouteOptions,
) {
  if (request.method === 'POST') {
    if (!session) {
      return new Response('Session storage not available.', {
        status: 400,
      });
    }

    const {isoCode, name} = await request.json();

    await session.set('countryCode', isoCode);
    await session.set('countryName', name);

    return 'success';
  }

  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop({
    query: COUNTRIES_QUERY,
  });

  return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
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
