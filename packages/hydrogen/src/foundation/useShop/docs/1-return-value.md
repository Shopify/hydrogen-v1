## Return value

The `useShop` hook returns an object with the following keys:

| Key                    | Description                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `locale`               | The application locale. Defaults to `defaultLocale` in `shopify.config.js` then `EN-US`. |
| `languageCode`         | The first two characters of the `locale` key. For example, `EN`.                         |
| `storeDomain`          | The store domain set in `shopify.config.js`.                                             |
| `storefrontToken`      | The Storefront API token set in `shopify.config.js`.                                     |
| `storefrontApiVersion` | The Storefront API version set in `shopify.config.js`.                                   |
