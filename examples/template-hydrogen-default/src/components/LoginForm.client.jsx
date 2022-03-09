import {
  useForm,
  useField,
  notEmpty,
  submitSuccess,
  submitFail,
} from '@shopify/react-form';

export function LoginForm() {
  const {
    fields: {email, password},
    submit,
    dirty,
  } = useForm({
    fields: {
      email: useField({
        value: '',
        validates: [notEmpty('Email is required')],
      }),
      password: useField({
        value: '',
        validates: [notEmpty('Password is required')],
      }),
    },
    onSubmit: async (fieldValues) => {
      const {loginSuccess, error} = await callLoginApi({
        email: fieldValues.email,
        password: fieldValues.password,
      });

      if (loginSuccess) {
        console.log('Login success!');
        return submitSuccess();
      } else {
        console.log('Login fail', error);
        return submitFail();
      }
    },
  });

  function handleForgotPassword() {}

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-6 mb-4"
      onSubmit={submit}
    >
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
            email.error ? ' border-red-500 mb-3' : ''
          }`}
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email.value}
          onChange={email.onChange}
          onBlur={email.onBlur}
        />
        {email.error && (
          <p className="text-red-500 text-xs italic">{email.error}</p>
        )}
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
            password.error ? ' border-red-500 mb-3' : ''
          }`}
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password.value}
          onChange={password.onChange}
          onBlur={password.onBlur}
        />
        {password.error && (
          <p className="text-red-500 text-xs italic">{password.error}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={!dirty}
          onClick={submit}
        >
          Create
        </button>
        <button
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}

export function callLoginApi({email, password}) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  return fetch(`/account/api-login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
  })
    .then((res) => res.json())
    .catch((error) => {
      return {
        error: error.toString(),
      };
    });
}
