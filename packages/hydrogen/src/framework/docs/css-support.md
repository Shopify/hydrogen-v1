Hydrogen's quick start environment is styled using the Tailwind CSS utility library [Tailwind CSS](https://tailwindcss.com/). This guide describes the CSS support that's built into Hydrogen apps and how you can customize your app's styles.

## How it works

You can build with Tailwind's library or use other methods of styling like vanilla CSS files or a third-party CSS-in-JS framework. Hydrogen is powered by Vite, which natively supports several different [methods of CSS injection](https://vitejs.dev/guide/features.html#css).

> Note:
> Make sure to import your stylesheets from a `*.client.jsx` component, or from your client entrypoint at `src/entry-client.jsx`.

## Remove Tailwind

If you don't want to build with Tailwind's library and instead want to write your own CSS, then you can remove Tailwind:

1. Delete all the code in `src/index.css`.
2. Remove Tailwind from `package.json`.
3. Remove Tailwind from `postcss.config.js`.
4. Run the following commands:

    {% codeblock file, filename: 'Terminal' %}

    ```bash?filename: 'Terminal', title: 'yarn'
    # Switch to your app's directory
    cd <directory>
    # Install dependencies for your project
    yarn install
    # Start the development server
    yarn dev
    ```

    ```bash?filename: 'Terminal', title: 'npm'
    # Switch to your app's directory
    cd <directory>
    # Install dependencies for your project
    npm i --legacy-peer-deps
    # Start the development server
    npm run dev
    ```

    {% endcodeblock %}

## Known issues with server-side rendering (SSR)

Some CSS-in-JS frameworks (for example, CSS Modules) might not work properly with SSR. Shopify is investigating how to support these frameworks in connection with React server components and streaming SSR.

Check back to read the official guidance as Shopify approaches a stable release of Hydrogen.

## Next steps

- Learn about [React Server Components](/api/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
