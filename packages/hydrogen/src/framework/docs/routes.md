The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen app.

## How routes work

All components added to `src/pages` directory are registered as routes in `App.server.jsx`. Any filenames with brackets like `[handle]` are converted to a React Router parameter called  `:handle`.

### Example

You have following components in your `src/pages` directory:

{% codeblock file, filename: 'src/pages' %}

```
/pages/index.server.jsx
/pages/custom-page.server.jsx
/pages/products/[handle].server.jsx
```

{% endcodeblock %}

The routes are registered in `App.server.jsx` and React Router converts `[handle]` to `:handle`:

{% codeblock file, filename: 'App.server.jsx' %}
```
/
/custom-page
/products/:handle
```

{% endcodeblock %}

To obtain the `handle` from React Router, add the following code to `App.server.jsx`:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {useParams} from 'react-router-dom';

const {handle} = useParams();
```

{% endcodeblock %}

### Custom static implementation

You can also provide a custom static implementation of a dynamic page to override the default. Any requests to `/products/hoodie` are rendered using `hoodie.server.jsx` instead of `[handle].server.jsx`:

{% codeblock file, filename: 'src/pages' %}

```
/pages/products/hoodie.server.jsx
/pages/products/[handle].server.jsx
```

{% endcodeblock %}

## Catch all routes

You can extend dynamic routes to catch all paths by adding an ellipsis (...) inside the brackets. For example, `/pages/example/[...handle].server.jsx` will match `/example/a` and `/example/a/b`.

### Example

The following example shows how to obtain catch all routes data using `location.pathname`:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {useLocation} from 'react-router-dom';

const {pathname} = useLocation();
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/api/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
