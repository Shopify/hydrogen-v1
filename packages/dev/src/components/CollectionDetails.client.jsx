import {Collection, Product} from '@shopify/hydrogen/client';

export default function CollectionDetails({collection}) {
  return (
    <Collection collection={collection}>
      <Collection.Image />
      <Collection.Title className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 mt-6" />
      <Collection.Description className="text-2xl" />

      <Collection.Products className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Product.Title />
        <Product.SelectedVariant.Image />
        <Product.SelectedVariant.Price />
      </Collection.Products>
    </Collection>
  );
}
