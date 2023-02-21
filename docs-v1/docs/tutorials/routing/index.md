# Routing


> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen storefront.

## How routes work

All components added to the `src/routes` directory are registered as routes in `App.server.jsx`. Any filenames with brackets, like `[handle]`, are converted to a route parameter called `:handle`.

You can navigate between routes using the [`Link`](/docs/components/framework/link.md) component or the [`useNavigate`](/docs/hooks/framework/usenavigate.md) hook. You can use the [`useRouteParams`](/docs/hooks/framework/userouteparams.md) hook to retrieve the parameters of an active route.

The following example shows how each `*.server.jsx` file maps to a different route in the Hydrogen app:

```
└── src
    ├── routes
        └── collections
            └── [handle].server.jsx // localhost:3000/collections/<handle>
        └── pages
            └── [handle].server.jsx // localhost:3000/pages/<handle>
        └── products
            └── [handle].server.jsx // localhost:3000/products/<handle>
        └── index.server.jsx // localhost:3000/
```



### Example

You have following components in your `src/routes` directory:

```
/routes/index.server.jsx
/routes/custom-page.server.jsx
/routes/products/[handle].server.jsx
```



The routes are registered in `App.server.jsx` and Hydrogen converts `[handle]` to `:handle`:

```
/
/custom-page
/products/:handle
```



## Built-in routes

Hydrogen provides the following built-in routes:

- **`/__health`**: A health check route that responds with a 200 status and no body. You can use this route within your infrastructure to verify that your app is healthy and able to respond to requests.
- **`/__rsc`**: An internal route used to re-render server components. It's called by the Hydrogen frontend when the route changes, or when server props change. You should never need to manually request this route.
- **`/__event`**: An internal route used to save client observability events. You should never need to manually request this route.

## Custom routes

By default, Hydrogen uses a file-based routing system, but you can customize routes in `App.server.jsx` using the following components:

- [`Router`](/docs/components/framework/router.md): Provides the context for routing in your Hydrogen storefront
- [`FileRoutes`](/docs/components/framework/fileroutes.md): Builds a set of default Hydrogen routes based on the output provided by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html.md#glob-import) method
- [`Route`](/docs/components/framework/route.md): Used to set up a route in Hydrogen that's independent of the file system

## API routes

API routes allow you to build your API in Hydrogen. Any server component within the `src/routes` directory that exports an API function will become an API route. The following examples show some common use cases for implementing API routes.

### Example

The following example shows a "Hello world" implementation of an API route:

```jsx
export function api(request, {params}) {
  return new Response('Hello world!');
}
```

{% endcodeblock%}

Learn how to [work with API routes](/docs/tutorials/routing/manage-routes.md#api-routes).

## Props for creating custom experiences

![Shows a diagram that illustrates how server components receive props](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-pages.png)

Server components placed in the `src/routes` directory receive the following special props that you can use to create custom experiences:

| Prop       | Type               |
| ---------- | ------------------ |
| `request`  | `HydrogenRequest`  |
| `response` | `HydrogenResponse` |

Each server component receives props, which includes custom versions of `request` and `response` and any `serverProps` that you have passed from the client.

Learn how to [create custom experiences](/docs/tutorials/routing/manage-routes.md#create-custom-experiences-with-props) with props.

## TypeScript

Hydrogen supports TypeScript out of the box. When building route components, you can use the provided TypeScript types to improve your developer experience:

```tsx


import type {
  HydrogenApiRoute,
  HydrogenApiRouteOptions,
  HydrogenRequest,
  HydrogenRouteProps,
} from '@shopify/hydrogen';

export default function MyPage(props: HydrogenRouteProps) {
  //
}

export const api: HydrogenApiRoute = async (request, options) => {
  //
};

// Alternate version of `api`:
export async function api(
  request: HydrogenRequest,
  options: HydrogenApiRouteOptions
) {}
```



> Tip:
> The Hello World template is available in [TypeScript](/docs/tutorials/getting-started/templates.md#hello-world-template). You can also refer to the [example implementation of TypeScript](https://github.com/Shopify/hydrogen/tree/main/examples/typescript) in GitHub.

## Related components and hooks

- [`Link`](/docs/components/framework/link.md)
- [`Router`](/docs/components/framework/router.md)
- [`FileRoutes`](/docs/components/framework/fileroutes.md)
- [`Route`](/docs/components/framework/route.md)
- [`useNavigate`](/docs/hooks/framework/usenavigate.md)
- [`useRouteParams`](/docs/hooks/framework/userouteparams.md)
- [`useQuery`](/docs/hooks/global/usequery.md)
- [`useShopQuery`](/docs/hooks/global/useshopquery.md)
- [`fetchSync`](/docs/hooks/global/fetchsync.md)
- [`Form`](/docs/components/framework/form.md)

## Next steps

- Learn how to perform common tasks for [managing routes in Hydrogen](/docs/tutorials/routing/manage-routes.md).
- Learn about [Hydrogen's configuration properties](/docs/tutorials/configuration/index.md) and how to change the location of the configuration file.
- Learn about how Hydrogen consumes data from different [sources](/docs/tutorials/data-sources/index.md).
- Learn how to manage [cache options](/docs/tutorials/querying/cache.md) for Hydrogen storefronts.
- Improve your app's loading performance with [streaming SSR and Suspense](/docs/tutorials/streaming-ssr.md).
- Learn how to [manage your server props](/docs/tutorials/server-props.md) during your development process.
