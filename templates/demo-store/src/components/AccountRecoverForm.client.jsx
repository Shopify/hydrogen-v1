import React from 'react';

export default function AccountRecoverForm() {
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(null);

  function emailValidation(email) {
    if (email.validity.valid) return null;

    return email.validity.valueMissing
      ? 'Please enter an email'
      : 'Please enter a valid email';
  }

  async function onSubmit(event) {
    event.preventDefault();

    setEmailError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(event.target.email);

    if (newEmailError) {
      setEmailError(newEmailError);
      return;
    }

    await callAccountRecoverApi({
      email,
    });

    setEmail('');
    setSubmitSuccess(true);
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full">
        {submitSuccess ? (
          <>
            <h1 className="text-4xl">Request Sent.</h1>
            <p className="mt-4">
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl">Forgot Password.</h1>
            <p className="mt-4">
              Enter the email address associated with your account to recieve a
              link to reset your password.
            </p>
          </>
        )}
        <form noValidate className="pt-6 pb-8 mt-4 mb-4" onSubmit={onSubmit}>
          {submitError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-white">{submitError}</p>
            </div>
          )}
          <div className="mb-4">
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-gray-800 placeholder:text-gray-500 leading-tight focus:shadow-outline ${
                emailError ? ' border-red-500' : 'border-gray-900'
              }`}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <p
              className={`text-red-500 text-xs ${
                !emailError ? 'invisible' : ''
              }`}
            >
              {emailError} &nbsp;
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-900 text-white uppercase py-2 px-4 focus:shadow-outline block w-full"
              type="submit"
            >
              Request Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
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
