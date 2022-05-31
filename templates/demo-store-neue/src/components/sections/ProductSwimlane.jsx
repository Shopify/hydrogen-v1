import Section from './Section';
import {ProductCard} from '~/components/blocks';

const mockProducts = new Array(12).fill('');

export default function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  ...passthroughProps
}) {
  return (
    <Section heading={title} padding="y" {...passthroughProps}>
      <div className="grid grid-flow-col gap-6 px-4 pb-4 overflow-x-scroll md:pb-8 snap-x scroll-px-4 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
        {products.map((product, i) => {
          return (
            <ProductCard
              product={product}
              key={i}
              className={'snap-start w-80'}
            />
          );
        })}
      </div>
    </Section>
  );
}
