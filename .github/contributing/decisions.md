**This document is outdated, but serves as an historical reference to early decisions made in the Hydrogen project circa April 2021.**

- Use [Vite](https://vitejs.dev/) for the framework. Fast, modern, leans into the ES module support of modern browsers rather than creating a giant bundle a la Webpack.
- Use [Tailwind](https://tailwindcss.com) for styles.
- Use [urql](https://formidable.com/open-source/urql/docs/) for making GraphQL queries.
- Avoid creating a custom `hydrogen` CLI tool for development and building. Instead, use existing `vite` CLI included with the framework for building, and provide Hydrogen middleware as a plugin.
- Hydrogen React components are exported and usable by other React frameworks, like Next.js and Gatsby.
- Hydrogen React components are specific to Shopify and not generic to web applications. E.g. `LayoutGrid` would never be a component provided by Hydrogen, but `ProductOptions` would.
- `hydrogen.config.js` is used to specify all the runtime configuration in Hydrogen, like routes, Storefront domain and accelerated checkout options.
- Use a custom `Link` component wrapped around [`ReactRouter`](https://reactrouter.com/) to fetch props from the server on page navigation.
- `ShopifyProvider` is a wrapper component providing helpful context to the rest of the application and Hydrogen components.
- Tobi will demo Hydrogen at Unite, but we will not be releasing Hydrogen yet to developers at Unite.
- While Vite is an implementation detail of Hydrogen, we should not define Hydrogen as merely a Vite plugin.
- In our Hydrogen template page components, chunks of GraphQL `QUERY` will go at the very bottom of each file. This reduces visual noise where the component is defined, and queries do not change as frequently. Additionally, we aren't using dedicated `.graphql` files in the Demo Store template like we use in larger React projects at Shopify. Keeping the queries directly in the React components keeps the learning curve small.
- We chose to build a custom Codegen plugin to add comments to GraphQL fragment exports containing the contexts of the fragments themselves. This is useful for templates and seeing what is contained within a given fragment using VSCode's type helper.
- We will adopt a Server Components strategy for Hydrogen, modeled after [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html). We'll ship early with a similar version with plans to adopt the official version when it lands in React.
- We will use [@shopify/react-testing](https://github.com/Shopify/quilt/tree/main/packages/react-testing) instead of React Testing Library because Shopifolk are more familiar with this, and we believe it has more features that we can use out of the box. Additionally, we will name tests `<name>.test.ts` instead of `spec`, in a folder `tests` instead of `__tests__`.
