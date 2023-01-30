---
gid: ffd7e8a6-7ab5-4bed-b80d-eadf21e76794
title: Sell to multiple countries
description: Learn how to support multiple languages on a storefront using URL subpaths.
feature_flag: hydrogen2
---

You can support multiple languages on a storefront. This guide explains how to retrieve translated content using URL subpaths.

For example, to translate content to non-regional french, a storefront's URL that includes `ca.hydrogen.shop` would become `ca.hydrogen.shop/fr`. A URL to the storefronts products that includes `ca.hydrogen.shop/products/shoes` would become `ca.hydrogen.shop/fr/products/souliers`. <mark>Total guess. But I assume we want to show a translated URL, unless that part doesn't change and it would remain <code>shoes</code></mark>

<mark>It can be helpful to provide an image or a video of what's being built in this guide. It helps orient Partners towards the expected outcome</mark>

## Requirements

- Requirement 1 (for example, Your app can make [authenticated requests](/api/admin/getting-started) to the GraphQL Admin API.)
- Requirement 2 (for example, Your app has the `write_order` [access scope](/api/usage/access-scopes). For more information on requesting access scopes when your app is installed, refer to [Getting started with OAuth](/apps/auth/oauth/getting-started).)

## Step 1: Update the utilities function

<mark>Tell the user what they will do, why they will do it, and how it benefits them. If needed, provide additional information about the task, such as what might have led them to do this task if it's part of a bigger set of tasks.</mark>

<mark>Optionally Tell them where they do this if it's helpful</mark>

Update the utilities function to handle the localized URL path, using the Storefront API's supported [language](/api/storefront/latest/enums/LanguageCode) and [country](/api/storefront/latest/enums/CountryCode) codes.

The following example <mark>tell them what the code is doing, briefly. Insert comments in code where helpful to reduce the amount of text in steps</mark>

{% codeblock file, filename: 'full path to file' %}

```tsx
export function getLocaleFromRequest(request: Request): Locale {
  const url = new URL(request.url);

  switch (url.host) {
    case 'ca.hydrogen.shop':
      if (/^\/fr($|\/)/.test(url.pathname)) {
        return {
          language: 'FR',
          country: 'CA',
        };
      } else {
        return {
          language: 'EN',
          country: 'CA',
        };
      }
      break;
    case 'hydrogen.au':
      return {
        language: 'EN',
        country: 'AU',
      };
      break;
    default:
      return {
        language: 'EN',
        country: 'US',
      };
  }
}
```

{% endcodeblock %}

## Step 2: Generate `/$lang/*` files using Remix splat routes

<mark>Add optional conceptual information. Introduce the tasks and include the "what" and "why". Provide any necessary background.</mark>

All route files under `$lang` are re-exports of the main routes file. Update `remix.config.js` to auto generate these files on build.

> Tip:
> You can `.gitignore` files that are generated under the `$lang` folder and re-run dev or build whenever you add or remove a file or module export.

{% codeblock file, filename: 'full path to file' %}

```tsx
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const recursive = require('recursive-readdir');

module.exports = {
  ignoredRouteFiles: ['**/.*'],
  async routes() {
    const appDir = path.resolve(__dirname, 'app');
    const routesDir = path.resolve(appDir, 'routes');
    const langDir = path.resolve(routesDir, '$lang');

    const files = await recursive(routesDir, [
      (file) => {
        return file.replace(/\\/g, '/').match(/routes\/\$lang\//);
      },
    ]);

    // eslint-disable-next-line no-console
    console.log(`Duplicating ${files.length} route(s) for translations`);

    for (let file of files) {
      let bundle = await esbuild.build({
        entryPoints: {entry: file},
        bundle: false,
        metafile: true,
        write: false,
      });

      const moduleExports = bundle.metafile.outputs['entry.js'].exports;

      const moduleId =
        '~/' +
        path
          .relative(appDir, file)
          .replace(/\\/g, '/')
          .slice(0, -path.extname(file).length);

      const outFile = path.resolve(langDir, path.relative(routesDir, file));

      fs.mkdirSync(path.dirname(outFile), {recursive: true});
      fs.writeFileSync(
        outFile,
        `export {${moduleExports.join(', ')}} from ${JSON.stringify(
          moduleId,
        )};\n`,
      );
    }

    return {};
  },
};
```

{% endcodeblock %}

## Step 3: Add `$.tsx` files to the `/routes` folder

Adding `$.tsx` files to your routess ensures that the splat route handles all non-matching splat routes. The following is an example:

{% codeblock file, filename: 'full filepath here' %}

```tsx
export async function loader() {
  throw new Response('Not found', {status: 404});
}

export default function Component() {
  return null;
}
```

{% endcodeblock %}

## Step 4: Handle invalid URL path localizations

<mark>Explain to them why they do this. Explain the risks of not doing it.</mark>

{% codeblock file, filename: 'full filepath here' %}

```tsx
export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderArgs) {
  const {language} = getLocaleFromRequest(request);

  if (
    params.lang &&
    params.lang.toLowerCase() !== language.toLowerCase()
  ) {
    // If the lang URL param is defined, and it didn't match a valid localization,
    // then the lang param must be invalid, send to the 404 page
    throw new Response('Not found', {status: 404});
  }

  ...
}
```

{% endcodeblock %}

## Step 5: Add the path prefix to the URL

You need to create a utility function that adds the path prefix to the URL path. You'll use the utility anywhere you need to define a localized path. For example, form actions should be localized path as well. <mark>link out to form action doc</mark>

1. Create the utility function. The following is an example:

  {% codeblock file, filename: 'full filepath here' %}

  ```tsx
  export function usePrefixPathWithLocale(path: string) {
    const [root] = useMatches();
    const selectedLocale = root.data.selectedLocale;

    return selectedLocale
      ? `${selectedLocale.pathPrefix}${
          path.startsWith('/') ? path : '/' + path
        }`
      : path;
  }
  ```

  {% endcodeblock %}

1. Create a <Link/> wrapper component that will add the path prefix <mark>Start these by telling them where. E.g. "In the X file, create a ". When you mention a component, add a link to its reference page. This helps the Partner to know more about what it is that they're adding, and why. It also helps them to learn when they'd do something similar elsewhere</mark>

    Your project must use this `Link` component for all inbound navigation. <mark>Tell them why. Mention any risks involved in their not doing this </mark>

    {% codeblock file, filename: 'full filepath here' %}

    ```tsx
    import {
      Link as RemixLink,
      NavLink as RemixNavLink,
      useMatches,
    } from '@remix-run/react';
    import {usePrefixPathWithLocale} from '~/lib/utils';

    export function Link(props) {
      const {to, className, ...resOfProps} = props;
      const [root] = useMatches();
      const selectedLocale = root.data.selectedLocale;

      let toWithLocale = to;

      if (typeof to === 'string') {
        toWithLocale = selectedLocale ? `${selectedLocale.pathPrefix}${to}` : to;
      }

      if (typeof className === 'function') {
        return (
          <RemixNavLink
            to={toWithLocale}
            className={className}
            {...resOfProps}
          />
        );
      }

      return (
        <RemixLink to={toWithLocale} className={className} {...resOfProps} />
      );
    }
    ```

    {% endcodeblock %}

<mark>Tell them the outcome that they should expect at the end of this procedure. Include an asset where possible/helpful. For example, something like</mark>

You should now see URLs (or languages, or whatever) resolve to the language. <mark>No idea if this is correct but it's an example</mark>

<mark>Asset of what's been built in action</mark>

## Next steps (optional)

List or single phrase.
