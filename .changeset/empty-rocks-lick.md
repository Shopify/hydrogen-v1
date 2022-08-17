---
'@shopify/hydrogen': patch
'create-hydrogen-app': patch
---

We've exposed the private server-to-server storefront API token in the hydrogen config. The private token is necessary when deploying to production, otherwise the requests to the storefront API will be rate limited. This should make it easier to properly configure hydrogen when deploying to non-Oxygen environments. We'll also warn when in production mode and the token is not defined.

We've also added the `storefrontId` property to the config. It's necessary to add this as well, otherwise your analytics dashboard on the admin will be broken.

Lastly we also updagted all Oxygen environment variable references to a more consistent naming convention. The previous variables are still available, but are deprecated, and will be removed down the road. If you still reference them, a warning will be given:

| **Current Oxygen Variable**              | **New Oxygen Variable**              |
| ---------------------------------------- | ------------------------------------ |
| SHOPIFY_STORE_DOMAIN                     | PUBLIC_SHOPIFY_STORE_DOMAIN          |
| SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN      | PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN  |
| OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE | PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN |
| SHOPIFY_STOREFRONT_ID                    | PUBLIC_SHOPIFY_STOREFRONT_ID         |
