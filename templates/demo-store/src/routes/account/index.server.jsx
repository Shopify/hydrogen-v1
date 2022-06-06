import {
  Seo,
  useSession,
  NoStore,
  useShop,
  useShopQuery,
  flattenConnection,
  gql,
} from '@shopify/hydrogen';

import {getApiErrorMessage} from '../../components/utilities/api.helper';
import AccountDetails from '../../components/sections/AccountDetails.client';
import AddressBook from '../../components/sections/AddressBook.client';
import Layout from '~/components/layouts/DefaultLayout.server';
import OrderHistory from '~/components/sections/OrderHistory.client';
import LogoutButton from '~/components/elements/LogoutButton.client';
import EditAccountDetails from '~/components/sections/EditAccountDetails.client';
import EditAddress from '~/components/sections/EditAddress.client';
import {
  FeaturedCollections,
  ProductSwimlane,
  Locations,
  PageHeader,
} from '~/components/sections';

import {LOCATION_CARD_FIELDS, PRODUCT_CARD_FIELDS} from '~/lib/fragments';

export default function Account({response, editingAccount, editingAddress}) {
  response.cache(NoStore());

  const {customerAccessToken, countryCode = 'US'} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
      withAddressDetails: !!editingAddress,
    },
    cache: NoStore(),
  });

  const {customer, featuredCollections, featuredProducts, locations} = data;

  if (!customer) return response.redirect('/account/login');

  const addresses = flattenConnection(customer.addresses).map((address) => ({
    ...address,
    id: address.id.substring(0, address.id.lastIndexOf('?')),
    originalId: address.id,
  }));

  const defaultAddress = customer?.defaultAddress?.id?.substring(
    0,
    customer.defaultAddress.id.lastIndexOf('?'),
  );

  if (editingAccount)
    return (
      <Layout>
        <Seo type="noindex" data={{title: 'Account details'}} />
        <EditAccountDetails
          firstName={customer.firstName}
          lastName={customer.lastName}
          phone={customer.phone}
          email={customer.email}
        />
      </Layout>
    );

  if (editingAddress) {
    const addressToEdit = addresses.find(
      (address) => address.id === editingAddress,
    );

    return (
      <Layout>
        <Seo
          type="noindex"
          data={{title: addressToEdit ? 'Edit address' : 'Add address'}}
        />
        <EditAddress
          address={addressToEdit}
          defaultAddress={defaultAddress === editingAddress}
        />
      </Layout>
    );
  }

  return (
    <AuthenticatedAccount
      customer={customer}
      addresses={addresses}
      defaultAddress={defaultAddress}
      featuredCollections={featuredCollections}
      featuredProducts={featuredProducts}
      locations={locations}
    />
  );
}

export async function api(request, {session, queryShop}) {
  if (request.method !== 'PATCH')
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'PATCH',
      },
    });

  const {customerAccessToken} = await session.get();

  if (!customerAccessToken) return new Response(null, {status: 401});

  const {email, phone, firstName, lastName, newPassword} = await request.json();

  const customer = {};

  if (email) customer.email = email;
  if (phone) customer.phone = phone;
  if (firstName) customer.firstName = firstName;
  if (lastName) customer.lastName = lastName;
  if (newPassword) customer.password = newPassword;

  const {data, errors} = await queryShop({
    query: MUTATION,
    variables: {
      customer,
      customerAccessToken,
    },
    cache: NoStore(),
  });

  const error = getApiErrorMessage('customerUpdate', data, errors);

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  return new Response(null);
}

function AuthenticatedAccount({
  customer,
  addresses,
  defaultAddress,
  featuredCollections,
  featuredProducts,
  locations,
}) {
  const orders =
    customer?.orders?.edges.length > 0
      ? flattenConnection(customer.orders)
      : [];

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Account details'}} />
      <PageHeader heading={heading}>
        <LogoutButton>Sign out</LogoutButton>
      </PageHeader>
      {orders && <OrderHistory orders={orders} />}
      <AccountDetails
        firstName={customer.firstName}
        lastName={customer.lastName}
        phone={customer.phone}
        email={customer.email}
      />
      <AddressBook defaultAddress={defaultAddress} addresses={addresses} />
      <FeaturedCollections
        title="Popular Collections"
        data={featuredCollections.nodes}
      />
      <ProductSwimlane data={featuredProducts.nodes} />
      <Locations data={locations.nodes} />
    </Layout>
  );
}

const QUERY = gql`
  ${LOCATION_CARD_FIELDS}
  ${PRODUCT_CARD_FIELDS}
  query CustomerDetails(
    $customerAccessToken: String!
    $withAddressDetails: Boolean!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      defaultAddress {
        id
        formatted
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName @include(if: $withAddressDetails)
            lastName @include(if: $withAddressDetails)
            company @include(if: $withAddressDetails)
            address1 @include(if: $withAddressDetails)
            address2 @include(if: $withAddressDetails)
            country @include(if: $withAddressDetails)
            province @include(if: $withAddressDetails)
            city @include(if: $withAddressDetails)
            phone @include(if: $withAddressDetails)
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
    locations: contentEntries(first: 3, type: "stores") {
      nodes {
        ...LocationCardFields
      }
    }
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCardFields
      }
    }
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;

const MUTATION = gql`
  mutation customerUpdate(
    $customer: CustomerUpdateInput!
    $customerAccessToken: String!
  ) {
    customerUpdate(
      customer: $customer
      customerAccessToken: $customerAccessToken
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
