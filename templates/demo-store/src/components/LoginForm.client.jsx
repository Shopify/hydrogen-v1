import React from 'react';
import {useNavigate, Link} from '@shopify/hydrogen/client';

export default function LoginForm({shopName}) {
  const navigate = useNavigate();
  const [hasSubmitError, setHasSubmitError] = React.useState(false);
  const [showEmailField, setShowEmailField] = React.useState(true);

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(null);

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(null);

  function emailValidation(email) {
    if (!email || email.trim() === '') {
      return 'Please enter an email';
    }
  }

  function onEmailSubmit() {
    setEmailError(null);

    const error = emailValidation(email);

    if (error) {
      setEmailError(error);
      return;
    }

    setShowEmailField(false);
  }

  function passwordValidation(password) {
    if (!password || password.trim() === '') {
      return 'Please enter a password';
    }
  }

  function resetForm() {
    setShowEmailField(true);
    setEmail('');
    setEmailError(null);
    setPassword('');
    setPasswordError(null);
  }

  async function onPasswordSubmit() {
    setHasSubmitError(false);
    setPasswordError(null);

    const error = passwordValidation(password);

    if (error) {
      setPasswordError(error);
      return;
    }

    const response = await callLoginApi({
      email,
      password,
    });

    if (response.error) {
      setHasSubmitError(true);
      resetForm();
    } else {
      navigate('/account');
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Sign in.</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-6 mb-4"
        onSubmit={onPasswordSubmit}
      >
        {hasSubmitError && (
          <div className="flex items-center justify-center mb-6 bg-zinc-500">
            <p className="m-4 text-s text-white">
              Sorry we did not recognize either your email or password. Please
              try to sign in again or create a new account.
            </p>
          </div>
        )}
        {showEmailField && (
          <EmailField
            shopName={shopName}
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            onSubmit={onEmailSubmit}
          />
        )}
        {!showEmailField && (
          <ValidEmail
            email={email}
            onChangeEmail={() => {
              setShowEmailField(true);
            }}
          />
        )}
        {!showEmailField && (
          <PasswordField
            password={password}
            setPassword={setPassword}
            passwordError={passwordError}
            onSubmit={onPasswordSubmit}
          />
        )}
      </form>
    </>
  );
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

function EmailField({email, setEmail, emailError, shopName, onSubmit}) {
  return (
    <>
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
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold uppercase py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onSubmit}
        >
          Next
        </button>
      </div>
      <div className="flex items-center mt-4">
        <p className="align-baseline text-sm">
          New to {shopName}? &nbsp;
          <Link className="inline underline" to="/account/register">
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}

function ValidEmail({email, onChangeEmail}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p>{email}</p>
        <input
          className="hidden"
          type="text"
          autoComplete="username"
          value={email}
          readOnly
        ></input>
      </div>
      <div>
        <button
          className="inline-block align-baseline text-sm underline"
          type="button"
          onClick={() => {
            onChangeEmail();
          }}
        >
          Change email
        </button>
      </div>
    </div>
  );
}

function PasswordField({password, setPassword, passwordError, onSubmit}) {
  return (
    <>
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
          Sign in
        </button>
        <Link
          className="inline-block align-baseline text-sm text-slate-400"
          to="/account/recover"
        >
          Forgot password
        </Link>
      </div>
    </>
  );
}
