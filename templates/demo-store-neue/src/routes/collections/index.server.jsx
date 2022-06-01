import {
  useShopQuery,
  useSession,
  useShop,
  Image,
  Link,
  gql,
} from '@shopify/hydrogen';
import {DefaultLayout as Layout} from '~/components/layouts';
import {PageHeader, Section} from '~/components/sections';
import {Heading, Text, Button, Grid} from '~/components/elements';

export default function Collections() {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      pageBy: 12,
      country: countryCode,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data.collections.nodes;

  return (
    <Layout>
      <PageHeader heading="Collections" />
      <Section>
        <Grid items={collections.length === 3 ? 3 : 2}>
          {collections.map((collection, i) => (
            <Card data={collection} key={i} />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

function Card({data}) {
  return (
    <Link to={`/collections/${data.handle}`} className="grid gap-4">
      {data?.image && (
        <div className="image-border">
          <Image
            className="object-cover w-full aspect-[3/2]"
            data={data.image}
          />
        </div>
      )}
      <Heading as="h3" size="copy">
        {data.title}
      </Heading>
    </Link>
  );
}

const QUERY = gql`
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
  ) @inContext(country: $country, language: $language) {
    collections(first: $pageBy) {
      nodes {
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          id
          url
          width
          height
          altText
        }
      }
    }
  }
`;
