import {useServerProps} from '@shopify/hydrogen';
import {useMemo, useState} from 'react';

export default function AddressBook({addresses, defaultAddress}) {
  const {serverProps, setServerProps} = useServerProps();

  const {fullDefaultAddress, addressesWithoutDefault} = useMemo(() => {
    const defaultAddressIndex = addresses.findIndex(
      (address) => address.id === defaultAddress,
    );
    return {
      addressesWithoutDefault: [
        ...addresses.slice(0, defaultAddressIndex),
        ...addresses.slice(defaultAddressIndex + 1, addresses.length),
      ],
      fullDefaultAddress: addresses[defaultAddressIndex],
    };
  }, [addresses, defaultAddress]);

  async function deleteAddress(id) {
    const response = await callDeleteAddressApi(id);
    if (response.error) alert(response.error);
    else setServerProps('rerender', !serverProps.rerender);
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl">Address Book</h2>
      {!addresses?.length ? (
        <p className="mt-2 text-sm text-gray-500">No address yet</p>
      ) : null}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setServerProps('editingAddress', 'NEW')}
          className="text-center border border-gray-900 uppercase py-3 px-4 focus:shadow-outline block w-full"
        >
          Add an address
        </button>
      </div>
      {addresses?.length ? (
        <>
          {fullDefaultAddress ? (
            <Address
              address={fullDefaultAddress}
              defaultAddress
              deleteAddress={deleteAddress.bind(
                null,
                fullDefaultAddress.originalId,
              )}
            />
          ) : null}
          {addressesWithoutDefault.map((address) => (
            <Address
              key={address.id}
              address={address}
              deleteAddress={deleteAddress.bind(null, address.originalId)}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}

function Address({address, defaultAddress, deleteAddress}) {
  const {setServerProps} = useServerProps();
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  return (
    <div className="bg-white p-4 mt-4">
      {showConfirmRemove ? (
        <ConfirmRemove
          deleteAddress={deleteAddress}
          close={() => setShowConfirmRemove(false)}
        />
      ) : null}
      {defaultAddress ? (
        <p className="mb-2 text-sm text-gray-500 font-medium">
          Default Delivery Address
        </p>
      ) : null}
      {address.formatted.map((line, index) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <div className="pt-1" key={line + index}>
          {line}
        </div>
      ))}

      <div className="flex font-medium mt-4">
        <button
          onClick={() => setServerProps('editingAddress', address.id)}
          className="text-left flex-1 underline"
        >
          Edit
        </button>
        <button
          onClick={() => setShowConfirmRemove(true)}
          className="text-left text-gray-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function callDeleteAddressApi(id) {
  return fetch(`/account/address/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => {
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    })
    .catch(() => {
      return {
        error: 'Error removing address. Please try again.',
      };
    });
}

function ConfirmRemove({close, deleteAddress}) {
  return (
    <>
      <div className="fixed w-full h-full bg-white opacity-95 z-50 top-0 left-0"></div>
      <div className="fixed w-full h-full z-50 top-0 left-0">
        <div className="flex justify-center mt-64 items-center">
          <div className="bg-gray-50 max-w-md w-full p-4">
            <div className="text-xl">Confirm removal</div>
            <div>Are you sure you wish to remove this address?</div>

            <div className="mt-6">
              <button
                onClick={() => {
                  close();
                  deleteAddress();
                }}
                className="bg-gray-900 border border-gray-900 text-white uppercase py-3 px-4 focus:shadow-outline block w-full"
              >
                Confirm
              </button>
            </div>
            <div>
              <button
                onClick={close}
                className="mt-3 text-center border border-gray-900 uppercase py-3 px-4 focus:shadow-outline block w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
