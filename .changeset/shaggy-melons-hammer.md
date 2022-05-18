---
'create-hydrogen-app': minor
---

Add an end-to-end implementation of customer account creation, login, reset password, and logout. The following routes are added:

1. `/account` - An account settings page for the current logged in user. At the moment mostly unimplemented. If the user accesses the route while not logged in, they will be forwarded to `/account/login`.
2. `/account/login` - A page for the user to present their credentials and login.
3. `/account/logout` - An API route that expects a `POST` to delete the current session.
4. `/account/register` - Contains a form for the user to setup a new account. On success, forwards the user to `/account`
5. `/account/recover` - A form for the user to fill out to _initiate_ a password reset. If the form succeeds, an email will be sent to the user with a link to reset their password. Clicking the link leads the user to the page `/account/reset/[resetToken]`.
6. `/account/reset/[resetToken]` - A form to enter a new password. Submits the new password and `resetToken` to `/account/reset`. On success, forwards the user to `/account`.
7. `/account/reset` - An API route to update the user with a new password.

Note: At the moment, the email sent to the user for password resets has the web storefront domain, instead of your hydrogen domain. This will be resolved, but in the mean time, you can manually replace the domain with your hydrogen domain to proceed.

A later release will include a large account admin implementation.
