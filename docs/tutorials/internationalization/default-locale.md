---
gid: 1d2f2600-c180-490c-9d07-d828bc5772d7
title: Set the default locale
description: Learn how to set your Hydrogen storefront's default language and country
feature_flag: hydrogen2
---

[Internationalization](/custom-storefronts/hydrogen/internationalization) helps merchants expand their business to a global audience by creating shopping experiences in local languages and currencies.

By default, the app's `language` and `country` are <mark>defaults here</mark>, set in `server.ts`. This guide shows you how to change the default values.

## Requirements

- You've completed the Hydrogen Getting Started for a `Hello World` example project. <mark>Link to the getting started topic here</mark>
- You can make queries to the Storefront API <mark>Just guessing at this. If it's valid, link to where they'd have done this. If this is part of the getting started, you can merge this sentence with the one above.</mark>
<mark>Fill in any other requirements, and provide links where usesful.</mark>
- Requirement 1 (for example, Your app can make [authenticated requests](/api/admin/getting-started) to the GraphQL Admin API.)
- Requirement 2 (for example, Your app has the `write_order` [access scope](/api/usage/access-scopes). For more information on requesting access scopes when your app is installed, refer to [Getting started with OAuth](/apps/auth/oauth/getting-started).)

## Step 1: Set the default language and country

<mark>If there's value in it, tell the user what they will do, why they will do it, and how it benefits them. If needed, provide additional information about the task, such as what might have led them to do this task if it's part of a bigger set of tasks.</mark>

In `server.ts`, set the values for `i18n`'s `language` and `country`, using the Storefront API's supported [language](/api/storefront/latest/enums/LanguageCode) and [country](/api/storefront/latest/enums/CountryCode) codes.

The following example sets the language to non-regional English and the country to Canada:

{% codeblock file, filename: 'full path to file' %}

```tsx
return await requestHandler(
  request,
  {
    env,
    context,
    storefront: {
      ...
      storefrontApiVersion: '<api_version>',
      i18n: {
        language: 'EN',
        country: 'CA',
      },
    },
  },
  {
    session,
  },
);
```

{% endcodeblock %}

## Step 2: Update `root.tsx`

<mark>full file paths wherever relevant. Doesn't have to be in every case, but do it where you think it'll be helpful. In codeblocks, you do it in every case.</mark>

<mark>Considering including the include the "what" and the "why", if it's relevant or helpful to devs. Provide any necessary background.</mark>

Update `root.tsx` to match the values in `server.ts`:

{% codeblock file, filename: 'full path to file' %}

```tsx
export default function App() {
  return (
    <html lang="EN">
      ...
    </html>
  );
}

export function CatchBoundary() {
  return (
    <html lang="EN">
      ...
    </html>
  );
}

export ErrorBoundary({error}: {error: Error}) {
  return (
    <html lang="EN">
      ...
    </html>
  );
}
```tsx

{% endcodeblock %}

## Next steps (optional)

- Learn how to support [multiple languages](/custom-storefronts/hydrogen/internationalization/multiple-languages) on your storefront.
