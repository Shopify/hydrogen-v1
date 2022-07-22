import {type HydrogenRouteProps} from '@shopify/hydrogen';
import {ProductSwimlane} from '~/components/index.server';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export default function ProductRecommendationRoute({id}: HydrogenRouteProps) {
  return <ProductSwimlane title="Related Products" data={id} />;
}
