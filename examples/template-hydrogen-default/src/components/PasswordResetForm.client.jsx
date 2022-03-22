import {useNavigate} from '@shopify/hydrogen/client';
import {
  useForm,
  useField,
  notEmpty,
  submitSuccess,
  submitFail,
} from '@shopify/react-form';

export default function PasswordResetForm({id, resetToken}) {
  const navigate = useNavigate();
  const {
    fields: {password, passwordConfirm},
    submit,
    dirty,
    submitErrors,
  } = useForm({
    fields: {
      password: useField({
        value: '',
        validates: [notEmpty('Password is required')],
      }),
      passwordConfirm: useField({
        value: '',
        validates: [notEmpty('Confirm password is required')],
      }),
    },
    onSubmit: async (fieldValues) => {
      const response = await callPasswordResetApi({
        id,
        resetToken,
        password: fieldValues.password,
      });

      if (response.error) {
        return submitFail([{message: response.error}]);
      }

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
          autoComplete="current-password"
          placeholder="Password"
          value={password.value}
          onChange={password.onChange}
          onBlur={password.onBlur}
        />
        {password.error && (
          <p className="text-red-500 text-xs italic">{password.error}</p>
        )}
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="passwordConfirm"
        >
          Confirm password
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline${
            passwordConfirm.error ? ' border-red-500 mb-3' : ''
          }`}
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="current-password"
          placeholder="Confirm password"
          value={passwordConfirm.value}
          onChange={passwordConfirm.onChange}
          onBlur={passwordConfirm.onBlur}
        />
        {passwordConfirm.error && (
          <p className="text-red-500 text-xs italic">{passwordConfirm.error}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={!dirty}
          onClick={submit}
        >
          Reset password
        </button>
      </div>
    </form>
  );
}

function callPasswordResetApi({id, resetToken, password}) {
  return fetch(`/api/reset`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id, resetToken, password}),
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
