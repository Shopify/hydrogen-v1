import {useServerProps} from '@shopify/hydrogen';
import {useMemo, useState} from 'react';
import {Text, Button} from '../elements';
import EditAddress from './EditAddress.client';

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
          <Text className="mb-1" width="narrow" as="p" size="copy">
            You haven't saved any addresses yet.
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
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="lg:p-8 p-6 border border-gray-200 rounded flex flex-col">
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <ConfirmRemove
            deleteAddress={deleteAddress}
            setShowModal={setShowModal}
          />
        </Modal>
      )}
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
        {address.formatted.map((line, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <li key={line + index}>{line}</li>
        ))}
      </ul>

      <div className="flex flex-row font-medium mt-6">
        <button
          // onClick={() => setShowModal(true)}
          onClick={() => setServerProps('editingAddress', address.id)}
          className="text-left underline text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => setShowModal(true)}
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

function ConfirmRemove({deleteAddress, setShowModal}) {
  return (
    <div>
      <Text as="h3" size="lead">
        Confirm removal
      </Text>
      <Text as="p">Are you sure you wish to remove this address?</Text>
      <div className="mt-6">
        <Button
          className="text-sm"
          onClick={() => {
            deleteAddress();
            setShowModal(false);
          }}
          variant="primary"
          width="full"
        >
          Confirm
        </Button>
        <Button
          className="text-sm mt-2"
          onClick={() => setShowModal(false)}
          variant="secondary"
          width="full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function Modal({setShowModal, children}) {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="modal-bg"
      onClick={() => setShowModal(false)}
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div
            className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
