import {useServerProps} from '@shopify/hydrogen';
import {useState} from 'react';

export default function EditAddress({address, defaultAddress}) {
  const {setServerProps} = useServerProps();
  const close = () => setServerProps('editingAddress', null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [address1, setAddress1] = useState(address?.address1 || '');
  const [address2, setAddress2] = useState(address?.address2 || '');
  const [firstName, setFirstName] = useState(address?.firstName || '');
  const [lastName, setLastName] = useState(address?.lastName || '');
  const [company, setCompany] = useState(address?.company || '');
  const [country, setCountry] = useState(address?.country || '');
  const [province, setProvince] = useState(address?.province || '');
  const [city, setCity] = useState(address?.city || '');
  const [phone, setPhone] = useState(address?.phone || '');

  const [isDefaultAddress, setIsDefaultAddress] = useState(defaultAddress);

  async function onSubmit(event) {
    event.preventDefault();

    setSaving(true);

    const response = await callUpdateAddressApi({
      id: address?.originalId,
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
    });

    setSaving(false);

    if (response.error) {
      setSubmitError(response.error);
      return;
    }

    close();
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="max-w-md w-full">
        <button onClick={close}>{'< Back'}</button>
        <h1 className="text-5xl mt-4">
          {address ? 'Edit address' : 'Add address'}
        </h1>
        <form noValidate className="mt-6" onSubmit={onSubmit}>
          {submitError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-white">{submitError}</p>
            </div>
          )}
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="firstname"
              name="firstname"
              required
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="lastname"
              name="lastname"
              required
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Company"
              aria-label="Company"
              value={company}
              onChange={(event) => {
                setCompany(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="street1"
              name="street1"
              type="text"
              autoComplete="address-line1"
              placeholder="Address line 1*"
              required
              aria-label="Address line 1"
              value={address1}
              onChange={(event) => {
                setAddress1(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="address2"
              name="address2"
              type="text"
              autoComplete="address-line2"
              placeholder="Addresss line 2"
              aria-label="Address line 2"
              value={address2}
              onChange={(event) => {
                setAddress2(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="country"
              name="country"
              type="text"
              autoComplete="country-name"
              placeholder="Country"
              required
              aria-label="Country"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="state"
              name="state"
              type="text"
              autoComplete="address-level1"
              placeholder="State"
              required
              aria-label="State"
              value={province}
              onChange={(event) => {
                setProvince(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="city"
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="City"
              aria-label="City"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone"
              aria-label="Phone"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
              }}
            />
          </div>
          <div className="mt-4">
            <input
              type="checkbox"
              value=""
              name="defaultAddress"
              id="defaultAddress"
              checked={isDefaultAddress}
              className="accent-black"
              onChange={() => setIsDefaultAddress(!isDefaultAddress)}
            />
            <label
              className="ml-1 inline-block text-gray-800"
              htmlFor="defaultAddress"
            >
              Set as default address
            </label>
          </div>
          <div className="mt-6">
            <button
              className="bg-gray-900 border border-gray-900 text-white uppercase py-3 px-4 focus:shadow-outline block w-full"
              type="submit"
              disabled={saving}
            >
              Save
            </button>
          </div>
          <div>
            <button
              className="mt-3 text-center border border-gray-900 uppercase py-3 px-4 focus:shadow-outline block w-full"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function callUpdateAddressApi({
  id,
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
}) {
  return fetch(
    id ? `/account/address/${encodeURIComponent(id)}` : '/account/address',
    {
      method: id ? 'PATCH' : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    },
  )
    .then((res) => {
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    })
    .catch(() => {
      return {
        error: 'Error saving address. Please try again.',
      };
    });
}
