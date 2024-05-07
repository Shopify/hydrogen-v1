# User authentication


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen includes built-in support for managing user authentication, including account creation, login, password reset, and logout. This guide describes the routes, hooks, and components that you can use to implement an end-to-end user authentication experience.

## User account routes

The [Demo Store template](/tutorials/getting-started/templates/) contains the following user account-specific routes:

| Route        | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| `/account`      | An account settings page for the current logged in user. If the user isn't logged in when they access this page, then they're redirected to `/account/login`. |
| `/account/login` | A page for the user to enter their credentials and log in.                                        |
| `/account/logout` | An API route that expects a `POST` request to delete the current session.                                               |
| `/account/register` | A form for the user to set up a new account. On success, the user is redirected to `/account`. |
| `/account/recover` | A form for the user to initiate a password reset. If the form is sent successfully, then an email is sent to the user with a link to reset their password. Clicking the link leads the user to the `/account/reset/[id]/[resetToken]` page. |
| `/account/reset/[id]/[resetToken]` | A form for the user to enter a new password. The user submits the new password and `resetToken` to `/account/reset`. On success, the user is redirected to `/account`. |
| `/account/reset` | An API route to update the new password for the user. |
| `/account/activate/[id]/[activationToken]` | A form to activate the new user. The user should only reach this form from a link in their email. The user submits the password and `activationToken` to `/account/activate`. On success, the user is redirected to `/account`. |
| `/account/activate` | An API route to activate the user account. |
| `/address` | An API route for creating a new address. |
| `/address/[addressId]` | An API route for updating and deleting an address. |
| `/orders/[orderId]` | A page to view the details of an order. Requires the user to be authenticated. |

## Configuring user authentication

You can [configure user authentication](/tutorials/authentication/configure-user-authentication/) with the following tasks:

- Retrieve a customer access token
- Tell bots not to index a page

## Next steps

- Learn how to [manage customer accounts](https://shopify.dev/docs/custom-storefronts/customer-accounts) with the Storefront API.
- Get familiar with the [file-based routing system](/tutorials/routing/) that Hydrogen uses.
- Learn about the Hydrogen framework's built-in support for [session management](/tutorials/sessions/).
- Learn how to customize the output of [SEO-related tags](/tutorials/seo/manage-seo/) in your Hydrogen client and server components.
