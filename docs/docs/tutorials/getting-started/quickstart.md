# Hydrogen quickstart


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



In this quickstart, you'll create a Hydrogen app locally. [Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen) is a front-end web development framework used for building Shopify custom storefronts.

## Requirements

You’ve installed the following dependencies:

  - [`Yarn`](https://classic.yarnpkg.com/) version 1.x or [`npm`](https://www.npmjs.com/)

  - [Node.js](https://nodejs.org/en/) version 16.14.0 or higher

## Step 1: Create a Hydrogen app

You can create a Hydrogen app locally using `npm`, `npx`, `pnpm`, or `yarn`.

1. Navigate to the directory where you want to create your project:


    ```bash
    cd <directory>
    ```



1. Run the following command:


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



## Step 2: Choose a template

Choose a [template](/tutorials/getting-started/templates/) to get started building your Hydrogen storefront:

```bash

? Choose a template
> Demo Store
  Hello World
```



## Step 3: Choose a language

Choose a language to develop your Hydrogen storefront:

```bash

? Choose a language
> JavaScript
  TypeScript
```



## Step 4: Name your Hydrogen storefront

Enter a name for your Hydrogen storefront:

```bash

Name your new Hydrogen storefront
> hydrogen-app
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```



## Step 5: Start the development server

1. Navigate to your app's directory:


    ```bash
    cd <app-directory>
    ```



1. Start the development server:


    ```bash?title: 'npm'
    npm run dev
    ```

    ```bash?title: 'Yarn'
    yarn dev
    ```



    You can reach the development server at <http://localhost:3000/>.
## Next steps

- Follow the [Hydrogen tutorial series](/tutorials/getting-started/tutorial/begin/) to go from "Hello World" to a fully built out Shopify custom storefront.
