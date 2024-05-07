# Hydrogen templates


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::


Hydrogen offers different templates that provide paths to building Shopify custom storefronts. This guide describes the templates that Hydrogen offers and how you can begin exploring them.

## How it works

Hydrogen provides the following templates to help you get started:

- **[Hello World](https://github.com/Shopify/hydrogen-v1/tree/main/templates/hello-world/)**: A minimal template for developers who want to build their Hydrogen storefront from the very beginning. Pick this template to start building from scratch.
- **[Demo Store](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/)**: The default template installed when creating a new Hydrogen storefront. It’s a complete Hydrogen storefront that uses live production data provided by Shopify. Pick this template to inspect a working Hydrogen codebase, or to use as a starting point for your own build.

### Components

The Demo Store template provides a series of components that you can use to accelerate your development process. The components integrate directly with the [Storefront API](https://shopify.dev/api/storefront) for efficient data-fetching, allowing you to save time on crafting GraphQL queries to interact with Shopify APIs or other third-party data sources.

The Demo Store template includes different categories of components.

#### Account

The following components render account information:


- [AccountActivateForm](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountActivateForm.client.tsx)
- [AccountAddressBook](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountAddressBook.client.tsx)
- [AccountAddressEdit](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountAddressEdit.client.tsx)
- [AccountCreateForm](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountCreateForm.client.tsx)
- [AccountDeleteAddress](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountDeleteAddress.client.tsx)
- [AccountDetails](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountDetails.client.tsx)
- [AccountDetailsEdit](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountDetailsEdit.client.tsx)
- [AccountLoginForm](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountLoginForm.client.tsx)
- [AccountOrderHistory](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountOrderHistory.client.tsx)
- [AccountPasswordResetForm](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountPasswordResetForm.client.tsx)
- [AccountRecoverForm](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/account/AccountRecoverForm.client.tsx)

#### Cards

The following components render card elements:

- [ArticleCard](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/cards/ArticleCard.tsx)
- [CollectionCard](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/cards/CollectionCard.server.tsx)
- [OrderCard](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/cards/OrderCard.client.tsx)
- [ProductCard](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/cards/ProductCard.client.tsx)

#### Cart

The following components render cart elements:


- [CartDetails](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/cart/CartDetails.client.tsx)
- [CartEmpty](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/cart/CartEmpty.client.tsx)
- [CartLineItem](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/cart/CartLineItem.client.tsx)


#### Elements

The following components render small chunks of reusable content:


- [Button](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Button.tsx)
- [Grid](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Grid.tsx)
- [Heading](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Heading.tsx)
- [Icon](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Icon.tsx)
- [Input](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Input.tsx)
- [LogoutButton](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/LogoutButton.client.tsx)
- [Section](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Section.tsx)
- [Skeleton](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Skeleton.tsx)
- [Text](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/elements/Text.tsx)


#### Global

The following components render global elements:


- [CartDrawer](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/CartDrawer.client.tsx)
- [Drawer](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/Drawer.client.tsx)
- [Footer](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/Footer.server.tsx)
- [FooterMenu](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/FooterMenu.client.tsx)
- [Header](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/Header.client.tsx)
- [Layout](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/Layout.server.tsx)
- [MenuDrawer](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/MenuDrawer.client.tsx)
- [Modal](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/Modal.client.tsx)
- [NotFound](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/NotFound.server.tsx)
- [PageHeader](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/global/PageHeader.tsx)


#### Product

The following components render product information:


- [ProductDetail](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/product/ProductDetail.client.tsx)
- [ProductForm](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/product/ProductForm.client.tsx)
- [ProductGallery](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/product/ProductGallery.client.tsx)
- [ProductGrid](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/product/ProductGrid.client.tsx)
- [ProductOptions](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/product/ProductOptions.client.tsx)


#### Search

The following components render search functionality:


- [NoResultRecommendations](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/search/NoResultRecommendations.server.tsx)
- [SearchPage](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/search/SearchPage.server.tsx)


#### Sections

The following components render specific pieces of content on a page:


- [FeaturedCollections](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/sections/FeaturedCollections.tsx)
- [Hero](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/sections/Hero.tsx)
- [ProductCards](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/sections/ProductCards.tsx)
- [ProductSwimlane](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/sections/ProductSwimlane.server.tsx)


#### Additional components


- [CountrySelector](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/CountrySelector.client.tsx)
- [CustomFont](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/CustomFont.client.tsx)
- [HeaderFallback](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/components/HeaderFallback.tsx)


### Routes

Hydrogen uses [file-based routing](/tutorials/routing/). Any pages added to the `src/routes` directory will be automatically registered as routes by the app. The following routes are included in the Demo Store template:


- [Account](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/account)
- [API](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/api)
- [Collections](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/collections)
- [Journal](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/journal)
- [Pages](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/pages)
- [Policies](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/policies)
- [Products](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/products)
- [Admin](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/admin.server.tsx)
- [Cart](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/cart.server.tsx)
- [Index](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/index.server.tsx)
- [Robots](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/robots.txt.server.ts)
- [Search](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/search.server.tsx)
- [Sitemap](https://github.com/Shopify/hydrogen-v1/tree/main/templates/demo-store/src/routes/sitemap.xml.server.ts)

