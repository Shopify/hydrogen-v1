import {ProductCard} from '~/components/blocks';
import {Heading} from '../elements';

const dummyProduct = {
  label: 'Limited Edition',
  image: 'https://picsum.photos/seed/5/672/848',
  title: 'The Mason Horse Bit Loafer, Palomino II',
  createdAt: new Date(),
  handle: 'handle',
  price: {
    amount: '345',
    symbol: '$',
  },
  compareAtPrice: {
    amount: '425',
    symbol: '$',
  },
};

const dummyProducts = new Array(12).fill(dummyProduct);

export default function ProductSwimlane({title, products = dummyProducts}) {
  return (
    <section className="grid gap-4 pt-8 pb-2 bg-stone-50 md:gap-7 lg:pt-8 xl:pt-16 xl:pb-8">
      <Heading size="lead" className="px-4 md:px-8 lg:px-12">
        {title}
      </Heading>
      <div className="grid grid-flow-col gap-6 pb-4 overflow-x-scroll md:pb-8 snap-x scroll-px-m md:scroll-px-l lg:scroll-px-xl px-m md:px-l lg:px-xl">
        {products.map((product, i) => {
          return (
            <ProductCard
              key={i}
              className={'snap-start w-80'}
              product={product}
            />
          );
        })}
      </div>
    </section>
  );
}
