import {SellingPlanGroup, Variant} from '../../hooks/useProductOptions';
import {GraphQLConnection, RawMetafield} from '../../types';
import {ProductProviderFragmentFragment} from './ProductProviderFragment';
import {ImageFragmentFragment} from '../Image/ImageFragment';
import {Collection} from '../../graphql/types/types';

export interface Product {
  compareAtPriceRange: Partial<
    ProductProviderFragmentFragment['compareAtPriceRange']
  >;
  descriptionHtml?: ProductProviderFragmentFragment['descriptionHtml'];
  handle?: ProductProviderFragmentFragment['descriptionHtml'];
  id?: ProductProviderFragmentFragment['id'];
  media?: ProductProviderFragmentFragment['media'];
  metafields?: GraphQLConnection<RawMetafield>;
  priceRange?: Partial<ProductProviderFragmentFragment['priceRange']>;
  title?: ProductProviderFragmentFragment['title'];
  variants?: GraphQLConnection<Variant>;
  sellingPlanGroups?: GraphQLConnection<SellingPlanGroup>;
  images?: GraphQLConnection<ImageFragmentFragment>;
  collections?: GraphQLConnection<Partial<Collection>>;
}
