import {useCallback, useState} from 'react';
import {useServerProps} from '@shopify/hydrogen';

import {Text, Button} from '~/components/elements';
import {emailValidation, passwordValidation} from '~/lib/utils';

export function EditAccountDetails({
  firstName: _firstName = '',
  lastName: _lastName = '',
  phone: _phone = '',
  email: _email = '',
}) {
  const {setServerProps} = useServerProps();

  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(_firstName);
  const [lastName, setLastName] = useState(_lastName);
  const [phone, setPhone] = useState(_phone);
  const [email, setEmail] = useState(_email);
  const [emailError, setEmailError] = useState(null);
  const [currentPasswordError, setCurrentPasswordError] = useState();
  const [newPasswordError, setNewPasswordError] = useState();
  const [newPassword2Error, setNewPassword2Error] = useState();
  const [submitError, setSubmitError] = useState(null);

  const close = useCallback(
    () => setServerProps('editingAccount', false),
    [setServerProps],
  );

  async function onSubmit(event) {
    event.preventDefault();

    setEmailError(null);
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setNewPassword2Error(null);

    const emailError = emailValidation(event.target.email);
    if (emailError) {
      setEmailError(emailError);
    }

    let currentPasswordError, newPasswordError, newPassword2Error;

    // Only validate the password fields if the current password has a value
    if (event.target.currentPassword.value) {
      currentPasswordError = passwordValidation(event.target.currentPassword);
      if (currentPasswordError) {
        setCurrentPasswordError(currentPasswordError);
      }

      newPasswordError = passwordValidation(event.target.newPassword);
      if (newPasswordError) {
        setNewPasswordError(newPasswordError);
      }

      newPassword2Error =
        event.target.newPassword.value !== event.target.newPassword2.value
          ? 'The two passwords entered did not match'
          : null;
      if (newPassword2Error) {
        setNewPassword2Error(newPassword2Error);
      }
    }

    if (
      emailError ||
      currentPasswordError ||
      newPasswordError ||
      newPassword2Error
    ) {
      return;
    }

    setSaving(true);

    const accountUpdateResponse = await callAccountUpdateApi({
      email,
      newPassword: event.target.newPassword.value,
      currentPassword: event.target.currentPassword.value,
      phone,
      firstName,
      lastName,
    });

    setSaving(false);

    if (accountUpdateResponse.error) {
      setSubmitError(accountUpdateResponse.error);
      return;
    }

    close();
  }

  return (
    <>
      <Text className="mt-4 mb-6" as="h3" size="lead">
        Update your profile
      </Text>
      <form noValidate onSubmit={onSubmit}>
        {submitError && (
          <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
            <p className="m-4 text-sm text-red-900">{submitError}</p>
          </div>
        )}
        <div className="mt-3">
          <input
            className={`appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-500 rounded`}
            id="firstname"
            name="firstname"
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
            className={`appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-500 rounded`}
            id="lastname"
            name="lastname"
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
            className={`appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-500 rounded`}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Mobile"
            aria-label="Mobile"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
          />
        </div>
        <div className="mt-3">
          <input
            className={`appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline rounded ${
              emailError ? ' border-red-500' : 'border-gray-500'
            }`}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <p
            className={`text-red-500 text-xs ${!emailError ? 'invisible' : ''}`}
          >
            {emailError} &nbsp;
          </p>
        </div>
        <Text className="mb-6 mt-6" as="h3" size="lead">
          Change your password
        </Text>
        <Password
          name="currentPassword"
          label="Current password"
          passwordError={currentPasswordError}
        />
        <Password
          name="newPassword"
          label="New password"
          passwordError={newPasswordError}
        />
        <Password
          name="newPassword2"
          label="Re-enter new password"
          passwordError={newPassword2Error}
        />
        <Text
          size="fine"
          color="subtle"
          className={`mt-1 ${
            currentPasswordError || newPasswordError ? 'text-red-500' : ''
          }`}
        >
          Passwords must be at least 6 characters.
        </Text>
        <Text
          size="fine"
          className={`mt-1 text-red-500 ${
            newPassword2Error ? '' : 'invisible'
          }`}
        >
          {newPassword2Error} &nbsp;
        </Text>
        <div className="mt-6">
          <Button
            className="text-sm mb-2"
            variant="primary"
            width="full"
            type="submit"
            disabled={saving}
          >
            Save
          </Button>
        </div>
        <div className="mb-4">
          <Button
            className="text-sm"
            variant="secondary"
            width="full"
            onClick={close}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}

function Password({name, passwordError, label}) {
  const [password, setPassword] = useState('');

  return (
    <div className="mt-3">
      <input
        className={`appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline rounded ${
          passwordError ? ' border-red-500' : 'border-gray-500'
        }`}
        id={name}
        name={name}
        type="password"
        autoComplete={name === 'currentPassword' ? 'current-password' : null}
        placeholder={label}
        aria-label={label}
        value={password}
        minLength={8}
        required
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
    </div>
  );
}

export function callAccountUpdateApi({
  email,
  phone,
  firstName,
  lastName,
  currentPassword,
  newPassword,
}) {
  return fetch(`/account`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      phone,
      firstName,
      lastName,
      currentPassword,
      newPassword,
    }),
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
        error: 'Error saving account. Please try again.',
      };
    });
}
