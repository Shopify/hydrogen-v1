import {
  Seo,
  useSession,
  NoStore,
  useShopQuery,
  flattenConnection,
  gql,
} from '@shopify/hydrogen';

import {getApiErrorMessage} from '../../components/utilities/api.helper';
import AccountDetails from '../../components/account/AccountDetails.client';
import AddressBook from '../../components/account/AddressBook.client';
import Layout from '../../components/Layout.server';
import OrderHistory from '../../components/account/OrderHistory.server';
import LogoutButton from '../../components/account/LogoutButton.client';
import EditAccountDetails from '../../components/account/EditAccountDetails.client';
import EditAddress from '../../components/account/EditAddress.client';

export default function Account({response, editingAccount, editingAddress}) {
  response.cache(NoStore());

  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      customerAccessToken,
      withAddressDetails: !!editingAddress,
    },
    cache: NoStore(),
  });

  const customer = data.customer;

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

function AuthenticatedAccount({customer, addresses, defaultAddress}) {
  const orders =
    customer?.orders?.edges.length > 0
      ? flattenConnection(customer.orders)
      : [];

  const pageHeader = customer?.firstName
    ? `Hi ${customer.firstName}.`
    : 'Welcome to your account.';

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Account details'}} />
      <div className="flex justify-center mt-10">
        <div className="max-w-md w-full">
          <h1 className="text-5xl">{pageHeader}</h1>
          {customer?.firstName ? (
            <div className="mt-2">Welcome to your account.</div>
          ) : null}
          <div className="flex">
            <span className="flex-1"></span>
            <LogoutButton className="font-medium underline" />
          </div>
          <OrderHistory orders={orders} />
          <AccountDetails
            firstName={customer.firstName}
            lastName={customer.lastName}
            phone={customer.phone}
            email={customer.email}
          />
          <AddressBook defaultAddress={defaultAddress} addresses={addresses} />
        </div>
      </div>
    </Layout>
  );
}

const QUERY = gql`
  query CustomerDetails(
    $customerAccessToken: String!
    $withAddressDetails: Boolean!
  ) {
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

      orders(first: 250) {
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
                }
              }
            }
          }
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
