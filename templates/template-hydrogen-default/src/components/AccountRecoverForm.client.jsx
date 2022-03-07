import React from 'react';

export default function AccountRecoverForm() {
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(null);

  function emailValidation(email) {
    if (!email || email.trim() === '') {
      return 'Please enter an email';
    }
  }

  async function onSubmit() {
    setEmailError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(email);
    if (newEmailError) {
      setEmailError(newEmailError);
      return;
    }

    const response = await callAccountRecoverApi({
      email,
    });

    if (response?.error?.length > 0) {
      setSubmitError(response.error[0].message);
      return;
    }

    setSubmitSuccess(true);
  }

  return (
    <>
      {submitSuccess ? (
        <>
          <h1 className="text-2xl font-bold">Request Sent.</h1>
          <p className="mt-6">
            If that email address is in our system, you will receive an email
            with instructions about how to reset your password in a few minutes.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Forgot Password.</h1>
          <p className="mt-6">
            Enter the email address associated with your account to recieve a
            link to reset your password.
          </p>
        </>
      )}
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-6 mb-4"
        onSubmit={onSubmit}
      >
        {submitError && (
          <div className="flex items-center justify-center mb-6 bg-zinc-500">
            <p className="m-4 text-s text-white">{submitError}</p>
          </div>
        )}
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
            Request Reset Link
          </button>
        </div>
      </form>
    </>
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
