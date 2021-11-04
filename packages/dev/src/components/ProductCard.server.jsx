import {Link, Image, Money} from '@shopify/hydrogen';

export default function ProductCard({product}) {
  const selectedVariant = product.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  return (
    <div className="text-lg mb-4 relative">
      <Link to={`/products/${product.handle}`}>
        {!selectedVariant?.availableForSale && (
          <div className="absolute text-xs bg-black text-white p-3 z-50">
            Out of stock
          </div>
        )}
        <div className="border-2 border-black mb-2 relative flex items-center justify-center overflow-hidden object-cover h-96">
          <Image
            className="bg-white absolute w-full h-full transition-all duration-500 ease-in-out transform bg-center bg-cover object-center object-contain hover:scale-110"
            image={selectedVariant.image}
          />
        </div>

        <span className="text-black font-medium">{product.title}</span>

        <div className="flex ">
          {selectedVariant.compareAtPriceV2 && (
            <Money money={selectedVariant.compareAtPriceV2}>
              {({amount, currencyNarrowSymbol}) => (
                <span className="line-through mr-2.5 text-gray-500">
                  {currencyNarrowSymbol}
                  {amount}
                </span>
              )}
            </Money>
          )}
          <Money className="text-black" money={selectedVariant.priceV2}>
            {({amount, currencyNarrowSymbol, currencyCode}) => (
              <>
                {currencyCode}
                {currencyNarrowSymbol}
                {amount}
              </>
            )}
          </Money>
        </div>
      </Link>
      {!selectedVariant.availableForSale && (
        <p className="text-xs mt-2">Avaliable in 2-3 weeks</p>
      )}
    </div>
  );
}
