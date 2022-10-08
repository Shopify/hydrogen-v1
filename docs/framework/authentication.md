---
gid: 1c9b880d-65d4-47bf-b797-0f675de00265
title: User authentication
description: Learn how to build user authentication in your Hydrogen storefront, including account creation, login, password reset, and logout.
---

Hydrogen includes built-in support for managing user authentication, including account creation, login, password reset, and logout. This guide describes the routes, hooks, and components that you can use to implement an end-to-end user authentication experience.

## User account routes

The [Demo Store template](https://shopify.dev/custom-storefronts/hydrogen/templates) contains the following user account-specific routes:

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

## Retrieve a customer access token

You can retrieve a customer access token using the [`useSession`](https://shopify.dev/api/hydrogen/hooks/framework/usesession) hook. If the `customerAccessToken` isn't defined, then the user isn't logged in.

{% codeblock file, filename: 'component.server.jsx' %}

```js
const { customerAccessToken } = useSession()
```

{% endcodeblock %}

## Tell bots not to index a page

Pages that require authentication shouldn't be indexed by bots. For example, bots shouldn't index login and account pages. You can tell bots to not index a page by passing `noindex` to the `Seo` component:

{% codeblock file, filename: '/account/login.server.jsx' %}

```jsx
<Seo type="noindex" data={% raw %}{{title: 'Login'}}{% endraw %} />
```

{% endcodeblock %}

## Related components and hooks

- [`Seo`](https://shopify.dev/api/hydrogen/components/primitive/seo)
- [`useSession`](https://shopify.dev/api/hydrogen/hooks/framework/usesession)

## Next steps

- Learn how to [manage customer accounts](https://shopify.dev/custom-storefronts/customer-accounts) with the Storefront API.
- Get familiar with the [file-based routing system](https://shopify.dev/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn about the Hydrogen framework's built-in support for [session management](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions).
- Learn how to customize the output of [SEO-related tags](https://shopify.dev/custom-storefronts/hydrogen/framework/seo) in your Hydrogen client and server components.
