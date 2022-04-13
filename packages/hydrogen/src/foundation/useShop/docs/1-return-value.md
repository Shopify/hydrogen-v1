## Return value

The `useShop` hook returns an object with the following keys:

| Key                    | Description                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `locale`               | The application locale. Defaults to `defaultLocale` in `hydrogenConfig.shopify` then `EN-US`. |
| `languageCode`         | The first two characters of the `locale` key. For example, `EN`.                              |
| `storeDomain`          | The store domain set in `hydrogenConfig.shopify`.                                             |
| `storefrontToken`      | The Storefront API token set in `hydrogenConfig.shopify`.                                     |
| `storefrontApiVersion` | The Storefront API version set in `hydrogenConfig.shopify`.                                   |
