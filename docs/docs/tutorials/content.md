# Integrate content in Hydrogen


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



> Beta:
> The Content platform is in beta and is only available to [Shopify Plus](https://www.shopify.com/plus) and [Advanced](https://www.shopify.com/pricing) plans.

Hydrogen includes support for integrating content on storefronts. For example, you might have content about product features, specifications, or size charts. You can integrate content into your Hydrogen storefront using the [Storefront API](https://shopify.dev/api/storefront).

![Product features content in a custom storefront](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-content.gif)

## Build a content model

Content models are custom object schemas that you can create and associate with Shopify resources, such as products, collections, and orders. You use content models to create and store structured content in your Hydrogen storefront. You can build a content model in the **Content** section of your Shopify admin.

The following example shows a content model that displays product features content:

![Product feature metafields](https://shopify.dev/assets/custom-storefronts/hydrogen/product-feature-metafields.png)

After you've set up the content model, you can add content:

![Content associated with the product feature metafield](https://shopify.dev/assets/custom-storefronts/hydrogen/product-feature-content.png)

The following example shows an individual content entry that maps to the content model:

![Individual content entry](https://shopify.dev/assets/custom-storefronts/hydrogen/individual-entry-content.png)

## Build a content layout

The following code snippet provides an example layout of product features content on the product details page. The content model, `features`, is mapped to the layout of the page:

```js
// /src/routes/products/[handle].server.jsx
...
<Layout>
  <Seo type="product" data={product} />
  <ProductDetails product={product} />
  <section>
    {features.map(
      ({id, heading, tagline, description, featured_image}, i) => (
        <div
          key={id}
          className={`flex flex-col ${
            isOdd(i) ? 'md:flex-row' : 'md:flex-row-reverse'
          } md:justify-center gap-4 p-6 md:gap-8 md:p-12`}
        >
          <Image
            className={`object-cover w-full md:w-1/2 aspect-[4/3]`}
            width={featured_image.width}
            height={featured_image.height}
            src={featured_image.url}
          />

          <div className="flex flex-col items-start justify-center w-full gap-4 md:w-1/2">
            <h4 className="text-base font-bold uppercase">{heading}</h4>
            <h3 className="text-3xl font-bold">{title(tagline)}</h3>
            <p className="text-base">{description}</p>
          </div>
        </div>
      ),
    )}
  </section>
</Layout>
...
```

## Retrieve content

Your Hydrogen storefront can retrieve the data that's stored in a content model using the Storefront API. You can retrieve content by querying the `type` field, which is the definition or type of data that the metafield stores.

All connected [metafields](http://shopify.dev/apps/custom-data/metafields) have a `namespace` that matches the `type` field.

### Basic example

The following example shows a Storefront API query that retrieves content by its associated `handle`:

```graphql
# POST /api/unstable/graphql.json

query {
 content(type: "lookbook", first: 10) {
   edges {
     node {
       handle
     }
   }
 }
}
```



### Advanced example

The following GraphQL query retrieves a `references` array for product content. The query returns `nil` if no object is referenced on the product details page.

```graphql
# /src/routes/products/[handle].server.jsx

const QUERY = gql`
  query product(
    $handle: String!
  ) {
    product: product(handle: $handle) {
      product_features: metafield(
        namespace: "custom"
        key: "product_feature"
      ) {
        references(first: 5) {
          edges {
            node {
              ... on ContentEntry {
                heading: field(key: "heading") {
                  value
                }
                tagline: field(key: "tagline") {
                  value
                }
                description: field(key: "description") {
                  value
                }
                featured_image: field(key: "featured_image") {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;
```



![Product features content in a custom storefront](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-content.gif)

## Next steps

- Learn about the [CSS support](/tutorials/css-support/) built into Hydrogen.
- Learn how to reference and serve [static assets](/tutorials/static-assets/manage-static-assets/) in Hydrogen.
