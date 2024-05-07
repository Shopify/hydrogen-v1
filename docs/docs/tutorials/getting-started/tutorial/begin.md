# Begin developing a Hydrogen storefront


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



You're ready to develop a Hydrogen storefront. You want to set up your development environment so that you can begin coding.

In this tutorial, you'll create a Hydrogen app locally to begin developing a Hydrogen storefront. [Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen) is a front-end web development framework that's optimized for commerce by Shopify.

## Scenario

You want to develop a fully-functional Hydrogen storefront that includes a collection page, a product page, and a cart. Because this is your first time creating a Hydrogen storefront, you can start with basic boilerplate code that makes your programming experience easier and more efficient.

Hydrogen storefronts enable you to use Shopify as the commerce engine behind your independently-built storefront experience.

## What you’ll learn

In this tutorial, you’ll learn how to do the following tasks:

- Set up your development environment.

- Generate a code base for building your custom storefront.

- Familiarize yourself with the structure of your Hydrogen project.

- Change text and a component's style.

![A development environment that shows the Hello World template](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-begin-development.png)

## Requirements

- You’ve installed the following dependencies:

    - [`Yarn`](https://yarnpkg.com/) version 1.x or [`npm`](https://www.npmjs.com/)

    - [Node.js](https://nodejs.org/en/) version 16.14.0 or higher

- You've familiarized yourself with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/). Hydrogen is a frontend React framework that uses Vite for server-side rendering and hydration middleware. In this tutorial, you'll build with Tailwind's library.

## Step 1: Create a new Hydrogen storefront

You can create a Hydrogen storefront locally using `yarn`, `npm`, `pnpm`, or `npx`.

If you want to [integrate with an existing React framework](https://shopify.dev/docs/custom-storefronts/react-storefront-kit), like [Next.js](https://nextjs.org/) or [Gatsby](https://www.gatsbyjs.com/), then you can add the [@shopify/storefront-kit-react](https://www.npmjs.com/package/@shopify/storefront-kit-react) `npm` package to your project.

1. Change to the directory where you want to create your project:


    ```bash
    cd <directory>
    ```



1. Run the following command:

    Because you're not passing the [flag to use TypeScript](/tutorials/getting-started/templates/), the project files are created in JavaScript by default.

{% include hydrogen/cli-template-commands.md parent="hello-world" %}

1. Provide a name for your Hydrogen storefront.

1. Change to your app’s directory:


    ```bash
    cd <app-directory>
    ```



## Step 2: Start the development server

Start the development server:

```bash?title: 'npm'

npm run dev
```

```bash?title: 'Yarn'
yarn dev
```



You can reach the development server at <http://localhost:3000/>.

![The homepage of the Hello World template](https://shopify.dev/assets/custom-storefronts/hydrogen/visit-dev-env.png)

## Step 3: Explore your project structure

So far, you've created a Hydrogen storefront that's based off the **Hello World** template. [Hydrogen templates](/tutorials/getting-started/templates/) are working implementations of Hydrogen storefronts.

The **Hello World** template is a minimal implementation of a Hydrogen storefront. It has few dependencies, little boilerplate, and provides a base for building a Hydrogen storefront.

### Open your project

Open your code editor and navigate to your Hydrogen project directory. The Hello World template provides the following structure:

```
├── public
    └── .gitkeep // Allows Git to recognize an empty directory
├── src
    └── assets
    │   └── favicon.svg   // Hydrogen favicon
    ├── routes
    │   ├── index.server.jsx  // The React Server Component used to render your app's homepage
    ├── App.server.jsx  // Your app's top-level React component
    ├── index.css   // Styles
├── hydrogen.config.js  // Hydrogen configuration file
├── index.html   // Your app's root HTML template
├── jsconfig.json // JavaScript or TypeScript configuration file
├── package.json   // Used to install dependencies and run scripts
├── README.md   // A README file that introduces the Hello World template
├── vite.config.js  // Vite configuration file
```



## Step 4: Make a text change

Now that you've explored your Hydrogen project directory, you're ready to make your first change.

1. In `/src/routes/index.server.jsx`, update the `Home` component to return **Hello world!** and an introductory statement about Hydrogen:

    ```jsx
    // /src/routes/index.server.jsx

    export default function Home() {
      return (
        <div>
          <h1>Hello world!</h1>
          <p>Welcome to Hydrogen.</p>
          <p>
            Hydrogen is a front-end web development framework used for building
            Shopify custom storefronts.
          </p>
        </div>
      );
    }
    ```



1. Save the file to see your changes updated in real-time:

    ![A simple heading that says "Hello world! Welcome to Hydrogen."](https://shopify.dev/assets/custom-storefronts/hydrogen/make-text-change.png)

## Step 5: Add styling

In this step, you'll install Tailwind and style some elements.

Tailwind is a CSS framework that is composed of classes. It offers developers a set of guardrails by providing a limited set of spacing, color, and responsive layout utilities.

1. Press `Ctrl-c` to stop the development server.

1. Install `tailwindcss` and its peer dependencies, and generate the `tailwind.config.js` and `postcss.config.js` files.


    ```bash?title: 'npm'
    npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer
    npx tailwindcss init -p
    ```

    ```bash?title: 'Yarn'
    yarn add tailwindcss @tailwindcss/typography postcss autoprefixer
    yarn tailwindcss init -p
    ```



1. Add the paths to the template files in your `tailwind.config.js` file:

    ```js
    // tailwind.config.js

    module.exports = {
      content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
      theme: {
        extend: {},
      },
      plugins: [require('@tailwindcss/typography')],
    }
    ```



1. Add Tailwind directives to `/src/index.css`:

    ```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```



1. Restart your development server.

1. In `/src/routes/index.server.jsx`, style the **Hello world!** heading and **Welcome to Hydrogen** paragraph by adding some classes:

    ```jsx
    // src/routes/index.server.jsx

    export default function Home() {
      return (
        <section className="p-6 md:p-8 lg:p-12">
          <h1 className="font-extrabold mb-4 text-5xl md:text-7xl">Hello world!</h1>
          <p className="font-bold mb-3">Welcome to Hydrogen.</p>
          <p>
            Hydrogen is a front-end web development framework used for building
            Shopify custom storefronts.
          </p>
        </section>
      );
    }
    ```



1. Save the file to see your changes updated in real-time:

    ![The hello world heading styled with Tailwind classes](https://shopify.dev/assets/custom-storefronts/hydrogen/component-style-change.png)

## Next steps

- Learn how to [fetch data from your storefront](/tutorials/getting-started/tutorial/fetch-data/).
