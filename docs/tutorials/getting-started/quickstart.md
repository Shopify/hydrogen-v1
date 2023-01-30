---
gid: ebf858a1-e179-449e-87c4-7c498db4731f
title: Hydrogen quickstart
description: Learn how to scaffold a new Hydrogen app and start a developer server.
---

In this quickstart, you'll create a Hydrogen app locally. [Hydrogen](/custom-storefronts/hydrogen) is a front-end web development framework used for building Shopify custom storefronts.

## Requirements

You’ve installed the following dependencies:

  - [`Yarn`](https://classic.yarnpkg.com/) version 1.x or [`npm`](https://www.npmjs.com/)

  - [Node.js](https://nodejs.org/en/) version 16.14.0 or higher

## Step 1: Create a Hydrogen app

You can create a Hydrogen app locally using `npm`, `npx`, `pnpm`, or `yarn`.

1. Navigate to the directory where you want to create your project:

    {% codeblock terminal %}

    ```bash
    cd <directory>
    ```

    {% endcodeblock %}

1. Run the following command:

    {% codeblock terminal %}

    ```bash?title: 'npm'
    npm init @shopify/hydrogen
    ```

    ```bash?title: 'npx'
    npx @shopify/create-hydrogen
    ```

    ```bash?title: 'pnpm'
    pnpm create @shopify/create-hydrogen
    ```

    ```bash?title: 'Yarn'
    yarn create @shopify/hydrogen
    ```

    {% endcodeblock %}

## Step 2: Choose a template

Choose a [template](/custom-storefronts/hydrogen/getting-started/templates) to get started building your Hydrogen storefront:

{% codeblock terminal %}

```bash
? Choose a template
> Demo Store
  Hello World
```

{% endcodeblock %}

## Step 3: Choose a language

Choose a language to develop your Hydrogen storefront:

{% codeblock terminal %}

```bash
? Choose a language
> JavaScript
  TypeScript
```

{% endcodeblock %}

## Step 4: Name your Hydrogen storefront

Enter a name for your Hydrogen storefront:

{% codeblock terminal %}

```bash
Name your new Hydrogen storefront
> hydrogen-app
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

{% endcodeblock %}

## Step 5: Start the development server

1. Navigate to your app's directory:

    {% codeblock terminal %}

    ```bash
    cd <app-directory>
    ```

    {% endcodeblock %}

1. Start the development server:

    {% codeblock terminal %}

    ```bash?title: 'npm'
    npm run dev
    ```

    ```bash?title: 'Yarn'
    yarn dev
    ```

    {% endcodeblock %}

    You can reach the development server at <http://localhost:3000/>.
## Next steps

- Follow the [Hydrogen tutorial series](/custom-storefronts/hydrogen/getting-started/tutorial/begin) to go from "Hello World" to a fully built out Shopify custom storefront.
