import {useCallback, useState} from 'react';
import {useServerProps} from '@shopify/hydrogen';

function emailValidation(email) {
  if (email.validity.valid) return null;

  return email.validity.valueMissing
    ? 'Please enter an email'
    : 'Please enter a valid email';
}

function passwordValidation(password) {
  if (password.validity.valid) return null;

  if (password.validity.valueMissing) {
    return 'Please enter a password';
  }

  return 'Password must be at least 6 characters';
}

export default function EditAccountDetails({
  firstName: _firstName = '',
  lastName: _lastName = '',
  phone: _phone = '',
  email: _email = '',
}) {
  const {setServerProps} = useServerProps();

  const close = useCallback(
    () => setServerProps('editingAccount', false),
    [setServerProps],
  );

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
    <div className="flex justify-center mt-8">
      <div className="max-w-md w-full">
        <button onClick={close}>{'< Back'}</button>
        <h1 className="text-5xl mt-4">Edit account details</h1>
        <form noValidate className="mt-6" onSubmit={onSubmit}>
          {submitError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-white">{submitError}</p>
            </div>
          )}
          <h2 className="text-xl font-medium">Profile</h2>
          <div className="mt-3">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
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
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
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
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline border-gray-900`}
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
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline ${
                emailError ? ' border-red-500' : 'border-gray-900'
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
              className={`text-red-500 text-xs ${
                !emailError ? 'invisible' : ''
              }`}
            >
              {emailError} &nbsp;
            </p>
          </div>
          <h2 className="text-xl font-medium mt-4">Security</h2>
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
          <p
            className={`text-sm font-medium ${
              currentPasswordError || newPasswordError ? 'text-red-500' : ''
            }`}
          >
            Passwords must be at least 6 characters.
          </p>
          <Password
            name="newPassword2"
            label="Re-enter new password"
            passwordError={newPassword2Error}
          />
          <p
            className={`text-red-500 text-xs ${
              !newPassword2Error ? 'invisible' : ''
            }`}
          >
            {newPassword2Error} &nbsp;
          </p>
          <div className="mt-4">
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

function Password({name, passwordError, label}) {
  const [password, setPassword] = useState('');

  return (
    <div className="mt-3">
      <input
        className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline ${
          passwordError ? ' border-red-500' : 'border-gray-900'
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

function callAccountUpdateApi({
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
