# Work with third-party data


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen can also support data from third-party sources. If you want to use Hydrogen components with a third-party data source, then data from the third-party source must first be transformed into the types expected by the Hydrogen components, hooks, and utilities, and then passed on to the components, hooks, and utilities.
This guide explains how to perform some common tasks.

### Use Hydrogen components with a third-party data source

To support third-party data, the third party needs to build an adapter that transforms the data into the types expected by Hydrogen. If you choose to use a third-party data source, then you can query it in your custom storefront code.

For example, a third-party data source might return product data with a different structure:

```json
{
  "productId": <number>,
  "productHandle": "<string>",
  "productTitle": "<string>",
  "description": { plain: "<string>", html: "<string>" },
  ...
}
```

For the `ProductOptionsProvider` component to use the product data coming from the third-party data source, the data needs to be translated into the format that the `ProductOptionsProvider` component expects.

For example, the following function converts a third-party data source into the type returned by the Storefront API:

```jsx
function converter(third_party_data) {
  return {
    id: third_party_data.productId.toString(),
    handle: third_party_data.productHandle,
    title: third_party_data.productTitle,
    description: third_party_data.description.plain,
    descriptionHtml: third_party_data.description.html,
    ...
  }
}
```

### Fetch supplementary data

If you want to fetch data that goes alongside your Shopify product data and shopping experience, like CMS content from another provider, then you can render your own component by implementing the [`fetchSync`](/hooks/global/fetchsync/) or [`useQuery`](/hooks/global/usequery/) hooks.

For example, inside the `useQuery` hook, you can use the [`fetch()` method](https://developer.mozilla.org/en-US/docs/Web/API/fetch) on server components, or an HTTP client like [Axios](https://axios-http.com/), which can be used on both the client and the server.

> Note:
> If you want to build your API in Hydrogen, then refer to [API routes](/tutorials/routing/index.md#api-routes).
