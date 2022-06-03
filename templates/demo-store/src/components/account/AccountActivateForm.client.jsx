import React from 'react';
import {useNavigate} from '@shopify/hydrogen/client';

export default function AccountActivateForm({id, activationToken}) {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = React.useState(null);

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(null);

  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [passwordConfirmError, setPasswordConfirmError] = React.useState(null);

  function passwordValidation(form) {
    setPasswordError(null);
    setPasswordConfirmError(null);

    let hasError = false;

    if (!form.password.validity.valid) {
      hasError = true;
      setPasswordError(
        form.password.validity.valueMissing
          ? 'Please enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (!form.passwordConfirm.validity.valid) {
      hasError = true;
      setPasswordConfirmError(
        form.password.validity.valueMissing
          ? 'Please re-enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (password !== passwordConfirm) {
      hasError = true;
      setPasswordConfirmError('The two password entered did not match.');
    }

    return hasError;
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (passwordValidation(event.target)) {
      return;
    }

    const response = await callActivateApi({
      id,
      activationToken,
      password,
    });

    if (response.error) {
      setSubmitError(response.error);
      return;
    }

    navigate('/account');
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl">Activate Account.</h1>
        <p className="mt-4">Create your password to activate your account.</p>
        <form noValidate className="pt-6 pb-8 mt-4 mb-4" onSubmit={onSubmit}>
          {submitError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-white">{submitError}</p>
            </div>
          )}
          <div className="mb-4">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline ${
                passwordError ? ' border-red-500' : 'border-gray-900'
              }`}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              minLength={8}
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <p
              className={`text-red-500 text-xs ${
                !passwordError ? 'invisible' : ''
              }`}
            >
              {passwordError} &nbsp;
            </p>
          </div>
          <div className="mb-4">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline ${
                passwordConfirmError ? ' border-red-500' : 'border-gray-900'
              }`}
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="current-password"
              placeholder="Re-enter password"
              aria-label="Re-enter password"
              value={passwordConfirm}
              required
              minLength={8}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
              }}
            />
            <p
              className={`text-red-500 text-xs ${
                !passwordConfirmError ? 'invisible' : ''
              }`}
            >
              {passwordConfirmError} &nbsp;
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-900 text-white uppercase py-2 px-4 focus:shadow-outline block w-full"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function callActivateApi({id, activationToken, password}) {
  return fetch(`/account/activate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id, activationToken, password}),
  })
    .then((res) => {
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    })
    .catch((error) => {
      return {
        error: error.toString(),
      };
    });
}
