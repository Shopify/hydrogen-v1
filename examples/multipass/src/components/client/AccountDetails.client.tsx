import React from 'react';
import {Link} from '@shopify/hydrogen';

export function AccountDetails({
  firstName,
  lastName,
  email,
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  return (
    <div>
      <h3>Account Details</h3>
      <p className="mt-1">
        {firstName || lastName
          ? (firstName ? firstName + ' ' : '') + lastName
          : 'Add name'}{' '}
      </p>

      <h3>Contact</h3>
      <p className="mt-1">{email}</p>
      <Link to="/">Back Home</Link>
    </div>
  );
}
