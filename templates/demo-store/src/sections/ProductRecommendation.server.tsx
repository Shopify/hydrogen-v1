import {defineSection} from '@shopify/hydrogen';
import {ProductSwimlane} from '~/components/index.server';

export const ProductRecommendation = defineSection({
  section: 'ProductRecommendation',
  component: ProductSwimlane,
  dependency: ['data'],
});
