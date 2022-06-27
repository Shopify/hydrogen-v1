# Using React Server Components (RSC)

## Status

Approved by internal consensus in mid-2021.

## tl;dr

We're using React Server Components, a new proposal by the React core team, to power Hydrogen's React framework. Server components provide the perfect separation of concerns between server and client code. They allow for third-party developers to create standalone server components which independently fetch data, and distribute them via NPM to Hydrogen applications. And they improve client-side performance by loading only JavaScript code that needs to execute in the browser.

## Context

While building an early prototype of Hydrogen in mid-2021, we were faced with a decision: do we invent yet another bespoke data fetching mechanism like Remix's `loader()` or Next.js's `getServerSideProps()`? How can we create a true "React" implementation of data fetching on the server?

We wanted to create and enforce a pattern of fetching Storefront API data on the server, due to the increased use of storefront data to store sensitive information on the Shopify platform.

Since RSC was announced in December 2020, we thought it was a good pattern for the problem we were trying to solve.

We initially implemented a reverse-engineered version of RSC using hacky HTML-to-React conversion and inlined HTML client component markers. Eventually, we created a Vite version of RSC and began contributing it upstream: https://github.com/facebook/react/pull/22952

We vendored the compiled version of this plugin inside Hydrogen to be able to use it immediately while we work with React and Vercel to align on an approach that works in both Webpack and Vite.

### Alternatives considered

Initially, we tried to create a `useShopQuery` based on [`react-query`](https://react-query.tanstack.com/reference/useQuery) which could be run during SSR, serialize its results to the client, and then never be run again in the browser. However, we quickly ran into limitations with this approach, especially when needing to navigate to new pages to refresh a given page.

We also explored using a `data()` loader function similar to Remix, but ultimately decided to stick with RSC.

## Consequences

RSC is a very new concept for most developers. This has likely made it more difficult for some people to adopt Hydrogen.

It's also a new technology that is not fully fleshed out. React has not defined official guidelines for data fetching on the server. There is also no "blessed" way to partially hydrate an initial SSR response with RSC payloads (we currently inject `meta` tags and use a `MutationObserver` to progressively hydrate the SSR root).

The original design of RSC involved creating forked "sync" versions of data fetching libraries. These versions threw Promises to integrate with Suspense caches. This made it more difficult to educate developers and provide ways to fetch bespoke data asynchronously. The `useQuery` and `fetchSync` utilities were born out of this. React has decided to drop this design decision and move toward an async/await approach in server components.

By fetching data in components, Hydrogen also faced the problem of network request waterfalls or "Suspense waterfalls," where nested server components that fetch data cannot begin fetching that data until the parent finishes fetching its data. To solve this, we've created an experimental preload cache utility which allows subsequent page visits to recall the queries run during the previous visit and start executing them at the top of the root instead of being blocked. We still have some iteration to do on this front.

There are also drawbacks related to assets. Developers are used to importing stylesheets and images into their React components. However, by design, no assets imported into server components are meant to end up in the browser. This has caused limitations to which CSS frameworks we can support. With CSS Modules, we've been able to create experimental workarounds to automatically inject `<style>` tags into server component default exports when CSS modules are imported.

After production use by merchant developers, we found that the `*.client` component suffix was confusing. This is because client components still run during server-side rendering. We gave feedback on this, and are aligning on a solution that does not involve client suffixes.

As of v1, Hydrogen continues to work with React and Vercel to refine the design of server components. We plan to introduce an updated version of server components in a future release of Hydrogen, along with a migration guide.
