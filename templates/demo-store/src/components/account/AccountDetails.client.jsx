import {useServerProps} from '@shopify/hydrogen';
import {useCallback} from 'react';

export default function AccountDetails({firstName, lastName, phone, email}) {
  const {setServerProps} = useServerProps();

  const startEditing = useCallback(
    () => setServerProps('editingAccount', true),
    [setServerProps],
  );

  return (
    <div className="mt-6">
      <h2 className="text-2xl">Account Details</h2>
      <div className="bg-white p-4 mt-4">
        <div className="flex">
          <h3 className="font-medium flex-1">Profile & Security</h3>
          <button onClick={startEditing} className="underline">
            Edit
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">Name</div>
        <p className="mt-1">
          {firstName || lastName
            ? firstName ?? '' + lastName ?? ''
            : 'Add name'}{' '}
        </p>

        <div className="mt-4 text-sm text-gray-500">Contact</div>
        <p className="mt-1">{phone ?? 'Add mobile'}</p>

        <div className="mt-4 text-sm text-gray-500">Email aaddress</div>
        <p className="mt-1">{email}</p>

        <div className="mt-4 text-sm text-gray-500">Password</div>
        <p className="mt-1">**************</p>
      </div>
    </div>
  );
}
