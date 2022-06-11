import {
  flattenConnection,
  gql,
  NoStore,
  Seo,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {Modal} from '~/components/blocks';
import {PageHeader, LogoutButton} from '~/components/elements';
import {getApiErrorMessage} from '~/lib/utils';
import {
  AccountDetails,
  AddressBook,
  DeleteAddress,
  EditAccountDetails,
  EditAddress,
  FeaturedCollections,
  OrderHistory,
  ProductSwimlane,
} from '~/components/sections';

import {LOCATION_CARD_FIELDS, PRODUCT_CARD_FIELDS} from '~/lib/fragments';

export default function Account({
  response,
  editingAccount,
  editingAddress,
  deletingAddress,
}) {
  response.cache(NoStore());

  const {customerAccessToken, countryCode = 'US'} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: CUSTOMER_QUERY,
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

  if (editingAccount) {
    return (
      <>
        <AuthenticatedAccount
          customer={customer}
          addresses={addresses}
          defaultAddress={defaultAddress}
          featuredCollections={featuredCollections}
          featuredProducts={featuredProducts}
          locations={locations}
        />
        <Modal closeModalProp="editingAccount">
          <Seo type="noindex" data={{title: 'Account details'}} />
          <EditAccountDetails
            firstName={customer.firstName}
            lastName={customer.lastName}
            phone={customer.phone}
            email={customer.email}
          />
        </Modal>
      </>
    );
  }

  if (editingAddress) {
    const addressToEdit = addresses.find(
      (address) => address.id === editingAddress,
    );
    return (
      <>
        <AuthenticatedAccount
          customer={customer}
          addresses={addresses}
          defaultAddress={defaultAddress}
          featuredCollections={featuredCollections}
          featuredProducts={featuredProducts}
          locations={locations}
        />
        <Modal closeModalProp="editingAddress">
          <Seo
            type="noindex"
            data={{title: addressToEdit ? 'Edit address' : 'Add address'}}
          />
          <EditAddress
            address={addressToEdit}
            defaultAddress={defaultAddress === editingAddress}
          />
        </Modal>
      </>
    );
  }

  if (deletingAddress) {
    const addressToDelete = addresses.find(
      (address) => address.id === deletingAddress,
    );
    return (
      <>
        <AuthenticatedAccount
          customer={customer}
          addresses={addresses}
          defaultAddress={defaultAddress}
          featuredCollections={featuredCollections}
          featuredProducts={featuredProducts}
          locations={locations}
        />
        <Modal closeModalProp="deletingAddress">
          <Seo type="noindex" data={{title: 'Delete address'}} />
          <DeleteAddress addressId={addressToDelete.originalId} />
        </Modal>
      </>
    );
  }

  return (
    <>
      <AuthenticatedAccount
        customer={customer}
        addresses={addresses}
        defaultAddress={defaultAddress}
        featuredCollections={featuredCollections}
        featuredProducts={featuredProducts}
        locations={locations}
      />
    </>
  );
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
    </Layout>
  );
}

const CUSTOMER_QUERY = gql`
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
            firstName
            lastName
            company @include(if: $withAddressDetails)
            address1 @include(if: $withAddressDetails)
            address2 @include(if: $withAddressDetails)
            country @include(if: $withAddressDetails)
            province @include(if: $withAddressDetails)
            city @include(if: $withAddressDetails)
            zip @include(if: $withAddressDetails)
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

const CUSTOMER_UPDATE_MUTATION = gql`
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

export async function api(request, {session, queryShop}) {
  if (request.method !== 'PATCH')
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'PATCH',
      },
    });

  if (request.method !== 'DELETE')
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'DELETE',
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
    query: CUSTOMER_UPDATE_MUTATION,
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
