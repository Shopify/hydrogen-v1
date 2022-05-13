import React from 'react';
import {useNavigate, Link} from '@shopify/hydrogen/client';
import {callLoginApi} from './LoginForm.client';

export default function AccountCreateForm() {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = React.useState(null);

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(null);

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(null);

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

  async function onSubmit(event) {
    event.preventDefault();

    setEmailError(null);
    setPasswordError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(event.target.email);
    if (newEmailError) {
      setEmailError(newEmailError);
    }

    const newPasswordError = passwordValidation(event.target.password);
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
      setSubmitError(accountCreateResponse.error);
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
    <div className="flex justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl">Create an Account.</h1>
        <form noValidate className="pt-6 pb-8 mt-4 mb-4" onSubmit={onSubmit}>
          {submitError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-white">{submitError}</p>
            </div>
          )}
          <div className="mb-4">
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
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-900 text-white uppercase py-2 px-4 focus:shadow-outline block w-full"
              type="submit"
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
      </div>
    </div>
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
