import {
  Link,
  SelectedVariantImage,
  SelectedVariantPrice,
  ProductProvider,
  useProduct,
  ProductTitle,
} from '@shopify/hydrogen/client';

import ProductVariantImageSelector from './ProductVariantImageSelector.client';

export default function ProductCardAdvanced({product}) {
  return (
    <ProductProvider
      product={product}
      initialVariantId={product.variants.edges[0].node.id}
    >
      <ProductCard />
    </ProductProvider>
  );
}

function ProductCard() {
  const {handle, vendor, variants, selectedVariant} = useProduct();

  return (
    <div className="text-lg mb-4 relative">
      <Link to={`/products/${handle}`}>
        <div className="border-2 border-black mb-2 relative flex items-center justify-center overflow-hidden object-cover aspect-w-1 aspect-h-1">
          <SelectedVariantImage className="bg-white absolute w-full h-full transition-all duration-500 ease-in-out transform bg-center bg-cover object-center object-contain hover:scale-110" />
        </div>
        {!selectedVariant.availableForSale && (
          <div className="absolute top-0 left-0 text-xs bg-black text-white p-3">
            Out of stock
          </div>
        )}
        <ProductTitle as="span" className="text-black font-medium" />
        {vendor && (
          <p className="text-gray-900 text-sm font-medium">{vendor}</p>
        )}

        <div className="flex text-gray-500">
          <SelectedVariantPrice priceType="compareAt">
            {({amount, currencyNarrowSymbol}) => (
              <span className="line-through mr-2.5">
                {currencyNarrowSymbol}
                {amount}
              </span>
            )}
          </SelectedVariantPrice>
          <SelectedVariantPrice
            className={
              selectedVariant.compareAtPriceV2 ? 'text-black' : 'text-gray-500'
            }
          >
            {({amount, currencyNarrowSymbol, currencyCode}) => (
              <>
                {currencyCode}
                {currencyNarrowSymbol}
                {amount}
              </>
            )}
          </SelectedVariantPrice>
        </div>
      </Link>
      {variants.length > 1 && <ProductVariantImageSelector />}
      {!selectedVariant.availableForSale && (
        <p className="text-xs mt-2">Avaliable in 2-3 weeks</p>
      )}
    </div>
  );
}
