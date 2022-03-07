import React from 'react';
import {useNavigate} from '@shopify/hydrogen/client';

export default function PasswordResetForm({id, resetToken}) {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = React.useState(null);

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(null);

  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [passwordConfirmError, setPasswordConfirmError] = React.useState(null);

  function passwordValidation() {
    setPasswordError(null);
    setPasswordConfirmError(null);

    let hasError = false;

    if (!password || password.trim() === '') {
      hasError = true;
      setPasswordError('Please enter a password');
    }

    if (!passwordConfirm || passwordConfirm.trim() === '') {
      hasError = true;
      setPasswordConfirmError('Please re-enter a password');
    }

    if (password !== passwordConfirm) {
      hasError = true;
      setPasswordConfirmError('The two password entered did not match.');
    }

    return hasError;
  }

  async function onSubmit() {
    if (passwordValidation()) {
      return;
    }

    const response = await callPasswordResetApi({
      id,
      resetToken,
      password,
    });

    if (response?.error?.length > 0) {
      setSubmitError(response.error[0].message);
      return;
    }

    navigate('/account');
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Reset Password.</h1>
      <p>Enter a new password for your account.</p>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-6 mb-4"
        onSubmit={onSubmit}
      >
        {submitError && (
          <div className="flex items-center justify-center mb-6 bg-zinc-500">
            <p className="m-4 text-s text-white">{submitError}</p>
          </div>
        )}
        <div className="mb-6">
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
              passwordError ? ' border-red-500 mb-3' : ''
            }`}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          {passwordError && (
            <p className="text-red-500 text-xs">{passwordError}</p>
          )}
        </div>
        <div className="mb-6">
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
              passwordConfirmError ? ' border-red-500 mb-3' : ''
            }`}
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="current-password"
            placeholder="Re-enter password"
            aria-label="Re-enter password"
            value={passwordConfirm}
            onChange={(event) => {
              setPasswordConfirm(event.target.value);
            }}
          />
          {passwordConfirmError && (
            <p className="text-red-500 text-xs">{passwordConfirmError}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold uppercase py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}

function callPasswordResetApi({id, resetToken, password}) {
  return fetch(`/api/reset`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id, resetToken, password}),
  })
    .then((res) => {
      if (res.status === 200) {
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
