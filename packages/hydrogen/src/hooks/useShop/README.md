The `useShop` hook provides access to values within `shopify.config.js`.

> Note:
> It must be a descendent of a `ShopifyProvider` component.

## Example code

{% codeblock file %}

```jsx
import {useShop} from '@shopify/hydrogen';

export default function MyPage() {
  const {locale} = useShop();

  return <h1>The locale is {locale}</h1>;
}
```

{% endcodeblock %}

## Return value

The `useShop` hook returns an object with the following keys:

| Key  | Description |
| ---- | ----------- |
| `locale` | The locale set in `shopify.config.js`. |
| `storeDomain` | The store domain set in `shopify.config.js`. |
| `storefrontToken` | The Storefront API token set in `shopify.config.js`. |
| `graphqlApiVersion` | The GraphQL API version set in `shopify.config.js`. |

## Related components

- [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)
