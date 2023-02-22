# Hydrogen templates


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate to Hydrogen 2.0](https://shopify.dev/docs/custom-storefronts/hydrogen/migrate-hydrogen-remix) as soon as possible.
:::


Hydrogen offers different templates that provide paths to building Shopify custom storefronts. This guide describes the templates that Hydrogen offers and how you can begin exploring them.

## How it works

Hydrogen provides the following templates to help you get started:

- **[Hello World](/templates/hello-world/)**: A minimal template for developers who want to build their Hydrogen storefront from the very beginning. Pick this template to start building from scratch.
- **[Demo Store](/templates/demo-store/)**: The default template installed when creating a new Hydrogen storefront. It’s a complete Hydrogen storefront that uses live production data provided by Shopify. Pick this template to inspect a working Hydrogen codebase, or to use as a starting point for your own build.

### Components

The Demo Store template provides a series of components that you can use to accelerate your development process. The components integrate directly with the [Storefront API](https://shopify.dev/api/storefront) for efficient data-fetching, allowing you to save time on crafting GraphQL queries to interact with Shopify APIs or other third-party data sources.

The Demo Store template includes different categories of components.

#### Account

The following components render account information:


- [AccountActivateForm](/templates/demo-store/src/components/account/AccountActivateForm.client.tsx)
- [AccountAddressBook](/templates/demo-store/src/components/account/AccountAddressBook.client.tsx)
- [AccountAddressEdit](/templates/demo-store/src/components/account/AccountAddressEdit.client.tsx)
- [AccountCreateForm](/templates/demo-store/src/components/account/AccountCreateForm.client.tsx)
- [AccountDeleteAddress](/templates/demo-store/src/components/account/AccountDeleteAddress.client.tsx)
- [AccountDetails](/templates/demo-store/src/components/account/AccountDetails.client.tsx)
- [AccountDetailsEdit](/templates/demo-store/src/components/account/AccountDetailsEdit.client.tsx)
- [AccountLoginForm](/templates/demo-store/src/components/account/AccountLoginForm.client.tsx)
- [AccountOrderHistory](/templates/demo-store/src/components/account/AccountOrderHistory.client.tsx)
- [AccountPasswordResetForm](/templates/demo-store/src/components/account/AccountPasswordResetForm.client.tsx)
- [AccountRecoverForm](/templates/demo-store/src/components/account/AccountRecoverForm.client.tsx)

#### Cards

The following components render card elements:

- [ArticleCard](/templates/demo-store/src/components/cards/ArticleCard.tsx)
- [CollectionCard](/templates/demo-store/src/components/cards/CollectionCard.server.tsx)
- [OrderCard](/templates/demo-store/src/components/cards/OrderCard.client.tsx)
- [ProductCard](/templates/demo-store/src/components/cards/ProductCard.client.tsx)

#### Cart

The following components render cart elements:


- [CartDetails](/templates/demo-store/src/components/cart/CartDetails.client.tsx)
- [CartEmpty](/templates/demo-store/src/components/cart/CartEmpty.client.tsx)
- [CartLineItem](/templates/demo-store/src/components/cart/CartLineItem.client.tsx)


#### Elements

The following components render small chunks of reusable content:


- [Button](/templates/demo-store/src/components/elements/Button.tsx)
- [Grid](/templates/demo-store/src/components/elements/Grid.tsx)
- [Heading](/templates/demo-store/src/components/elements/Heading.tsx)
- [Icon](/templates/demo-store/src/components/elements/Icon.tsx)
- [Input](/templates/demo-store/src/components/elements/Input.tsx)
- [LogoutButton](/templates/demo-store/src/components/elements/LogoutButton.client.tsx)
- [Section](/templates/demo-store/src/components/elements/Section.tsx)
- [Skeleton](/templates/demo-store/src/components/elements/Skeleton.tsx)
- [Text](/templates/demo-store/src/components/elements/Text.tsx)


#### Global

The following components render global elements:


- [CartDrawer](/templates/demo-store/src/components/global/CartDrawer.client.tsx)
- [Drawer](/templates/demo-store/src/components/global/Drawer.client.tsx)
- [Footer](/templates/demo-store/src/components/global/Footer.server.tsx)
- [FooterMenu](/templates/demo-store/src/components/global/FooterMenu.client.tsx)
- [Header](/templates/demo-store/src/components/global/Header.client.tsx)
- [Layout](/templates/demo-store/src/components/global/Layout.server.tsx)
- [MenuDrawer](/templates/demo-store/src/components/global/MenuDrawer.client.tsx)
- [Modal](/templates/demo-store/src/components/global/Modal.client.tsx)
- [NotFound](/templates/demo-store/src/components/global/NotFound.server.tsx)
- [PageHeader](/templates/demo-store/src/components/global/PageHeader.tsx)


#### Product

The following components render product information:


- [ProductDetail](/templates/demo-store/src/components/product/ProductDetail.client.tsx)
- [ProductForm](/templates/demo-store/src/components/product/ProductForm.client.tsx)
- [ProductGallery](/templates/demo-store/src/components/product/ProductGallery.client.tsx)
- [ProductGrid](/templates/demo-store/src/components/product/ProductGrid.client.tsx)
- [ProductOptions](/templates/demo-store/src/components/product/ProductOptions.client.tsx)


#### Search

The following components render search functionality:


- [NoResultRecommendations](/templates/demo-store/src/components/search/NoResultRecommendations.server.tsx)
- [SearchPage](/templates/demo-store/src/components/search/SearchPage.server.tsx)


#### Sections

The following components render specific pieces of content on a page:


- [FeaturedCollections](/templates/demo-store/src/components/sections/FeaturedCollections.tsx)
- [Hero](/templates/demo-store/src/components/sections/Hero.tsx)
- [ProductCards](/templates/demo-store/src/components/sections/ProductCards.tsx)
- [ProductSwimlane](/templates/demo-store/src/components/sections/ProductSwimlane.server.tsx)


#### Additional components


- [CountrySelector](/templates/demo-store/src/components/CountrySelector.client.tsx)
- [CustomFont](/templates/demo-store/src/components/CustomFont.client.tsx)
- [HeaderFallback](/templates/demo-store/src/components/HeaderFallback.tsx)


### Routes

Hydrogen uses [file-based routing](/tutorials/routing/). Any pages added to the `src/routes` directory will be automatically registered as routes by the app. The following routes are included in the Demo Store template:


- [Account](/templates/demo-store/src/routes/account)
- [API](/templates/demo-store/src/routes/api)
- [Collections](/templates/demo-store/src/routes/collections)
- [Journal](/templates/demo-store/src/routes/journal)
- [Pages](/templates/demo-store/src/routes/pages)
- [Policies](/templates/demo-store/src/routes/policies)
- [Products](/templates/demo-store/src/routes/products)
- [Admin](/templates/demo-store/src/routes/admin.server.tsx)
- [Cart](/templates/demo-store/src/routes/cart.server.tsx)
- [Index](/templates/demo-store/src/routes/index.server.tsx)
- [Robots](/templates/demo-store/src/routes/robots.txt.server.ts)
- [Search](/templates/demo-store/src/routes/search.server.tsx)
- [Sitemap](/templates/demo-store/src/routes/sitemap.xml.server.ts)

