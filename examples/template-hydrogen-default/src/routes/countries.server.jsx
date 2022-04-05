export async function api(request, {queryShop, session}) {
  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop({
    query: QUERY,
  });

  await session.set('Does it work?', 'haa');

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
