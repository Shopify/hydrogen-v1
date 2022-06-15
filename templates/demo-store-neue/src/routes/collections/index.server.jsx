import {
  useShopQuery,
  useSession,
  useShop,
  Image,
  Link,
  gql,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {PageHeader, Section, Heading, Grid} from '~/components/elements';
import {getImageLoadingPriority} from '~/lib/const';

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
            <Card
              data={collection}
              key={collection.id}
              loading={getImageLoadingPriority(i, 2)}
            />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

function Card({data, loading}) {
  return (
    <Link to={`/collections/${data.handle}`} className="grid gap-4">
      {data?.image && (
        <div className="card-image">
          <Image
            className="object-cover w-full aspect-[3/2]"
            data={data.image}
            loading={loading}
            alt={data.image.altText || data.title}
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
        id
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
