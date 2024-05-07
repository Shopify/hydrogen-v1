# Routing


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen storefront.

## How routes work

All components added to the `src/routes` directory are registered as routes in `App.server.jsx`. Any filenames with brackets, like `[handle]`, are converted to a route parameter called `:handle`.

You can navigate between routes using the [`Link`](/components/framework/link/) component or the [`useNavigate`](/hooks/framework/usenavigate/) hook. You can use the [`useRouteParams`](/hooks/framework/userouteparams/) hook to retrieve the parameters of an active route.

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

- [`Router`](/components/framework/router/): Provides the context for routing in your Hydrogen storefront
- [`FileRoutes`](/components/framework/fileroutes/): Builds a set of default Hydrogen routes based on the output provided by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html.md#glob-import) method
- [`Route`](/components/framework/route/): Used to set up a route in Hydrogen that's independent of the file system

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

Learn how to [work with API routes](/tutorials/routing/manage-routes.md#api-routes).

## Props for creating custom experiences

![Shows a diagram that illustrates how server components receive props](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-pages.png)

Server components placed in the `src/routes` directory receive the following special props that you can use to create custom experiences:

| Prop       | Type               |
| ---------- | ------------------ |
| `request`  | `HydrogenRequest`  |
| `response` | `HydrogenResponse` |

Each server component receives props, which includes custom versions of `request` and `response` and any `serverProps` that you have passed from the client.

Learn how to [create custom experiences](/tutorials/routing/manage-routes.md#create-custom-experiences-with-props) with props.

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
> The Hello World template is available in [TypeScript](/tutorials/getting-started/templates.md#hello-world-template). You can also refer to the [example implementation of TypeScript](https://github.com/Shopify/hydrogen/tree/main/examples/typescript) in GitHub.

## Related components and hooks

- [`Link`](/components/framework/link/)
- [`Router`](/components/framework/router/)
- [`FileRoutes`](/components/framework/fileroutes/)
- [`Route`](/components/framework/route/)
- [`useNavigate`](/hooks/framework/usenavigate/)
- [`useRouteParams`](/hooks/framework/userouteparams/)
- [`useQuery`](/hooks/global/usequery/)
- [`useShopQuery`](/hooks/global/useshopquery/)
- [`fetchSync`](/hooks/global/fetchsync/)
- [`Form`](/components/framework/form/)

## Next steps

- Learn how to perform common tasks for [managing routes in Hydrogen](/tutorials/routing/manage-routes/).
- Learn about [Hydrogen's configuration properties](/tutorials/configuration/) and how to change the location of the configuration file.
- Learn about how Hydrogen consumes data from different [sources](/tutorials/data-sources/).
- Learn how to manage [cache options](/tutorials/querying/cache/) for Hydrogen storefronts.
- Improve your app's loading performance with [streaming SSR and Suspense](/tutorials/streaming-ssr/).
- Learn how to [manage your server props](/tutorials/server-props/) during your development process.
