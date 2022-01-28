<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Seo and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `Seo` component is use to renders SEO information on webpage.

## Example code

```tsx
// this is a first level page component
import {Seo} from '@shopify/hydrogen';

export function MyPageComponent() {
  return <Seo product={product} />;
}
```

## Props

Most of the props below are intended to be use alone. A few props that can be combined are listed below.

| Name        | Type                                                                                                    | Description                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultPage | <code>{title: string; description: string; url?: string; titleTemplate?: string; lang?: string;}</code> | Information to be render as SEO on every single page on the site as default. url should be passed in from the server request whenever possible. Can be combined with image prop. |
| homePage    | <code>{title: Title; url: string; description?: Description;}</code>                                    | Information to be render as SEO once on the Home Page. Can be combined with description, twitter, and image prop.                                                                |
| product     | <code>[Product](https://shopify.dev/api/admin-graphql/2022-01/objects/product)</code>                   | Product data to be dispaly. Must have included title, description, vendor, handle, at least one image, at least one variant, and pricing information.                            |
| collection  | <code>[Collection](https://shopify.dev/api/admin-graphql/2022-01/objects/Collection)</code>             | Collection data to be dispaly. Must have included title and description.                                                                                                         |
| page        | <code>{title: string; seo: {title?: string; description?: string;}}</code>                              | Collection data to be dispaly. Must have included title and description. Can be combined with image prop.                                                                        |
| title       | <code>String</code>                                                                                     | Title SEO to be render.                                                                                                                                                          |
| description | <code>String</code>                                                                                     | Description SEO to be render. Can be combined with homePage prop.                                                                                                                |
| twitter     | <code>{site: string; title: string; description: string;}</code>                                        | Twitter SEO to be render. Can be combined with homePage prop.                                                                                                                    |
| image       | <code>interface Image {url: string; width: Number; height: Number; altText?: string;}</code>            | Image SEO to be render. Can be combined with one of defaultPage, homePage or page props.                                                                                         |

## Component type

The `Seo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).
