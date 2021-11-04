import {Image, useProduct, Link} from '@shopify/hydrogen/client';

export default function ProductVariantImageSelector() {
  const {variants, setSelectedVariant, selectedVariant, handle} = useProduct();
  const uniqueVariants = findUniqueImages(variants);

  return (
    uniqueVariants.length > 1 && (
      <ul className="grid grid-cols-4 gap-2 mt-2">
        {uniqueVariants.map((variant) => {
          return (
            <div key={variant.id}>
              <label
                className="block aspect-w-1 aspect-h-1 object-cover cursor-pointer"
                htmlFor={variant.id}
              >
                <Image
                  image={variant.image}
                  className={`bg-white w-full h-full object-center object-contain border-2
                  ${
                    variant.id === selectedVariant.id
                      ? 'border-black'
                      : 'border-transparent'
                  }`}
                />
                <input
                  type="radio"
                  className="sr-only"
                  id={variant.id}
                  value={variant.title}
                  name={variant.id}
                  checked={variant.id === selectedVariant.id}
                  onChange={() => {
                    setSelectedVariant(variant);
                  }}
                />
              </label>
            </div>
          );
        })}
        <li className="flex place-items-center text-sm text-gray-900">
          <Link to={`/products/${handle}`}>
            {`+ ${variants.length - uniqueVariants.length}`}
          </Link>
        </li>
      </ul>
    )
  );
}

/*
  This filters any variants with a unique image for the thumbnail.
  By default, variants without images will fall back to the default product image.
  They are excluded in the thumbnails by comparing their URLs.
*/
function findUniqueImages(variants) {
  const uniqueVariants = variants.reduce((acc, variant) => {
    const image = variant.image.url;

    if (acc.length >= 3) {
      return acc;
    } else if (acc.find((element) => element.image.url === image)) {
      return acc;
    } else {
      return [...acc, variant];
    }
  }, []);

  return uniqueVariants;
}
