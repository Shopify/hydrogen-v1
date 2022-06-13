import {useMemo} from 'react';
import {useServerProps} from '@shopify/hydrogen';

import {Text, Button} from '~/components/elements';

import {callDeleteAddressApi} from './DeleteAddress.client';

export function AddressBook({addresses, defaultAddress}) {
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
    if (response.error) {
      // TODO: improve error handling UI
      alert(response.error);
      return;
    }
    setServerProps('rerender', !serverProps.rerender);
  }

  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead">Address Book</h3>
        <div>
          {!addresses?.length ? (
            <Text className="mb-1" width="narrow" as="p" size="copy">
              You haven&apos;t saved any addresses yet.
            </Text>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Button
              className="mt-2 text-sm w-full max-w-xl mb-6"
              onClick={() => {
                setServerProps('editingAddress', 'NEW');
              }}
              variant="secondary"
            >
              Add an Address
            </Button>
          </div>
          {addresses?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
    </>
  );
}

function Address({address, defaultAddress}) {
  const {setServerProps} = useServerProps();

  return (
    <div className="lg:p-8 p-6 border border-gray-200 rounded flex flex-col">
      {defaultAddress ? (
        <div className="mb-3 flex flex-row">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-500">
            Default
          </span>
        </div>
      ) : null}
      <ul className="flex-1 flex-row">
        {address.firstName || address.lastName ? (
          <li>
            {(address.firstName && address.firstName + ' ') + address.lastName}
          </li>
        ) : (
          <></>
        )}
        {address.formatted ? (
          address.formatted.map((line) => <li key={line}>{line}</li>)
        ) : (
          <></>
        )}
      </ul>

      <div className="flex flex-row font-medium mt-6">
        <button
          onClick={() => {
            setServerProps('editingAddress', address.id);
          }}
          className="text-left underline text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => {
            setServerProps('deletingAddress', address.id);
          }}
          className="text-left text-gray-500 ml-6 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
