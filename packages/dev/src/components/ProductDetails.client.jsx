import {Product, flattenConnection, useProduct} from '@shopify/hydrogen/client';

import ProductOptions from './ProductOptions.client';
import Gallery from './Gallery.client';
import Seo from './Seo.client';
import ProductReviewMarkup from './ProductReview';

function ProductPriceMarkup() {
  return (
    <div className="flex flex-col items-end md:items-start md:mb-4">
      <Product.SelectedVariant.Price
        priceType="compareAt"
        className="text-gray-500 line-through text-lg mr-2.5"
      >
        {({amount, currencyNarrowSymbol}) => `${currencyNarrowSymbol}${amount}`}
      </Product.SelectedVariant.Price>
      <Product.SelectedVariant.Price className="text-gray-900 text-lg">
        {({currencyCode, amount, currencyNarrowSymbol}) =>
          `${currencyCode} ${currencyNarrowSymbol}${amount}`
        }
      </Product.SelectedVariant.Price>
      <Product.SelectedVariant.UnitPrice className="text-gray-500 text-lg">
        {({currencyCode, amount, currencyNarrowSymbol, referenceUnit}) =>
          `${currencyCode} ${currencyNarrowSymbol}${amount}/${referenceUnit}`
        }
      </Product.SelectedVariant.UnitPrice>
    </div>
  );
}

function AddToCartMarkup() {
  const {selectedVariant} = useProduct();
  const isOutOfStock = !selectedVariant.availableForSale;

  return (
    <div className="space-y-4 mb-8">
      <Product.SelectedVariant.AddToCartButton
        className="text-center font-mono font-semibold p-4 w-full border-4 border-white shadow-md bg-blue-600 text-white disabled:border-gray-300 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Out of stock' : 'Add to bag'}
      </Product.SelectedVariant.AddToCartButton>
      {isOutOfStock ? (
        <p className="text-black text-center">Available in 2-3 weeks</p>
      ) : (
        <Product.SelectedVariant.BuyNowButton className="bg-black text-white text-center font-mono font-semibold p-4 w-full border-4 border-white shadow-md">
          Buy it now
        </Product.SelectedVariant.BuyNowButton>
      )}
    </div>
  );
}

function SizeChart() {
  return (
    <>
      <h3
        className="text-xl text-black font-semibold mt-8 mb-4"
        id="size-chart"
      >
        Size chart
      </h3>
      <table className="min-w-full table-fixed text-sm">
        <thead>
          <tr className="bg-black text-white">
            <th className="w-1/4 py-2 px-4">Board Size</th>
            <th className="w-1/4 py-2 px-4">154</th>
            <th className="w-1/4 py-2 px-4">158</th>
            <th className="w-1/4 py-2 px-4">160</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border border-black">Weight Range</td>
            <td className="p-3 border border-black">120-180 lbs. /54-82kg</td>
            <td className="p-3 border border-black">150-200 lbs. /68-91 kg</td>
            <td className="p-3 border border-black">
              180-260 lbs.+ /82-118 kg+
            </td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Waist Width</td>
            <td className="p-3 border border-black">246mm</td>
            <td className="p-3 border border-black">255mm</td>
            <td className="p-3 border border-black">258mm</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Stance Width</td>
            <td className="p-3 border border-black">-40</td>
            <td className="p-3 border border-black">-40</td>
            <td className="p-3 border border-black">-40</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Binding Sizes</td>
            <td className="p-3 border border-black">
              Men&rsquo;s S/M, Women&rsquo;s S/M
            </td>
            <td className="p-3 border border-black">
              Men&rsquo;s L, Women&rsquo;s L
            </td>
            <td className="p-3 border border-black">
              Men&rsquo;s L, Women&rsquo;s L
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default function ProductDetails({product}) {
  const initialVariant = flattenConnection(product.variants)[0];

  return (
    <>
      <Seo product={product} />
      <Product product={product} initialVariantId={initialVariant.id}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-x-8 my-16">
          <div className="md:hidden mt-5 mb-8">
            <Product.Title
              as="h1"
              className=" text-4xl md:text-5xl font-black text-black mb-4"
            />
            {product.vendor && (
              <div className="text-sm font-medium mb-2 text-gray-900">
                {product.vendor}
              </div>
            )}
            <span />
            <div className="flex justify-between md:block">
              <ProductReviewMarkup />
              <ProductPriceMarkup />
            </div>
          </div>

          <Gallery />

          {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
          <div>
            <div className="hidden md:block">
              <Product.Title
                as="h1"
                className="text-4xl md:text-5xl font-black text-black mb-4"
              />
              {product.vendor && (
                <div className="text-sm font-medium mb-2 text-gray-900">
                  {product.vendor}
                </div>
              )}
              <ProductPriceMarkup />
              <ProductReviewMarkup />
            </div>
            {/* Product Options */}
            <div className="my-8">
              <ProductOptions />
              <Product.Metafield namespace="my_fields" keyName="size_chart">
                {({value}) => {
                  return value ? (
                    <a
                      href="#size-chart"
                      className="block underline text-gray-700 text-sm font-medium mb-10"
                    >
                      Size Chart
                    </a>
                  ) : null;
                }}
              </Product.Metafield>
              <AddToCartMarkup />
              <div className="flex items space-x-4">
                <Product.Metafield namespace="my_fields" keyName="sustainable">
                  {({value}) => {
                    return value ? (
                      <span className="flex items-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current text-blue-600 mr-3"
                        >
                          <path
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.7071-.7071M6.34315 6.34315l-.70711-.70711m12.72796.00005-.7071.70711M6.3432 17.6569l-.70711.7071M16 12c0 2.2091-1.7909 4-4 4-2.20914 0-4-1.7909-4-4 0-2.20914 1.79086-4 4-4 2.2091 0 4 1.79086 4 4Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-gray-900 font-medium">
                          Sustainable Material
                        </span>
                      </span>
                    ) : null;
                  }}
                </Product.Metafield>
                <Product.Metafield namespace="my_fields" keyName="sustainable">
                  {({value}) => {
                    return value ? (
                      <span className="flex items-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current text-blue-600 mr-3"
                        >
                          <path
                            d="M9 12L11 14L15 10M20.6179 5.98434C20.4132 5.99472 20.2072 5.99997 20 5.99997C16.9265 5.99997 14.123 4.84453 11.9999 2.94434C9.87691 4.84446 7.07339 5.99985 4 5.99985C3.79277 5.99985 3.58678 5.9946 3.38213 5.98422C3.1327 6.94783 3 7.95842 3 9.00001C3 14.5915 6.82432 19.2898 12 20.622C17.1757 19.2898 21 14.5915 21 9.00001C21 7.95847 20.8673 6.94791 20.6179 5.98434Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-gray-900 font-medium">
                          Lifetime Warranty
                        </span>
                      </span>
                    ) : null;
                  }}
                </Product.Metafield>
              </div>
            </div>
            {/* Product Description */}
            <Product.Description className="prose border-t-2 border-gray-900 text-black" />
            <Product.Metafield namespace="my_fields" keyName="size_chart">
              {({value}) => {
                return value ? (
                  <div className="border-t-2 border-black">
                    <SizeChart />
                  </div>
                ) : null;
              }}
            </Product.Metafield>
          </div>
        </div>
      </Product>
    </>
  );
}
