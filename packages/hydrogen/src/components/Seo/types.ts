export type Title = string;

export type Description = string;

export interface Twitter {
  site: string;
  title: string;
  description: string;
}

export interface Image {
  url: string;
  width: Number;
  height: Number;
  altText?: string;
}

export interface DefaultPage {
  title: Title;
  description: Description;
  url?: string;
  titleTemplate?: string;
  lang?: string;
}

export interface HomePage {
  title: Title;
  url: string;
  description?: Description;
}

export interface Product {
  title: Title;
  description: Description;
  seo: {
    title?: Title;
    description?: Description;
  };
  handle: string;
  vendor: string;
  images: {edges: {node: Image}[]};
  variants: {
    edges: {
      node: {
        image: {
          url: Image['url'];
        };
        availableForSale: Boolean;
        priceV2: {amount: Number; currencyCode: string};
        sku?: string;
      };
    }[];
  };
}

export interface Collection {
  title: Title;
  description: Description;
  seo?: {
    title?: Title;
    description?: Description;
  };
  image?: Image;
}

export interface Page {
  title: Title;
  seo: {
    title?: Title;
    description?: Description;
  };
}
