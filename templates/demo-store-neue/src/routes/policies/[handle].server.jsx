import {
  useShop,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {PageHeader} from '~/components/elements';
import {NotFound} from '~/components/pages';

export default function Policy({params}) {
  const {languageCode} = useShop();
  const {handle} = params;

  // standard policy pages
  const policy = {
    privacyPolicy: handle === 'privacy-policy',
    shippingPolicy: handle === 'shipping-policy',
    termsOfService: handle === 'terms-of-service',
    refundPolicy: handle === 'refund-policy',
  };

  // if not a valid policy route, return not found
  if (
    !policy.privacyPolicy &&
    !policy.shippingPolicy &&
    !policy.termsOfService &&
    !policy.refundPolicy
  ) {
    return <NotFound />;
  }

  // The currently visited policy page key
  const activePolicy = Object.keys(policy).find((key) => policy[key]);

  const {data} = useShopQuery({
    query: POLICIES_QUERY,
    variables: {
      languageCode,
      ...policy,
    },
  });

  const page = data?.shop?.[activePolicy];

  // If the policy page is empty, return not found
  if (!page) {
    return <NotFound />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
      resourceId: page.id,
    },
  });

  return (
    <Layout>
      <Seo type="page" data={page} />
      <PageHeader heading={page.title} variant="page">
        <div
          dangerouslySetInnerHTML={{__html: page.body}}
          className="prose dark:prose-invert w-full md:w-4/5"
        />
      </PageHeader>
    </Layout>
  );
}

const POLICIES_QUERY = gql`
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesQuery(
    $languageCode: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $languageCode) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;
