import {Form} from '@shopify/hydrogen/experimental';
import {useCallback} from 'react';
import {useState} from 'react';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const INVALID_USER = 'INVALID_USER';
export const INVALID_USERNAME = 'INVALID_USERNAME';
export const INVALID_PASSWORD = 'INVALID_PASSWORD';

export function LoginForm({error}) {
  const invalidUserOrPass = error === INVALID_USER;

  const [invalidUserName, setInvalidUserName] = useState(
    error ? error === error.INVALID_USER : false
  );

  const [invalidPassword, setInvalidPassword] = useState(
    error ? error === error.INVALID_PASSWORD : false
  );

  const checkUserName = useCallback(
    (target) => {
      const valid = target.validity.valid;
      setInvalidUserName(!valid);
      return valid;
    },
    [setInvalidUserName]
  );

  const checkPassword = useCallback(
    (target) => {
      const valid = target.validity.valid;
      setInvalidPassword(!valid);
      return valid;
    },
    [setInvalidPassword]
  );

  return (
    <Form
      action="/account"
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
      {({loading}) => (
        <>
          <input type="hidden" name="action" value="login" />
          <div>
            <div>
              <label htmlFor="username">Username</label>
              <input
                onBlur={(e) => checkUserName(e.target)}
                style={{
                  border:
                    invalidUserName || error === INVALID_USER
                      ? '1px solid red'
                      : '1px solid black',
                }}
                id="username"
                name="username"
                type="email"
                placeholder="Username"
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                onBlur={(e) => checkPassword(e.target)}
                style={{
                  border:
                    invalidPassword || error === INVALID_USER
                      ? '1px solid red'
                      : '1px solid black',
                }}
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
            <button disabled={loading} type="submit">
              {loading ? <div>Loading!</div> : 'Sign In'}
            </button>
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
    <p>
      {invalidUserName
        ? 'Please choose a username'
        : invalidPassword
        ? 'Please choose a password'
        : 'Invalid username or password'}
    </p>
  );
}
