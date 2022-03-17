import {useNavigate} from '@shopify/hydrogen/client';
import {
  useForm,
  useField,
  notEmpty,
  submitSuccess,
  submitFail,
} from '@shopify/react-form';

export default function AccountCreateForm() {
  const navigate = useNavigate();
  const {
    fields: {email, password, firstName, lastName},
    submit,
    dirty,
    submitErrors,
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
      firstName: useField({
        value: '',
        validates: [],
      }),
      lastName: useField({
        value: '',
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      const accountCreateResponse = await callAccountCreateApi({
        email: fieldValues.email,
        password: fieldValues.password,
        firstName: fieldValues.firstName,
        lastName: fieldValues.lastName,
      });

      if (accountCreateResponse.error) {
        return submitFail([{message: accountCreateResponse.error}]);
      }

      await callLoginApi({
        email: fieldValues.email,
        password: fieldValues.password,
      });

      navigate('/account');
      return submitSuccess();
    },
  });

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-6 mb-4"
      onSubmit={submit}
    >
      {submitErrors.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          {submitErrors.map((error) => (
            <p key={error} className="text-red-500 text-xs italic">
              {error}
            </p>
          ))}
        </div>
      )}
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="firstName"
        >
          First Name
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
            firstName.error ? ' border-red-500 mb-3' : ''
          }`}
          id="firstName"
          name="firstName"
          type="firstName"
          placeholder="First Name"
          value={firstName.value}
          onChange={firstName.onChange}
          onBlur={firstName.onBlur}
        />
        {firstName.error && (
          <p className="text-red-500 text-xs italic">{firstName.error}</p>
        )}
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="lastName"
        >
          Last Name
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
            lastName.error ? ' border-red-500 mb-3' : ''
          }`}
          id="lastName"
          name="lastName"
          type="lastName"
          placeholder="Last Name"
          value={lastName.value}
          onChange={lastName.onChange}
          onBlur={lastName.onBlur}
        />
        {lastName.error && (
          <p className="text-red-500 text-xs italic">{lastName.error}</p>
        )}
      </div>
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
      </div>
    </form>
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
