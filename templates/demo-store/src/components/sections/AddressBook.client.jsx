import {useServerProps} from '@shopify/hydrogen';
import {useMemo, useState} from 'react';
import {Text, Button} from '../elements';

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
    <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
      <h3 className="font-bold text-lead">Address Book</h3>
      <div>
        {!addresses?.length ? (
          <Text size="copy" color="subtle">
            No address yet
          </Text>
        ) : null}
        <div className="flex items-center justify-between mb-6">
          <Button
            className="mt-2 text-sm w-full"
            onClick={() => setServerProps('editingAddress', 'NEW')}
            variant="secondary"
          >
            Add an Address
          </Button>
        </div>
        {addresses?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Address({address, defaultAddress, deleteAddress}) {
  const {setServerProps} = useServerProps();
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  console.log('address is', address);

  return (
    <div className="lg:p-8 p-6 border border-gray-200 rounded flex flex-col">
      {showConfirmRemove ? (
        <ConfirmRemove
          deleteAddress={deleteAddress}
          close={() => setShowConfirmRemove(false)}
        />
      ) : null}
      {defaultAddress ? (
        <div className="mb-3 flex flex-row">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-500">
            Default
          </span>
        </div>
      ) : null}
      <ul className="flex-1 flex-row">
        {address.formatted.map((line, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <li key={line + index}>{line}</li>
        ))}
      </ul>

      <div className="flex flex-row font-medium mt-6">
        <button
          onClick={() => setServerProps('editingAddress', address.id)}
          className="text-left underline text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => setShowConfirmRemove(true)}
          className="text-left text-gray-500 ml-6 text-sm"
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
