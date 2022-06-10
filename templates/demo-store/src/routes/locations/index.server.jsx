import {useShopQuery, Image, Link, gql} from '@shopify/hydrogen';
import {DefaultLayout as Layout} from '~/components/layouts';
import {PageHeader, Section} from '~/components/sections';
import {Grid} from '~/components/elements';
import {LOCATION_CARD_FIELDS} from '~/lib/fragments';

export default function Locations() {
  const {data} = useShopQuery({
    query: QUERY,
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
          {locations.map((location, i) => (
            <Card data={location} key={i} />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

function Card({to, data}) {
  return (
    <Link to={to || `/locations/${data.handle}`} className="grid gap-4">
      <div className="card-image">
        <Image
          className="object-cover aspect-[3/2]"
          data={data.featured_image.reference.image}
        />
      </div>
      <div>{data.title.value}</div>
    </Link>
  );
}

const QUERY = gql`
  ${LOCATION_CARD_FIELDS}
  query Locations($pageBy: Int) {
    stores: contentEntries(first: $pageBy, type: "stores") {
      nodes {
        ...LocationCardFields
      }
    }
  }
`;
