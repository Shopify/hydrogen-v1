---
'@shopify/hydrogen': patch
---

We've exposed the private server-to-server Storefront API token in the Hydrogen config file. This private token is required when deploying to production, otherwise the requests to the storefront API will be rate-limited. This change will make it easier to configure Hydrogen when deploying to non-Oxygen environments. We'll also display a warning in production mode if this token is not defined.

We've also added the `storefrontId` property to the config. This enables Hydrogen data to display properly in the Shopify admin analytics dashboard.

Lastly, we've updated all Oxygen environment variables to a more consistent naming convention. The previous variables are still available, but are deprecated, and will be removed in the future. You’ll see a warning in your console if you use the old environment variables. You can update your variable references using this table:

| **Old Oxygen variable**             | **New Oxygen variable**      |
| ----------------------------------- | ---------------------------- |
| SHOPIFY_STORE_DOMAIN                | PUBLIC_STORE_DOMAIN          |
| SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN | PUBLIC_STOREFRONT_API_TOKEN  |
| SHOPIFY_STOREFRONT_API_SECRET_TOKEN | PRIVATE_STOREFRONT_API_TOKEN |
| SHOPIFY_STOREFRONT_ID               | PUBLIC_STOREFRONT_ID         |
