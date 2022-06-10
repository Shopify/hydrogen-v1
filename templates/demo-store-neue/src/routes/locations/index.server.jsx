import {useShopQuery, gql} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {PageHeader, Grid, Section} from '~/components/elements';
import {LocationCard} from '~/components/blocks';
import {LOCATION_CARD_FIELDS} from '~/lib/fragments';

export default function Locations() {
  const {data} = useShopQuery({
    query: LOCATIONS_QUERY,
    variables: {
      pageBy: 12,
    },
    preload: true,
  });

  const locations = data.stores.nodes;

  return (
    <Layout>
      <PageHeader heading="Locations" />
      <Section>
        <Grid items={locations.length === 3 ? 3 : 2}>
          {locations.map((location) => (
            <LocationCard data={location} key={location.id} />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

const LOCATIONS_QUERY = gql`
  ${LOCATION_CARD_FIELDS}
  query Locations($pageBy: Int) {
    stores: contentEntries(first: $pageBy, type: "stores") {
      nodes {
        ...LocationCardFields
      }
    }
  }
`;
