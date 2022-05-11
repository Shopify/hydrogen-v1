import {Form} from '@shopify/hydrogen';
import {useCallback} from 'react';
import {useState} from 'react';
import SpinnerIcon from './SpinnerIcon.client';

export const INVALID_USER = 'INVALID_USER';
export const INVALID_USERNAME = 'INVALID_USERNAME';
export const INVALID_PASSWORD = 'INVALID_PASSWORD';

export function LoginForm({error}) {
  const invalidUserOrPass = error === INVALID_USER;

  const [invalidUserName, setInvalidUserName] = useState(
    error ? error === error.INVALID_USER : false,
  );

  const [invalidPassword, setInvalidPassword] = useState(
    error ? error === error.INVALID_PASSWORD : false,
  );

  const checkUserName = useCallback(
    (target) => {
      const valid = target.validity.valid;
      setInvalidUserName(!valid);
      return valid;
    },
    [setInvalidUserName],
  );

  const checkPassword = useCallback(
    (target) => {
      const valid = target.validity.valid;
      setInvalidPassword(!valid);
      return valid;
    },
    [setInvalidPassword],
  );

  return (
    <Form
      action="/login"
      method="POST"
      noValidate
      onSubmit={(e) => {
        if (
          !checkUserName(e.target.username) ||
          !checkPassword(e.target.password)
        ) {
          e.preventDefault();
        }
      }}
    >
      {(loading) => (
        <>
          <input type="hidden" name="action" value="login" />
          <div className="flex justify-center mt-24">
            <div className="w-full max-w-xs">
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    onBlur={(e) => checkUserName(e.target)}
                    className={`shadow appearance-none border ${
                      invalidUserName || error === INVALID_USER
                        ? 'border-red-500'
                        : ''
                    } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="username"
                    name="username"
                    type="email"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    onBlur={(e) => checkPassword(e.target)}
                    className={`shadow appearance-none border ${
                      invalidPassword || error === INVALID_USER
                        ? 'border-red-500'
                        : ''
                    } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="******************"
                    required
                  />
                  <ErrorMessage
                    errors={{
                      invalidPassword,
                      invalidUserName,
                      invalidUserOrPass,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24 justify-center flex"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? <SpinnerIcon size="24" /> : 'Sign In'}
                  </button>
                </div>
              </div>
              <p className="text-center text-gray-500 text-xs">
                &copy;2020 Acme Corp. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}
    </Form>
  );
}

function ErrorMessage({
  errors: {invalidPassword, invalidUserName, invalidUserOrPass},
}) {
  if (!invalidPassword && !invalidUserName && !invalidUserOrPass) return;

  return (
    <p className="text-red-500 text-xs italic">
      {invalidUserName
        ? 'Please choose a username'
        : invalidPassword
        ? 'Please choose a password'
        : 'Invalid username or password'}
    </p>
  );
}
