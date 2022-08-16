import React from 'react';
import {Form} from '@shopify/hydrogen/experimental';
import {multipass} from '~/lib/multipass';

interface FormElements {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

export function LoginFormMultipass() {
  async function loginWithMultipass(
    event: React.FormEvent<HTMLFormElement & FormElements>
  ) {
    event.preventDefault();
    // get email and password.
    const data = event.target.elements;
    const email = data.email.value;
    const customer = {
      email,
      acceptsMarketing: true,
      return_to: `/account`,
      // ...any customer field works including firstName, tags, addresses etc
    };

    // if an account is not found for the email, one will
    // be created with all the customer info passed here
    const {url, error} = await multipass({customer});

    // showcasing manual redirect
    if (url) {
      // url ~ http://localhost:3000/account/login/multipass/jkNFf8b-ukOXNkQ3HB9uVWKGal51t0mA0082SV9akElRUuxi7ejyqC4wfGJRxwR0rdVGo9IU5TDbejSD0caboqaC4UbPDAHdSnJw4QEZqAjz-UbhLA5qCxDFsbwhzvrIuynFeyCrPloxMI4G9VeaT5mxHs046Dqj7LQHhkciKy5r0l5uxgbHD3XyGKULfQF97bh6WPvUfhHmRPNhd-hgSO-LKCmtrnCIZitXZArJS7w=
      window.location.href = url;
    }
  }

  return (
    <Form onSubmit={loginWithMultipass}>
      <input
        type="text"
        name="email"
        placeholder="Email"
        required
        minLength={5}
      />
      <button type="submit">Login Multipass</button>
    </Form>
  );
}
