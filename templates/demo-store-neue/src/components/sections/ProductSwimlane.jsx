import Section from './Section';
import {ProductCard} from '~/components/blocks';

const mockProduct = {
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

const mockProducts = new Array(12).fill('');

export default function ProductSwimlane({title, products = mockProducts}) {
  return (
    <Section heading="Featured Products" padding="y">
      <div className="grid grid-flow-col gap-6 pb-4 overflow-x-scroll md:pb-8 snap-x scroll-px-m md:scroll-px-l lg:scroll-px-xl px-m md:px-l lg:px-xl">
        {products.map((product, i) => {
          return <ProductCard key={i} className={'snap-start w-80'} />;
        })}
      </div>
    </Section>
  );
}
