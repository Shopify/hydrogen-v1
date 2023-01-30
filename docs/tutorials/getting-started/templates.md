---
gid: e5eb16de-f020-4770-9625-a84c5c95a24e
title: Hydrogen templates
description: Learn about the different templates that help you get started with Hydrogen.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.

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

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/account/AccountActivateForm.client.tsx">AccountActivateForm</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountAddressBook.client.tsx">AccountAddressBook</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountAddressEdit.client.tsx">AccountAddressEdit</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountCreateForm.client.tsx">AccountCreateForm</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountDeleteAddress.client.tsx">AccountDeleteAddress</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountDetails.client.tsx">AccountDetails</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountDetailsEdit.client.tsx">AccountDetailsEdit</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountLoginForm.client.tsx">AccountLoginForm</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountOrderHistory.client.tsx">AccountOrderHistory</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountPasswordResetForm.client.tsx">AccountPasswordResetForm</a></li>
<li><a href="/templates/demo-store/src/components/account/AccountRecoverForm.client.tsx">AccountRecoverForm</a></li>
</ul>

#### Cards

The following components render card elements:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/cards/ArticleCard.tsx">ArticleCard</a></li>
<li><a href="/templates/demo-store/src/components/cards/CollectionCard.server.tsx">CollectionCard</a></li>
<li><a href="/templates/demo-store/src/components/cards/OrderCard.client.tsx">OrderCard</a></li>
<li><a href="/templates/demo-store/src/components/cards/ProductCard.client.tsx">ProductCard</a></li>
</ul>

#### Cart

The following components render cart elements:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/cart/CartDetails.client.tsx">CartDetails</a></li>
<li><a href="/templates/demo-store/src/components/cart/CartEmpty.client.tsx">CartEmpty</a></li>
<li><a href="/templates/demo-store/src/components/cart/CartLineItem.client.tsx">CartLineItem</a></li>
</ul>

#### Elements

The following components render small chunks of reusable content:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/elements/Button.tsx">Button</a></li>
<li><a href="/templates/demo-store/src/components/elements/Grid.tsx">Grid</a></li>
<li><a href="/templates/demo-store/src/components/elements/Heading.tsx">Heading</a></li>
<li><a href="/templates/demo-store/src/components/elements/Icon.tsx">Icon</a></li>
<li><a href="/templates/demo-store/src/components/elements/Input.tsx">Input</a></li>
<li><a href="/templates/demo-store/src/components/elements/LogoutButton.client.tsx">LogoutButton</a></li>
<li><a href="/templates/demo-store/src/components/elements/Section.tsx">Section</a></li>
<li><a href="/templates/demo-store/src/components/elements/Skeleton.tsx">Skeleton</a></li>
<li><a href="/templates/demo-store/src/components/elements/Text.tsx">Text</a></li>
</ul>

#### Global

The following components render global elements:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/global/CartDrawer.client.tsx">CartDrawer</a></li>
<li><a href="/templates/demo-store/src/components/global/Drawer.client.tsx">Drawer</a></li>
<li><a href="/templates/demo-store/src/components/global/Footer.server.tsx">Footer</a></li>
<li><a href="/templates/demo-store/src/components/global/FooterMenu.client.tsx">FooterMenu</a></li>
<li><a href="/templates/demo-store/src/components/global/Header.client.tsx">Header</a></li>
<li><a href="/templates/demo-store/src/components/global/Layout.server.tsx">Layout</a></li>
<li><a href="/templates/demo-store/src/components/global/MenuDrawer.client.tsx">MenuDrawer</a></li>
<li><a href="/templates/demo-store/src/components/global/Modal.client.tsx">Modal</a></li>
<li><a href="/templates/demo-store/src/components/global/NotFound.server.tsx">NotFound</a></li>
<li><a href="/templates/demo-store/src/components/global/PageHeader.tsx">PageHeader</a></li>
</ul>

#### Product

The following components render product information:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/product/ProductDetail.client.tsx">ProductDetail</a></li>
<li><a href="/templates/demo-store/src/components/product/ProductForm.client.tsx">ProductForm</a></li>
<li><a href="/templates/demo-store/src/components/product/ProductGallery.client.tsx">ProductGallery</a></li>
<li><a href="/templates/demo-store/src/components/product/ProductGrid.client.tsx">ProductGrid</a></li>
<li><a href="/templates/demo-store/src/components/product/ProductOptions.client.tsx">ProductOptions</a></li>
</ul>

#### Search

The following components render search functionality:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/search/NoResultRecommendations.server.tsx">NoResultRecommendations</a></li>
<li><a href="/templates/demo-store/src/components/search/SearchPage.server.tsx">SearchPage</a></li>
</ul>

#### Sections

The following components render specific pieces of content on a page:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/sections/FeaturedCollections.tsx">FeaturedCollections</a></li>
<li><a href="/templates/demo-store/src/components/sections/Hero.tsx">Hero</a></li>
<li><a href="/templates/demo-store/src/components/sections/ProductCards.tsx">ProductCards</a></li>
<li><a href="/templates/demo-store/src/components/sections/ProductSwimlane.server.tsx">ProductSwimlane</a></li>
</ul>

#### Additional components

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/components/CountrySelector.client.tsx">CountrySelector</a></li>
<li><a href="/templates/demo-store/src/components/CustomFont.client.tsx">CustomFont</a></li>
<li><a href="/templates/demo-store/src/components/HeaderFallback.tsx">HeaderFallback</a></li>
</ul>

### Routes

Hydrogen uses [file-based routing](/docs/tutorials/routing). Any pages added to the `src/routes` directory will be automatically registered as routes by the app. The following routes are included in the Demo Store template:

<ul style="column-count: auto;column-width: 12rem;">
<li><a href="/templates/demo-store/src/routes/account">Account</a></li>
<li><a href="/templates/demo-store/src/routes/api">API</a></li>
<li><a href="/templates/demo-store/src/routes/collections">Collections</a></li>
<li><a href="/templates/demo-store/src/routes/journal">Journal</a></li>
<li><a href="/templates/demo-store/src/routes/pages">Pages</a></li>
<li><a href="/templates/demo-store/src/routes/policies">Policies</a></li>
<li><a href="/templates/demo-store/src/routes/products">Products</a></li>
<li><a href="/templates/demo-store/src/routes/admin.server.tsx">Admin</a></li>
<li><a href="/templates/demo-store/src/routes/cart.server.tsx">Cart</a></li>
<li><a href="/templates/demo-store/src/routes/index.server.tsx">Index</a></li>
<li><a href="/templates/demo-store/src/routes/robots.txt.server.ts">Robots</a></li>
<li><a href="/templates/demo-store/src/routes/search.server.tsx">Search</a></li>
<li><a href="/templates/demo-store/src/routes/sitemap.xml.server.ts">Sitemap</a></li>
</ul>
