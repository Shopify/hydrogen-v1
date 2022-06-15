import {useServerProps} from '@shopify/hydrogen';
import {useCallback} from 'react';

import {Text, Button} from '~/components';

export function AccountDeleteAddress({addressId}) {
  const {serverProps, setServerProps} = useServerProps();

  const close = useCallback(() => {
    setServerProps('deletingAddress', null);
  }, [setServerProps]);

  async function deleteAddress(id) {
    const response = await callDeleteAddressApi(id);
    if (response.error) {
      alert(response.error);
      return;
    }
    setServerProps('rerender', !serverProps.rerender);
    close();
  }

  return (
    <>
      <Text className="mb-4" as="h3" size="lead">
        Confirm removal
      </Text>
      <Text as="p">Are you sure you wish to remove this address?</Text>
      <div className="mt-6">
        <Button
          className="text-sm"
          onClick={() => {
            deleteAddress(addressId);
          }}
          variant="primary"
          width="full"
        >
          Confirm
        </Button>
        <Button
          className="text-sm mt-2"
          onClick={() => setServerProps('deletingAddress', null)}
          variant="secondary"
          width="full"
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

export function callDeleteAddressApi(id) {
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
