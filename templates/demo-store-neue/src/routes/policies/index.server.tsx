import {
  useShop,
  useShopQuery,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
  Link,
} from '@shopify/hydrogen';

import {Layout, PageHeader, Section, Heading} from '~/components';

export default function Policies() {
  const {languageCode} = useShop();

  const {data} = useShopQuery<any>({
    query: POLICIES_QUERY,
    variables: {
      languageCode,
    },
  });

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
    },
  });

  const {privacyPolicy, shippingPolicy, termsOfService, refundPolicy} =
    data.shop;

  const policies = [
    privacyPolicy,
    shippingPolicy,
    termsOfService,
    refundPolicy,
  ];

  return (
    <Layout>
      <PageHeader heading="Policies" />
      <Section padding="x" className="mb-24">
        {policies.map((policy) => {
          if (policy === null) {
            return;
          }
          return (
            <Heading className="font-normal text-heading" key={policy.id}>
              <Link to={`/policies/${policy.handle}`}>{policy.title}</Link>
            </Heading>
          );
        })}
      </Section>
    </Layout>
  );
}

const POLICIES_QUERY = gql`
  fragment Policy on ShopPolicy {
    handle
    id
    title
    url
  }

  query PoliciesQuery {
    shop {
      privacyPolicy {
        ...Policy
      }
      shippingPolicy {
        ...Policy
      }
      termsOfService {
        ...Policy
      }
      refundPolicy {
        ...Policy
      }
    }
  }
`;
