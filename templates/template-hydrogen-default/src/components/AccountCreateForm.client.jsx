import React from 'react';
import {useNavigate, Link} from '@shopify/hydrogen/client';

export default function AccountCreateForm() {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = React.useState(null);

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(null);

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(null);

  function emailValidation(email) {
    if (!email || email.trim() === '') {
      return 'Please enter an email';
    }
  }

  function passwordValidation(password) {
    if (!password || password.trim() === '') {
      return 'Please enter a password';
    }

    if (password.trim().length < 6) {
      return 'Password must be at least 6 characters';
    }
  }

  async function onSubmit() {
    setEmailError(null);
    setPasswordError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(email);
    if (newEmailError) {
      setEmailError(newEmailError);
    }

    const newPasswordError = passwordValidation(password);
    if (newPasswordError) {
      setPasswordError(newPasswordError);
    }

    if (newEmailError || newPasswordError) {
      return;
    }

    const accountCreateResponse = await callAccountCreateApi({
      email,
      password,
    });

    if (accountCreateResponse.error) {
      setSubmitError(accountCreateResponse.error[0].message);
      return;
    }

    // this can be avoided if customerCreate mutation returns customerAccessToken
    await callLoginApi({
      email,
      password,
    });

    navigate('/account');
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Create an Account.</h1>
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
              emailError ? ' border-red-500 mb-3' : ''
            }`}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            aria-label="Email address"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
        </div>
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
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold uppercase py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onSubmit}
          >
            Create Account
          </button>
        </div>
        <div className="flex items-center mt-4">
          <p className="align-baseline text-sm">
            Already have an account? &nbsp;
            <Link className="inline underline" to="/account">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

function callAccountCreateApi({email, password, firstName, lastName}) {
  return fetch(`/account/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, firstName, lastName}),
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

function callLoginApi({email, password}) {
  return fetch(`/account/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
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
