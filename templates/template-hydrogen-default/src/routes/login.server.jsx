import {Form, RequestServerComponents, useSession} from '@shopify/hydrogen';

const users = [
  {
    name: 'Abraham Lincoln',
    username: 'alincoln@shopify.com',
    password: 'somepass',
  },
];

const INVALID_USER = 'INVALID_USER';
const INVALID_USERNAME = 'INVALID_USERNAME';
const INVALID_PASSWORD = 'INVALID_PASSWORD';

export default function FormServer({error}) {
  const {user} = useSession();

  if (user)
    return (
      <div className="flex justify-center mt-24">
        <div className="w-full max-w-xs">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
            <div className="font-bold text-green-800 ">Welcome {user}!</div>
            <div className="mt-4">
              <Form action="/login" method="POST">
                <input type="hidden" name="action" value="logout" />
                <button type="submit">Log out</button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <Form action="/login" method="POST">
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
                className={`shadow appearance-none border ${
                  error === INVALID_USERNAME || error === INVALID_USER
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
                  error === INVALID_PASSWORD || error === INVALID_USER
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

export async function api(request, {session}) {
  const data = await request.formData();
  const action = data.get('action');

  if (action === 'logout') {
    await session.destroy();
    return new RequestServerComponents();
  }

  const username = data.get('username');
  const password = data.get('password');

  // Note, you can throw or return a vanilla `Request` or `Response` object.
  // RequestServerComponents is just syntactic sugar, the user could manually create a
  // Response object instead.
  if (!username)
    throw new RequestServerComponents('/login', {error: INVALID_USERNAME});
  if (!password)
    throw new RequestServerComponents('/login', {error: INVALID_PASSWORD});

  const user = users.find(
    (user) => username === user.username && user.password === password,
  );

  if (!user) {
    throw new RequestServerComponents('/login', {error: INVALID_USER});
  }

  await session.set('user', user.username);

  return new RequestServerComponents();
}
