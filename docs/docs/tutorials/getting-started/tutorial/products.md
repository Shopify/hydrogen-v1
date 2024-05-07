# Build a product page


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Previously, you [built a collection page](/tutorials/getting-started/tutorial/collections/). Your Hydrogen storefront sorts products within your collections, using [server props](/tutorials/server-props/) and [file-based routing](/tutorials/routing/). Now that you have a collections page that renders your products, you’re ready to build a product page.

In this tutorial, you'll build a page that shows detailed product information.

## Scenario

You want to display detailed information about products on your custom storefront. The details that you provide for a product will affect the way that the product is displayed to customers, make it easier for you to organize your products, and make it easier for customers find the product.

By creating a product page, you can share information about a product with customers, including the product’s variants, description, and price. You’ll also be able to offer customers a way to purchase the product.

## What you’ll learn

In this tutorial, you’ll learn how to do the following tasks:

- Create a products route.
- Query products by their handle.
- Generate SEO tags for product pages.
- Implement Shopify Analytics on product pages.
- Fetch the variants associated with a product.
- Add a product gallery.
- Create a variant selector for a product.
- Add a **Buy Now** button to the product page.

![The details for a product and its variants, and a button to purchase the product](https://shopify.dev/assets/custom-storefronts/hydrogen/product-variants-purchase-button.png)

## Requirements

- You’ve completed the [build a collection page](/tutorials/getting-started/tutorial/collections/) tutorial.

## Sample code

If you want to quickly get started, then you can copy and paste the following code from each file into the corresponding files in your Hydrogen app. If the file doesn’t yet exist, then you can create it in your Hydrogen app. This tutorial describes the sample code step by step:

```jsx
// /src/routes/products/[handle].server.jsx

import {
  gql,
  useShopQuery,
  useServerAnalytics,
  useRouteParams,
  ShopifyAnalyticsConstants,
  Seo,
} from "@shopify/hydrogen";
import { Suspense } from "react";

import { Layout } from "../../components/Layout.server";
import ProductDetails from "../../components/ProductDetails.client";

export default function Product({ params }) {
  const { handle } = useRouteParams();

  const {
    data: { product },
  } = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {
      handle,
    },
  });

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: product.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="product" data={product} />
      </Suspense>
      <ProductDetails product={product} />
    </Layout>
  );
}

const PRODUCT_QUERY = gql`
  fragment MediaFields on Media {
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      vendor
      descriptionHtml
      media(first: 7) {
        nodes {
          ...MediaFields
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          compareAtPriceV2 {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
  }
`;
```

```javascript?filename: '/src/components/ProductDetails.client.jsx', title: 'ProductDetails'
import {
  ProductOptionsProvider,
  MediaFile,
  useProductOptions,
  ProductPrice,
  BuyNowButton,
} from "@shopify/hydrogen";

export default function ProductDetails({ product }) {
  return (
    <ProductOptionsProvider data={product}>
      <section className="w-full overflow-x-hidden gap-4 md:gap-8 grid px-6 md:px-8 lg:px-12">
        <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 md:w-full lg:col-span-2">
            <div className="md:col-span-2 snap-center card-image aspect-square md:w-full w-[80vw] shadow rounded">
              <ProductGallery media={product.media.nodes} />
            </div>
          </div>
          <div className="sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
            <div className="grid gap-2">
              <h1 className="text-4xl font-bold leading-10 whitespace-normal">
                {product.title}
              </h1>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                {product.vendor}
              </span>
            </div>
            <ProductForm product={product} />
            <div className="mt-8">
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </ProductOptionsProvider>
  );
}

function ProductForm({ product }) {
  const { options, selectedVariant } = useProductOptions();

  const isOutOfStock = !selectedVariant?.availableForSale || false;
  return (
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({ name, values }) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-wrap items-baseline justify-start gap-6"
              >
                <legend className="whitespace-pre-wrap max-w-prose font-bold text-lead min-w-[4rem]">
                  {name}
                </legend>
                <div className="flex flex-wrap items-baseline gap-4">
                  <OptionRadio name={name} values={values} />
                </div>
              </div>
            );
          })}
        </div>
      }
      <div>
        <ProductPrice
          className="text-gray-500 line-through text-lg font-semibold"
          priceType="compareAt"
          variantId={selectedVariant.id}
          data={product}
        />
        <ProductPrice
          className="text-gray-900 text-lg font-semibold"
          variantId={selectedVariant.id}
          data={product}
        />
      </div>
      <div className="grid items-stretch gap-4">
        {isOutOfStock ? (
          <span className="text-black text-center py-3 px-6 border rounded-sm leading-none ">
            Available in 2-3 weeks
          </span>
        ) : (
          <BuyNowButton variantId={selectedVariant.id}>
            <span className="bg-black text-white inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none w-full border">
              Buy it now
            </span>
          </BuyNowButton>
        )}
      </div>
    </form>
  );
}

function OptionRadio({ values, name }) {
  const { selectedOptions, setSelectedOption } = useProductOptions();

  return (
    <>
      {values.map((value) => {
        const checked = selectedOptions[name] === value;
        const id = `option-${name}-${value}`;

        return (
          <label key={id} htmlFor={id}>
            <input
              className="sr-only"
              type="radio"
              id={id}
              name={`option[${name}]`}
              value={value}
              checked={checked}
              onChange={() => setSelectedOption(name, value)}
            />
            <div
              className={`leading-none border-b-[2px] py-1 cursor-pointer transition-all duration-200 ${
                checked ? "border-gray-500" : "border-neutral-50"
              }`}
            >
              {value}
            </div>
          </label>
        );
      })}
    </>
  );
}

function ProductGallery({ media }) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`grid gap-4 overflow-x-scroll grid-flow-col md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 w-screen md:w-full lg:col-span-2`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === "MODEL_3D") {
          extraProps = {
            interactionPromptThreshold: "0",
            ar: true,
            loading: "eager",
            disableZoom: true,
          };
        }

        const data = {
          ...med,
          image: {
            ...med.image,
            altText: med.alt || "Product image",
          },
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"
            } snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded`}
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover`}
              data={data}
              options={{
                crop: "center",
              }}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}
```



## Step 1: Create a products route

You can create a products route similar to how you previously created [a collections route](/tutorials/getting-started/tutorial/collections.md#step-1-create-a-collections-route).

To begin building your product page, create a file called `/src/routes/products/[handle].server.jsx` that registers a new products route. Then, display the dynamic handle on the page within a layout component.

```jsx
// /src/routes/products/[handle].server.jsx

import {
  useRouteParams,
} from "@shopify/hydrogen";

import { Layout } from "../../components/Layout.server";

export default function Product() {
  const { handle } = useRouteParams();

  return (
    <Layout>
      <section className="p-6 md:p-8 lg:p-12">
        This will be the product page for <strong>{handle}</strong>
      </section>
    </Layout>
  );
}
```



The products route is registered. Clicking a product takes you to a dynamic product page:

![A dynamic product page](https://shopify.dev/assets/custom-storefronts/hydrogen/dynamic-product-page.png)

## Step 2: Query a product by handle

Similar to [querying a collection by its handle](/tutorials/getting-started/tutorial/collections.md#step-2-query-a-collection-by-handle), you can use a product’s handle to query a product.

If a handle isn't specified when a product is created, then the handle is generated from the product's original title, replacing any spaces with hyphens. For example, a product that was created with the title **The Full Stack** might have the handle **the-full-stack**.

At the bottom of your `/src/routes/products/[handle].server.jsx` file, add a GraphQL query that retrieves a product by its handle. You'll also set up an `Seo` component and implement Shopify Analytics, [similar to how you did this for collection pages](/tutorials/getting-started/tutorial/collections.md#step-3-generate-seo-tags-and implement-shopify-analytics).

```jsx
// /src/routes/products/[handle].server.jsx

import {
  gql,
  useShopQuery,
  useServerAnalytics,
  useRouteParams,
  ShopifyAnalyticsConstants,
  Seo,
} from "@shopify/hydrogen";
import { Suspense } from "react";

import { Layout } from "../../components/Layout.server";

export default function Product({ params }) {
  const { handle } = useRouteParams();

  const {
    data: { product },
  } = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {
      handle,
    },
  });

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: product.id,
    },
  });
  // Implement an `Seo` component for the product. By specifying "type=product"
  // you're overriding the `defaultSeo` type in the Layout component.
  return (
    <Layout>
      <Suspense>
        <Seo type="product" data={product} />
      </Suspense>
      <section className="p-6 md:p-8 lg:p-12">
        This will be the product page for <strong>{product.title}</strong>
      </section>
    </Layout>
  );
}

// Add a Graphql query that retrieves a product by its handle.
const PRODUCT_QUERY = gql`
  query Product($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    product(handle: $handle) {
      id
      title
      seo {
        title
        description
      }
    }
  }
`;
```



The product page renders the following dynamic content:

![Dynamic content on the product page](https://shopify.dev/assets/custom-storefronts/hydrogen/dynamic-content-product-page.png)

## Step 3: Query product and variant details

In this step, you'll create your first [client component](/tutorials/react-server-components/index.md#component-types) - `ProductDetails`. Client components render on the client, enabling a client-side state. Client components end in `.client.jsx`.

Similar to [querying all products and variants that belong to a collection](/tutorials/getting-started/tutorial/collections.md#step-4-query-products-and-variants), you can set up a GraphQL query to retrieve detailed information about products and variants.

> Tip:
> In the following code sample, you’ll notice a reference to a [`ProductOptionsProvider`](/components/product-variant/productoptionsprovider/) component. The `ProductOptionsProvider` component sets up a context with state that tracks the selected variant and options. Descendents of this component can use the [`useProductOptions`](/hooks/product-variant/useproductoptions/) hook.

1. Create a `ProductDetails` component to display product information, such as the description, title, and image of the product:

    ```jsx
    // /src/components/ProductDetails.client.jsx

    import { ProductOptionsProvider } from "@shopify/hydrogen";

    export default function ProductDetails({ product }) {
      return (
        <ProductOptionsProvider data={product}>
          <section className="w-full overflow-x-hidden gap-4 md:gap-8 grid px-6 md:px-8 lg:px-12">
            <div className="grid gap-2 mt-10">
              <h1 className="text-4xl font-bold leading-10 whitespace-normal">
                {product.title}
              </h1>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                {product.vendor}
              </span>
            </div>
            <div className="mt-8">
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              ></div>
            </div>
          </section>
        </ProductOptionsProvider>
      );
    }
    ```



2. In `/src/routes/products/[handle].server.jsx`, update the GraphQL query to retrieve details about the product and its associated variants and pass the data through to the new **ProductDetails** component:

    ```jsx
    // /src/routes/products/[handle].server.jsx
    import {
      gql,
      useShopQuery,
      useServerAnalytics,
      useRouteParams,
      ShopifyAnalyticsConstants,
      Seo,
    } from "@shopify/hydrogen";
    import { Suspense } from "react";

    import { Layout } from "../../components/Layout.server";
    import ProductDetails from "../../components/ProductDetails.client";

    export default function Product({ params }) {
      const { handle } = useRouteParams();

      const {
        data: { product },
      } = useShopQuery({
        query: PRODUCT_QUERY,
        variables: {
          handle,
        },
      });

      useServerAnalytics({
        shopify: {
          pageType: ShopifyAnalyticsConstants.pageType.product,
          resourceId: product.id,
        },
      });

      return (
        <Layout>
          <Suspense>
            <Seo type="product" data={product} />
          </Suspense>
          <ProductDetails product={product} />
        </Layout>
      );
    }

    // Retrieve product media in preparation for the next step in the tutorial:
    // Step 4: Add a product gallery
    const PRODUCT_QUERY = gql`
      fragment MediaFields on Media {
        mediaContentType
        alt
        previewImage {
          url
        }
        ... on MediaImage {
          id
          image {
            url
            width
            height
          }
        }
        ... on Video {
          id
          sources {
            mimeType
            url
          }
        }
        ... on Model3d {
          id
          sources {
            mimeType
            url
          }
        }
        ... on ExternalVideo {
          id
          embedUrl
          host
        }
      }
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
          vendor
          descriptionHtml
          media(first: 7) {
            nodes {
              ...MediaFields
            }
          }
          variants(first: 100) {
            nodes {
              id
              availableForSale
              compareAtPriceV2 {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                id
                url
                altText
                width
                height
              }
              priceV2 {
                amount
                currencyCode
              }
              sku
              title
              unitPrice {
                amount
                currencyCode
              }
            }
          }
          seo {
            description
            title
          }
        }
      }
    `;
    ```



    The page renders details about the product in a basic layout:

    ![Details about the product in a basic layout](https://shopify.dev/assets/custom-storefronts/hydrogen/product-details-basic-layout.png)

## Step 4: Add a product gallery

In this step, you'll use a [`MediaFile`](/components/primitive/mediafile/) component to render media for your product pages. The `MediaFile` component renders an `Image`, a `Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `mediaContentType` of the `media` provided as a prop. The `MediaFile` component is also compatible with 3D models.

```jsx
// /src/components/ProductDetails.client.jsx

import { ProductOptionsProvider, MediaFile } from "@shopify/hydrogen";

export default function ProductDetails({ product }) {
  return (
    <ProductOptionsProvider data={product}>
      <section className="w-full overflow-x-hidden gap-4 md:gap-8 grid px-6 md:px-8 lg:px-12">
        <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 md:w-full lg:col-span-2">
            <div className="md:col-span-2 snap-center card-image aspect-square md:w-full w-[80vw] shadow rounded">
              <ProductGallery media={product.media.nodes} />
            </div>
          </div>
          <div className="sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
            <div className="grid gap-2">
              <h1 className="text-4xl font-bold leading-10 whitespace-normal">
                {product.title}
              </h1>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                {product.vendor}
              </span>
            </div>
            <div className="mt-8">
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </ProductOptionsProvider>
  );
}

function ProductGallery({ media }) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`grid gap-4 overflow-x-scroll grid-flow-col md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 w-screen md:w-full lg:col-span-2`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === "MODEL_3D") {
          extraProps = {
            interactionPromptThreshold: "0",
            ar: true,
            loading: "eager",
            disableZoom: true,
          };
        }

        const data = {
          ...med,
          image: {
            ...med.image,
            altText: med.alt || "Product image",
          },
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"
            } snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded`}
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover`}
              data={data}
              options={{
                crop: "center",
              }}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}
```



The page now renders an image next to the details about the product:

![An image next to the details about the product](https://shopify.dev/assets/custom-storefronts/hydrogen/image-with-product-details.png)

## Step 5: Create a product form

Next, you'll create a product form that includes a variant selector, product price, and buy button:

- The variant selector will use the [`useProductOptions`](/hooks/product-variant/useproductoptions/) hook to retrieve selected options.
- The [`ProductPrice`](/components/product-variant/productprice/) component will render a [`Money`](/components/primitive/money/) component with the product [`priceRange`](https://shopify.dev/api/storefront/latest/objects/productpricerange/)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range.
- The [`BuyNowButton`](/components/cart/buynowbutton/) component will render a button that adds an item to the cart and redirects the custom to checkout.

> Tip:
> Consider styling the buy button to be unique and prominent so that it’s easy for customers to make purchases.

```jsx
// /src/components/ProductDetails.client.jsx

import {
  ProductOptionsProvider,
  MediaFile,
  useProductOptions,
  ProductPrice,
  BuyNowButton,
} from "@shopify/hydrogen";

export default function ProductDetails({ product }) {
  return (
    <ProductOptionsProvider data={product}>
      <section className="w-full overflow-x-hidden gap-4 md:gap-8 grid px-6 md:px-8 lg:px-12">
        <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 md:w-full lg:col-span-2">
            <div className="md:col-span-2 snap-center card-image aspect-square md:w-full w-[80vw] shadow rounded">
              <ProductGallery media={product.media.nodes} />
            </div>
          </div>
          <div className="sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
            <div className="grid gap-2">
              <h1 className="text-4xl font-bold leading-10 whitespace-normal">
                {product.title}
              </h1>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                {product.vendor}
              </span>
            </div>
            <ProductForm product={product} />
            <div className="mt-8">
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </ProductOptionsProvider>
  );
}

function ProductForm({ product }) {
  const { options, selectedVariant } = useProductOptions();

  const isOutOfStock = !selectedVariant?.availableForSale || false;
  return (
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({ name, values }) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-wrap items-baseline justify-start gap-6"
              >
                <legend className="whitespace-pre-wrap max-w-prose font-bold text-lead min-w-[4rem]">
                  {name}
                </legend>
                <div className="flex flex-wrap items-baseline gap-4">
                  <OptionRadio name={name} values={values} />
                </div>
              </div>
            );
          })}
        </div>
      }
      <div>
        <ProductPrice
          className="text-gray-500 line-through text-lg font-semibold"
          priceType="compareAt"
          variantId={selectedVariant.id}
          data={product}
        />
        <ProductPrice
          className="text-gray-900 text-lg font-semibold"
          variantId={selectedVariant.id}
          data={product}
        />
      </div>
      <div className="grid items-stretch gap-4">
        {isOutOfStock ? (
          <span className="text-black text-center py-3 px-6 border rounded-sm leading-none ">
            Available in 2-3 weeks
          </span>
        ) : (
          <BuyNowButton variantId={selectedVariant.id}>
            <span className="bg-black text-white inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none w-full border">
              Buy it now
            </span>
          </BuyNowButton>
        )}
      </div>
    </form>
  );
}

function OptionRadio({ values, name }) {
  const { selectedOptions, setSelectedOption } = useProductOptions();

  return (
    <>
      {values.map((value) => {
        const checked = selectedOptions[name] === value;
        const id = `option-${name}-${value}`;

        return (
          <label key={id} htmlFor={id}>
            <input
              className="sr-only"
              type="radio"
              id={id}
              name={`option[${name}]`}
              value={value}
              checked={checked}
              onChange={() => setSelectedOption(name, value)}
            />
            <div
              className={`leading-none border-b-[2px] py-1 cursor-pointer transition-all duration-200 ${
                checked ? "border-gray-500" : "border-neutral-50"
              }`}
            >
              {value}
            </div>
          </label>
        );
      })}
    </>
  );
}

function ProductGallery({ media }) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`grid gap-4 overflow-x-scroll grid-flow-col md:grid-flow-row  md:p-0 md:overflow-x-auto md:grid-cols-2 w-screen md:w-full lg:col-span-2`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === "MODEL_3D") {
          extraProps = {
            interactionPromptThreshold: "0",
            ar: true,
            loading: "eager",
            disableZoom: true,
          };
        }

        const data = {
          ...med,
          image: {
            ...med.image,
            altText: med.alt || "Product image",
          },
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"
            } snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded`}
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover`}
              data={data}
              options={{
                crop: "center",
              }}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}
```



The product page now renders all of the details for a product and its variants. It also includes a button to purchase the product. In the [next tutorial](/tutorials/getting-started/tutorial/cart/), you’ll define the context for interacting with a cart and add an **Add to cart** button, which allows customers to choose products to purchase without completing the payment process.

![The details for a product and its variants, and a button to purchase the product](https://shopify.dev/assets/custom-storefronts/hydrogen/product-variants-purchase-button.png)

## Next steps

- Learn how to [build a cart](/tutorials/getting-started/tutorial/cart/).
