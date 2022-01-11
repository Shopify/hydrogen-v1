import {Product, flattenConnection, useProduct} from '@shopify/hydrogen/client';

import ProductOptions from './ProductOptions.client';
import Gallery from './Gallery.client';
import Seo from './Seo.client';
import {
  BUTTON_PRIMARY_CLASSES,
  BUTTON_SECONDARY_CLASSES,
} from './Button.client';

/**
 * A client component that displays detailed information about a product to allow buyers to make informed decisions
 */
function ProductPriceMarkup() {
  return (
    <div className="flex md:flex-col items-end font-semibold text-lg md:items-start md:mb-4">
      <Product.SelectedVariant.Price
        priceType="compareAt"
        className="text-gray-500 line-through text-lg mr-2.5"
      >
        {({amount, currencyNarrowSymbol}) => `${currencyNarrowSymbol}${amount}`}
      </Product.SelectedVariant.Price>
      <Product.SelectedVariant.Price className="text-gray-900">
        {({currencyCode, amount, currencyNarrowSymbol}) =>
          `${currencyCode} ${currencyNarrowSymbol}${amount}`
        }
      </Product.SelectedVariant.Price>
      <Product.SelectedVariant.UnitPrice className="text-gray-500">
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
    <div className="space-y-2 mb-8">
      <Product.SelectedVariant.AddToCartButton
        className={BUTTON_PRIMARY_CLASSES}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Out of stock' : 'Add to bag'}
      </Product.SelectedVariant.AddToCartButton>
      {isOutOfStock ? (
        <p className="text-black text-center">Available in 2-3 weeks</p>
      ) : (
        <Product.SelectedVariant.BuyNowButton
          className={BUTTON_SECONDARY_CLASSES}
        >
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
        Size Chart
      </h3>
      <table className="min-w-full table-fixed text-sm text-center bg-white">
        <thead>
          <tr className="bg-black text-white">
            <th className="w-1/4 py-2 px-4 font-normal">Board Size</th>
            <th className="w-1/4 py-2 px-4 font-normal">154</th>
            <th className="w-1/4 py-2 px-4 font-normal">158</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border border-black">Weight Range</td>
            <td className="p-3 border border-black">120-180 lbs. /54-82kg</td>
            <td className="p-3 border border-black">150-200 lbs. /68-91 kg</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Waist Width</td>
            <td className="p-3 border border-black">246mm</td>
            <td className="p-3 border border-black">255mm</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Stance Width</td>
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
              className="text-4xl font-bold text-black mb-4"
            />
            {product.vendor && (
              <div className="text-sm font-medium mb-2 text-gray-900">
                {product.vendor}
              </div>
            )}
            <span />
            <div className="flex justify-between md:block">
              <ProductPriceMarkup />
            </div>
          </div>

          <Gallery />

          <div>
            <div className="hidden md:block">
              <Product.Title
                as="h1"
                className="text-5xl font-bold text-black mb-4"
              />
              {product.vendor && (
                <div className="text-sm font-medium mb-2 text-gray-900">
                  {product.vendor}
                </div>
              )}
              <ProductPriceMarkup />
            </div>
            {/* Product Options */}
            <div className="mt-8">
              <ProductOptions />
              <Product.Metafield namespace="my_fields" keyName="size_chart">
                {({value}) => {
                  return value ? (
                    <a
                      href="#size-chart"
                      className="block underline text-gray-500 text-sm tracking-wide my-4"
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
                      <span className="flex items-center mb-8">
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
                <Product.Metafield
                  namespace="my_fields"
                  keyName="lifetime_warranty"
                >
                  {({value}) => {
                    return value ? (
                      <span className="flex items-center mb-8">
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
            <Product.Description className="prose border-t border-gray-200 pt-6 text-black text-md" />
            <Product.Metafield namespace="my_fields" keyName="size_chart">
              {({value}) => {
                return value ? (
                  <div className="border-t border-gray-200">
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
