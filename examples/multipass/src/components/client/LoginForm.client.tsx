import React from 'react';
import {Form} from '@shopify/hydrogen/experimental';

interface FormElements {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

/*
  This is the classic Customer API driven
  login form of /account/login.
*/
export function LoginForm() {
  async function onSubmit(
    event: React.FormEvent<HTMLFormElement & FormElements>
  ) {
    event.preventDefault();
    // get email and password.
    const data = event.target.elements;

    const email = data.email.value;
    const password = data.password.value;

    async function login({email, password}: {email: string; password: string}) {
      try {
        const res = await fetch(`/account/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, password}),
        });
        if (res.ok) {
          return {};
        } else {
          return res.json();
        }
      } catch (error: any) {
        return {
          error: error.toString(),
        };
      }
    }

    const success = await login({email, password});

    if (success) {
      window.location.href = '/account';
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <input
        type="text"
        name="email"
        placeholder="Email"
        required
        minLength={5}
      />
      <input type="password" name="password" required placeholder="Password" />
      <button type="submit">Login (Customer API)</button>
    </Form>
  );
}
