import gql from 'graphql-tag';
import {useShop, useShopQuery, flattenConnection} from '@shopify/hydrogen';

export default function Wizardlyhel() {
  return <InnerContent />;
}

function InnerContent() {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle: 'freestyle-collection',
      country: 'US',
      language: 'EN',
      numProducts: 24,
    },
    preload: true,
  });

  const collection = data.collection;
  const products = flattenConnection(collection.products);

  return (
    <>
      <h1>Wizardlyhel - {collection.title}</h1>
      <div
        dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
        className="text-lg"
      />
      <p className="text-sm text-gray-500 mt-5 mb-5">
        {products.length} {products.length > 1 ? 'products' : 'product'}
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </>
  );
}

const QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $numProducts: Int!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      descriptionHtml
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: $numProducts) {
        edges {
          node {
            title
            vendor
            handle
            descriptionHtml
            compareAtPriceRange {
              maxVariantPrice {
                currencyCode
                amount
              }
              minVariantPrice {
                currencyCode
                amount
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                  priceV2 {
                    currencyCode
                    amount
                  }
                  compareAtPriceV2 {
                    currencyCode
                    amount
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

{
  /* <ul id="product-grid" data-id="template--14750749425723__main-collection-product-grid" class="
              grid product-grid grid--2-col-tablet-down
              grid--4-col-desktop">
<li class="grid__item">
                  

<link href="//cdn.shopify.com/s/files/1/0117/8668/2427/t/12/assets/component-rating.css?v=24573085263941240431652137051" rel="stylesheet" type="text/css" media="all">
<div class="card-wrapper underline-links-hover">
    <div class="card
      card--card
       card--text
       color-background-1 gradient
      
       ratio" style="--ratio-percent: 100%;">
      <div class="card__inner " style="--ratio-percent: 100%;"><div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">
              <a href="/products/apple-tree-leaf" class="full-unstyled-link">
                Apple tree leaf
              </a>
            </h3>
          </div>
          <div class="card__badge bottom left"></div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 class="card__heading" id="title-template--14750749425723__main-collection-product-grid-5027924541499">
            <a href="/products/apple-tree-leaf" class="full-unstyled-link">
              Apple tree leaf
            </a>
          </h3>
          <div class="card-information"><span class="caption-large light"></span>
<div class="price ">
  <div class="price__container"><div class="price__regular">
      <span class="visually-hidden visually-hidden--inline">Regular price</span>
      <span class="price-item price-item--regular">
        $0.00 CAD
      </span>
    </div>
    <div class="price__sale">
        <span class="visually-hidden visually-hidden--inline">Regular price</span>
        <span>
          <s class="price-item price-item--regular">
            
              
            
          </s>
        </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
      <span class="price-item price-item--sale price-item--last">
        $0.00 CAD
      </span>
    </div>
    <small class="unit-price caption hidden">
      <span class="visually-hidden">Unit price</span>
      <span class="price-item price-item--last">
        <span></span>
        <span aria-hidden="true">/</span>
        <span class="visually-hidden">&nbsp;per&nbsp;</span>
        <span>
        </span>
      </span>
    </small>
  </div></div>

          </div>
        </div><div class="card__badge bottom left"></div>
      </div>
    </div>
  </div>
                </li>
<li class="grid__item">
                  

<link href="//cdn.shopify.com/s/files/1/0117/8668/2427/t/12/assets/component-rating.css?v=24573085263941240431652137051" rel="stylesheet" type="text/css" media="all">
<div class="card-wrapper underline-links-hover">
    <div class="card
      card--card
       card--text
       color-background-1 gradient
      
       ratio" style="--ratio-percent: 100%;">
      <div class="card__inner " style="--ratio-percent: 100%;"><div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">
              <a href="/products/coconut-tree-leaf" class="full-unstyled-link">
                Coconut tree leaf
              </a>
            </h3>
          </div>
          <div class="card__badge bottom left"></div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 class="card__heading" id="title-template--14750749425723__main-collection-product-grid-5027924410427">
            <a href="/products/coconut-tree-leaf" class="full-unstyled-link">
              Coconut tree leaf
            </a>
          </h3>
          <div class="card-information"><span class="caption-large light"></span>
<div class="price ">
  <div class="price__container"><div class="price__regular">
      <span class="visually-hidden visually-hidden--inline">Regular price</span>
      <span class="price-item price-item--regular">
        $10.00 CAD
      </span>
    </div>
    <div class="price__sale">
        <span class="visually-hidden visually-hidden--inline">Regular price</span>
        <span>
          <s class="price-item price-item--regular">
            
              
            
          </s>
        </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
      <span class="price-item price-item--sale price-item--last">
        $10.00 CAD
      </span>
    </div>
    <small class="unit-price caption hidden">
      <span class="visually-hidden">Unit price</span>
      <span class="price-item price-item--last">
        <span></span>
        <span aria-hidden="true">/</span>
        <span class="visually-hidden">&nbsp;per&nbsp;</span>
        <span>
        </span>
      </span>
    </small>
  </div></div>

          </div>
        </div><div class="card__badge bottom left"></div>
      </div>
    </div>
  </div>
                </li>
<li class="grid__item">
                  

<link href="//cdn.shopify.com/s/files/1/0117/8668/2427/t/12/assets/component-rating.css?v=24573085263941240431652137051" rel="stylesheet" type="text/css" media="all">
<div class="card-wrapper underline-links-hover">
    <div class="card
      card--card
       card--text
       color-background-1 gradient
      
       ratio" style="--ratio-percent: 100%;">
      <div class="card__inner " style="--ratio-percent: 100%;"><div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">
              <a href="/products/cactus-needle" class="full-unstyled-link">
                Cactus Needle
              </a>
            </h3>
          </div>
          <div class="card__badge bottom left"></div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 class="card__heading" id="title-template--14750749425723__main-collection-product-grid-5027924148283">
            <a href="/products/cactus-needle" class="full-unstyled-link">
              Cactus Needle
            </a>
          </h3>
          <div class="card-information"><span class="caption-large light"></span>
<div class="price ">
  <div class="price__container"><div class="price__regular">
      <span class="visually-hidden visually-hidden--inline">Regular price</span>
      <span class="price-item price-item--regular">
        $10.00 CAD
      </span>
    </div>
    <div class="price__sale">
        <span class="visually-hidden visually-hidden--inline">Regular price</span>
        <span>
          <s class="price-item price-item--regular">
            
              
            
          </s>
        </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
      <span class="price-item price-item--sale price-item--last">
        $10.00 CAD
      </span>
    </div>
    <small class="unit-price caption hidden">
      <span class="visually-hidden">Unit price</span>
      <span class="price-item price-item--last">
        <span></span>
        <span aria-hidden="true">/</span>
        <span class="visually-hidden">&nbsp;per&nbsp;</span>
        <span>
        </span>
      </span>
    </small>
  </div></div>

          </div>
        </div><div class="card__badge bottom left"></div>
      </div>
    </div>
  </div>
                </li>
<li class="grid__item">
                  

<link href="//cdn.shopify.com/s/files/1/0117/8668/2427/t/12/assets/component-rating.css?v=24573085263941240431652137051" rel="stylesheet" type="text/css" media="all">
<div class="card-wrapper underline-links-hover">
    <div class="card
      card--card
       card--media
       color-background-1 gradient
      
      " style="--ratio-percent: 125.0%;">
      <div class="card__inner  ratio" style="--ratio-percent: 125.0%;"><div class="card__media">
            <div class="media media--transparent media--hover-effect">
              
              <img srcset="//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662&amp;width=165 165w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662&amp;width=360 360w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662&amp;width=533 533w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662&amp;width=720 720w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662&amp;width=940 940w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662&amp;width=1066 1066w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662 1920w" src="//cdn.shopify.com/s/files/1/0117/8668/2427/products/selective-focus-photography-of-white-cherry-blossom-flowers-1009831_9d360e64-6b64-4da8-a7a6-d8393bdce911.jpg?v=1584831662&amp;width=533" sizes="(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" alt="White Cherry Blossoms" class="motion-reduce" loading="lazy" width="1920" height="1280">
              
</div>
          </div><div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">
              <a href="/products/white-cherry-blossoms" class="full-unstyled-link">
                White Cherry Blossoms
              </a>
            </h3>
          </div>
          <div class="card__badge bottom left"></div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 class="card__heading h5" id="title-template--14750749425723__main-collection-product-grid-4680694693947">
            <a href="/products/white-cherry-blossoms" class="full-unstyled-link">
              White Cherry Blossoms
            </a>
          </h3>
          <div class="card-information"><span class="caption-large light"></span>
<div class="price ">
  <div class="price__container"><div class="price__regular">
      <span class="visually-hidden visually-hidden--inline">Regular price</span>
      <span class="price-item price-item--regular">
        $10.00 CAD
      </span>
    </div>
    <div class="price__sale">
        <span class="visually-hidden visually-hidden--inline">Regular price</span>
        <span>
          <s class="price-item price-item--regular">
            
              
            
          </s>
        </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
      <span class="price-item price-item--sale price-item--last">
        $10.00 CAD
      </span>
    </div>
    <small class="unit-price caption hidden">
      <span class="visually-hidden">Unit price</span>
      <span class="price-item price-item--last">
        <span></span>
        <span aria-hidden="true">/</span>
        <span class="visually-hidden">&nbsp;per&nbsp;</span>
        <span>
        </span>
      </span>
    </small>
  </div></div>

          </div>
        </div><div class="card__badge bottom left"></div>
      </div>
    </div>
  </div>
                </li>
<li class="grid__item">
                  

<link href="//cdn.shopify.com/s/files/1/0117/8668/2427/t/12/assets/component-rating.css?v=24573085263941240431652137051" rel="stylesheet" type="text/css" media="all">
<div class="card-wrapper underline-links-hover">
    <div class="card
      card--card
       card--media
       color-background-1 gradient
      
      " style="--ratio-percent: 125.0%;">
      <div class="card__inner  ratio" style="--ratio-percent: 125.0%;"><div class="card__media">
            <div class="media media--transparent media--hover-effect">
              
              <img srcset="//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696&amp;width=165 165w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696&amp;width=360 360w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696&amp;width=533 533w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696&amp;width=720 720w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696&amp;width=940 940w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696&amp;width=1066 1066w,//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696 1920w" src="//cdn.shopify.com/s/files/1/0117/8668/2427/products/beautiful-bloom-blooming-blossom-548377.jpg?v=1584831696&amp;width=533" sizes="(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" alt="Pink Cherry Blossoms" class="motion-reduce" loading="lazy" width="1920" height="1314">
              
</div>
          </div><div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">
              <a href="/products/cherry-blossoms" class="full-unstyled-link">
                Pink Cherry Blossoms
              </a>
            </h3>
          </div>
          <div class="card__badge bottom left"></div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 class="card__heading h5" id="title-template--14750749425723__main-collection-product-grid-4680691482683">
            <a href="/products/cherry-blossoms" class="full-unstyled-link">
              Pink Cherry Blossoms
            </a>
          </h3>
          <div class="card-information"><span class="caption-large light"></span>
<div class="price ">
  <div class="price__container"><div class="price__regular">
      <span class="visually-hidden visually-hidden--inline">Regular price</span>
      <span class="price-item price-item--regular">
        $10.00 CAD
      </span>
    </div>
    <div class="price__sale">
        <span class="visually-hidden visually-hidden--inline">Regular price</span>
        <span>
          <s class="price-item price-item--regular">
            
              
            
          </s>
        </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
      <span class="price-item price-item--sale price-item--last">
        $10.00 CAD
      </span>
    </div>
    <small class="unit-price caption hidden">
      <span class="visually-hidden">Unit price</span>
      <span class="price-item price-item--last">
        <span></span>
        <span aria-hidden="true">/</span>
        <span class="visually-hidden">&nbsp;per&nbsp;</span>
        <span>
        </span>
      </span>
    </small>
  </div></div>

          </div>
        </div><div class="card__badge bottom left"></div>
      </div>
    </div>
  </div>
                </li></ul> */
}
