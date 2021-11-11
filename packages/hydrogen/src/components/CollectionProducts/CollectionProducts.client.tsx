import React, {ElementType, ReactNode, Fragment, cloneElement} from 'react';
import {useCollection} from '../../hooks';
import {ProductProvider} from '../ProductProvider';
import {Props} from '../types';

export interface CollectionProductsProps {
  /** A `ReactNode` element. Valid values: `ul` or `undefined`. If `ul`, then each child will
   * be wrapped with a `li` element.
   */
  as?: 'ul';
  /** A `ReactNode` element or a function that takes a product as an argument and returns a `ReactNode`. */
  children: ReactNode | ((line: Cart['lines'][1]) => ReactNode);
}

/**
 * The `CollectionProducts` component iterates over each product in a collecton and renders its `children` within
 * a `ProductProvider` for each product. It also provides render props in the case where `children` is a function.
 */
export function CollectionProducts<TTag extends ElementType>(
  props: Props<TTag> & CollectionProductsProps
) {
  const collection = useCollection();

  if (collection == null) {
    throw new Error(
      'Expected a CollectionProvider context, but none was found'
    );
  }

  const {as, children, ...passthroughProps} = props;

  const Wrapper = as ? as : 'ul';
  const ChildWrapper = Wrapper === 'ul' ? 'li' : Fragment;

  return (
    <Wrapper {...passthroughProps}>
      {(collection.products ?? []).map((product) => {
        return (
          <ChildWrapper key={product.id}>
            <ProductProvider
              product={product}
              initialVariantId={product.variants.edges[0].node.id}
            >
              {typeof children === 'function'
                ? cloneElement(children(product))
                : children}
            </ProductProvider>
          </ChildWrapper>
        );
      })}
    </Wrapper>
  );
}
