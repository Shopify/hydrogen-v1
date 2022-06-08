import {NoStore, gql} from '@shopify/hydrogen';
import {setDefaultAddress} from './address/[addressId].server';
import {getApiErrorMessage} from '../../components/utilities/api.helper';

export async function api(request, {session, queryShop}) {
  if (request.method !== 'POST')
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    });

  const {customerAccessToken} = await session.get();

  if (!customerAccessToken) return new Response(null, {status: 401});

  const {
    firstName,
    lastName,
    company,
    address1,
    address2,
    country,
    province,
    city,
    phone,
    isDefaultAddress,
  } = await request.json();

  const address = {};

  if (firstName) address.firstName = firstName;
  if (lastName) address.lastName = lastName;
  if (company) address.company = company;
  if (address1) address.address1 = address1;
  if (address2) address.address2 = address2;
  if (country) address.country = country;
  if (province) address.province = province;
  if (city) address.city = city;
  if (phone) address.phone = phone;

  const {data, errors} = await queryShop({
    query: CREATE_ADDRESS,
    variables: {
      address,
      customerAccessToken,
    },
    cache: NoStore(),
  });

  const error = getApiErrorMessage('customerAddressCreate', data, errors);

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  if (isDefaultAddress) {
    const {data: defaultDataResponse, errors} = await setDefaultAddress(
      queryShop,
      data.customerAddressCreate.customerAddress.id,
      customerAccessToken,
    );

    const error = getApiErrorMessage(
      'customerDefaultAddressUpdate',
      defaultDataResponse,
      errors,
    );

    if (error) return new Response(JSON.stringify({error}), {status: 400});
  }

  return new Response(null);
}

const CREATE_ADDRESS = gql`
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
  ) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
