import {useShopQuery, Image, Link, gql} from '@shopify/hydrogen';
import {DefaultLayout as Layout} from '~/components/layouts';
import {PageHeader, Section} from '~/components/sections';
import {Heading, Text, Button, Grid} from '~/components/elements';

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
            <Card key={i} />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

function Card() {
  const imageData = {
    url:
      'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/hydrogen-morning.jpg?v=1636146509',
    altText: 'The Hydrogen snowboard, color Morning',
    width: 1200,
    height: 1504,
  };
  return (
    <Link to={'/locations/toronto'} className="grid gap-4">
      <div className="image-border">
        <Image className="object-cover aspect-[3/2]" data={imageData} />
      </div>
      <div>Location Name</div>
    </Link>
  );
}

const QUERY = gql`
  query Locations($pageBy: Int) {
    stores: metaobjects(first: $pageBy, type: "stores") {
      nodes {
        id
        featured_image: field(key: "featured_image") {
          reference {
            ... on MediaImage {
              image {
                url
                width
                height
              }
            }
          }
        }
        title: field(key: "title") {
          value
        }
        address: field(key: "address") {
          value
        }
        hours: field(key: "hours") {
          value
        }
        email: field(key: "email") {
          value
        }
        phone: field(key: "phone") {
          value
        }
      }
    }
  }
`;
