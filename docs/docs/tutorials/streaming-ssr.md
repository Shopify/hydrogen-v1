# Streaming server-side rendering (SSR)


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



You can improve your app's loading performance by rendering components on the server and streaming them to the client.

This guide describes how streaming server-side rendering (SSR) works in a Hydrogen app. It also explains how to use Suspense to manage asynchronous operations in your app.

## How streaming SSR works

Streaming SSR is a feature in React that allows you to load data over a network in multiple chunks. The chunks are loaded out of order in parallel to rendering, which makes your Hydrogen storefront fast and performant.

> Note:
> Streaming SSR is critical for building performant storefronts, which typically depend on API calls to generate content on a page.

### Example

The following clip shows an example of streaming content. The yellow boxes represent the content to display. As the streaming approaches 1.5 seconds, each yellow box gets replaced by a blue box at the specified time. The blue boxes represent that the data is ready:

![Example of streaming content](https://shopify.dev/assets/custom-storefronts/hydrogen/streaming.gif)

The following example shows the source code for a streamed document. The HTML that's being streamed in chunks is displayed out of order:

![Source code for a streamed document](https://shopify.dev/assets/custom-storefronts/hydrogen/streaming-source.png)

## Benefits of streaming SSR

Streaming SSR provides the following performance benefits:

- **Fast TTFB (Time to First Byte)**: The browser streams the HTML page shell without blocking the server-side data fetch.
- **Progressive hydration**: As server-side data fetches are resolved, the data is streamed within the HTML response. The React runtime progressively hydrates the state of each component, all without extra client round trips or blocking on rendering the full component tree.

### Example

You have a product page that contains a lot of buyer personalized content:

- A localized description and price for a given product
- A dynamic list of recommended products powered by purchase and navigation history
- A custom call to action or promotion banner

The following table describes different strategies for implementing the product page, and the benefits of using a streaming SSR strategy:

<table>
  <tr>
    <th>Client-side strategy</th>
    <th>Server-side strategy</th>
    <th> ✅ Streaming SSR strategy</th>
  </tr>
  <tr>
    <td><p>A client-side strategy might result in a fast render of an empty product page skeleton, with a series of post-render, browser-initiated fetches to retrieve and render the required content.</p><br /><p>However, client-initiated roundtrips usually result in a subpar user experience.</p></td>
    <td><p>A server-side strategy might fetch the data on the server and return it in the response.</p><br /><p>However, server-side rendering offers a slow TTFB because the server is blocked on the data.</p></td>
    <td><p>With a streaming SSR strategy in Hydrogen, you can stream, progressively hydrate, and render the product page to load content fast and efficiently.</p><br /><p>Streaming SSR contrasts with standard SSR, where TTFB is blocked until all data queries are resolved. Individual components can also show custom loading states as the page is streamed and constructed by the browser.</p></td>
  </tr>
</table>

## Using Suspense

React 18 introduced [Suspense for data fetching to complement streaming SSR](https://nextjs.org/docs/advanced-features/react-18/streaming). Suspense is a feature of React that governs the appearance and behavior of placeholder content inside components while asynchronous data-fetching is in progress.

### How Suspense works

Suspense establishes where you need to await an initiated data fetch. This means that Suspense doesn't define where you initiate fetching data. Instead, it specifies where you access the results of fetching data.

Suspense is implemented as a React component that wraps other components, so that each pair of Suspense tags corresponds to a Suspense boundary.

A Suspense boundary is any portion of React component code that's enclosed by a pair of Suspense component tags. The components in a Suspense boundary share common rendering behaviors while awaiting data controlled by Suspense. Multiple Suspense boundaries can co-exist within a single component, and Suspense boundaries can also be nested.

### Example: Layout fallback

Suspense lets you render a fallback while a component is waiting for an asynchronous operation to finish. The following example shows how you can use `Suspense` to add a layout fallback to improve cumulative layout shift (CLS):

```jsx
// Product.server.jsx

export default function Product({country = {isoCode: 'US'}}) {
  const {handle} = useRouteParams();
  return (
    <Layout>
      <Suspense
        fallback={<ProductFallback handle={handle} isoCode={isoCode} />}
      >
        <Seo type="product" handle={handle} isoCode={isoCode} />
        <ProductDetails handle={handle} isoCode={isoCode} />
      </Suspense>
    </Layout>
  );
}
function ProductFallback() {
  // This should have the same dimensions as the output of <ProductDetails />
  return (
    <div class="product-wrapper">
      <div class="product-image-placeholder"></div>
      <div class="product-info-placeholder"></div>
    </div>
  );
}
```



### Example: No Suspense component defined

If you don't define a `Suspense` component, then React waits for the streaming to finish before showing the final layout. The following clip shows a streamed document source that doesn't include a `Suspense` component:

![A streamed document source that doesn't include a Suspense component](https://shopify.dev/assets/custom-storefronts/hydrogen/no-suspense.gif)

### Example: Suspense component defined

When a `Suspense` component is wrapped around a group of components that fetch data, it waits for the last component in the group to resolve before rendering. The order of the streamed content doesn't change in the streamed document source:

![A streamed document source that includes a Suspense component](https://shopify.dev/assets/custom-storefronts/hydrogen/suspense-defined.gif)

## Next steps

- Learn about [React Server Components](/tutorials/react-server-components/), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [work with React Server Components](/tutorials/react-server-components/work-with-rsc/) in your Hydrogen app.
