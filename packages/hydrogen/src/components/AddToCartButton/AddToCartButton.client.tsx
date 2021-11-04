import React, {ReactNode, useEffect, useState} from 'react';
import {
  useCartLinesAddCallback,
  useCart,
  useCartCreateCallback,
} from '../CartProvider';
import {Props} from '../types';

export interface AddToCartButtonProps {
  /** An array of cart line attributes that belong to the item being added to the cart. */
  attributes?: {
    key: string;
    value: string;
  }[];
  /** The ID of the variant. */
  variantID: string;
  /** The item quantity. */
  quantity?: number;
  /** Any ReactNode elements. */
  children: ReactNode;
  /** The text that is announced by the screen reader when the item is being added to the cart. Used for accessibility purposes only and not displayed on the page. */
  accessibleAddingToCartLabel?: string;
}

type PropsWeControl = 'onClick';

/**
 * The `AddToCartButton` component renders a button that adds an item to the cart when pressed.
 * It must be a descendent of the `CartProvider` component.
 */
export function AddToCartButton<TTag extends React.ElementType = 'button'>(
  props: Props<TTag, PropsWeControl> & AddToCartButtonProps
) {
  const [addingItem, setAddingItem] = useState<boolean>(false);
  const {
    variantID,
    quantity = 1,
    attributes,
    children,
    onAdd,
    accessibleAddingToCartLabel,
    ...passthroughProps
  } = props;
  const {status, id} = useCart();
  const createCart = useCartCreateCallback();
  const addLines = useCartLinesAddCallback();

  useEffect(() => {
    if (addingItem && status === 'idle') {
      setAddingItem(false);
    }
  }, [status, addingItem]);

  return (
    <>
      <button
        {...passthroughProps}
        disabled={addingItem || passthroughProps.disabled}
        onClick={() => {
          setAddingItem(true);
          if (!id) {
            createCart({
              lines: [
                {
                  quantity: quantity,
                  merchandiseId: variantID,
                  attributes: attributes,
                },
              ],
            });
          } else {
            addLines([
              {
                quantity: quantity,
                merchandiseId: variantID,
                attributes: attributes,
              },
            ]);
          }
        }}
      >
        {children}
      </button>
      {accessibleAddingToCartLabel ? (
        <p
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: '0',
          }}
          role="alert"
          aria-live="assertive"
        >
          {addingItem ? accessibleAddingToCartLabel : null}
        </p>
      ) : null}
    </>
  );
}
