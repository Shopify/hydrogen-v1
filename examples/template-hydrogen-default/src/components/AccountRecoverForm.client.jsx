import {useNavigate} from '@shopify/hydrogen/client';
import {
  useForm,
  useField,
  notEmpty,
  submitSuccess,
  submitFail,
} from '@shopify/react-form';

export default function AccountRecoverForm() {
  const navigate = useNavigate();
  const {
    fields: {email},
    submit,
    dirty,
    submitErrors,
  } = useForm({
    fields: {
      email: useField({
        value: '',
        validates: [notEmpty('Email is required')],
      }),
    },
    onSubmit: async (fieldValues) => {
      const response = await callAccountRecoverApi({
        email: fieldValues.email,
      });

      if (response.error) {
        return submitFail([{message: response.error}]);
      }

      navigate('/account', {fromRecover: true});
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
          autoComplete="email"
          placeholder="Email"
          value={email.value}
          onChange={email.onChange}
          onBlur={email.onBlur}
        />
        {email.error && (
          <p className="text-red-500 text-xs italic">{email.error}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={!dirty}
          onClick={submit}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

function callAccountRecoverApi({email, password, firstName, lastName}) {
  return fetch(`/account/recover`, {
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
