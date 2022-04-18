import {Form, RSCRequest} from '@shopify/hydrogen';

const users = [
  {
    name: 'Abraham Lincoln',
    username: 'alincoln@shopify.com',
    password: 'somepass',
  },
];

export default function FormServer({error, user}) {
  if (user)
    return (
      <div className="flex justify-center mt-24">
        <div className="w-full max-w-xs">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-green-800 text-center font-bold">
            Welcome {user.name}!
          </div>
        </div>
      </div>
    );

  return (
    <Form action="/form" method="POST">
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
                className={`shadow appearance-none border ${
                  error === 'INVALID_USERNAME' || error === 'INVALID_USER'
                    ? 'border-red-500'
                    : ''
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="username"
                name="username"
                type="text"
                placeholder="Username"
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
                className={`shadow appearance-none border ${
                  error === 'INVALID_PASSWORD' || error === 'INVALID_USER'
                    ? 'border-red-500'
                    : ''
                } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                id="password"
                name="password"
                type="password"
                placeholder="******************"
              />
              <ErrorMessage error={error} />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </div>
          <p className="text-center text-gray-500 text-xs">
            &copy;2020 Acme Corp. All rights reserved.
          </p>
        </div>
      </div>
    </Form>
  );
}

function ErrorMessage({error}) {
  if (!error) return;

  return (
    <p className="text-red-500 text-xs italic">
      {error === 'INVALID_USERNAME'
        ? 'Please choose a username'
        : error === 'INVALID_PASSWORD'
        ? 'Please choose a password'
        : 'Invalid username or password'}
    </p>
  );
}

export async function api(request) {
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');

  // Note, you can throw or return a vanilla `Request` or `Response` object.
  // RSCRequest is just syntactic sugar, the user could manually create a
  // Response object instead.
  if (!username) throw new RSCRequest({error: 'INVALID_USERNAME'});
  if (!password) throw new RSCRequest({error: 'INVALID_PASSWORD'});

  const user = users.find(
    (user) => username === user.username && user.password === password,
  );

  if (!user) {
    throw new RSCRequest({error: 'INVALID_USER'});
  }

  // Really, we'd want to save the user in the session. A separate PR has the session impl
  return new RSCRequest({
    user,
  });
}
