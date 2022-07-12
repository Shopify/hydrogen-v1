import React, {useCallback, useEffect, useState} from 'react';
import {useCart} from '../CartProvider';
import {useProductOptions} from '../../hooks/useProductOptions';
import {BaseButton, BaseButtonProps} from '../BaseButton';

interface CustomAddToCartButtonProps<AsType extends React.ElementType> {
  as?: AsType;

  /** An array of cart line attributes that belong to the item being added to the cart. */
  attributes?: {
    key: string;
    value: string;
  }[];
  /** The ID of the variant. */
  variantId?: string | null;
  /** The item quantity. */
  quantity?: number;
  /** The text that is announced by the screen reader when the item is being added to the cart. Used for accessibility purposes only and not displayed on the page. */
  accessibleAddingToCartLabel?: string;
}

type AddToCartButtonProps<AsType extends React.ElementType> =
  CustomAddToCartButtonProps<AsType> &
    Omit<
      React.ComponentPropsWithoutRef<AsType>,
      keyof CustomAddToCartButtonProps<AsType>
    > &
    Omit<BaseButtonProps<AsType>, keyof CustomAddToCartButtonProps<AsType>>;

/**
 * The `AddToCartButton` component renders a button that adds an item to the cart when pressed.
 * It must be a descendent of the `CartProvider` component.
 */
export function AddToCartButton<AsType extends React.ElementType = 'button'>(
  props: AddToCartButtonProps<AsType>
) {
  const [addingItem, setAddingItem] = useState<boolean>(false);
  const {
    variantId: explicitVariantId,
    quantity = 1,
    attributes,
    onClick,
    children,
    accessibleAddingToCartLabel,
    ...passthroughProps
  } = props;
  const {status, linesAdd} = useCart();
  const {selectedVariant} = useProductOptions();
  const variantId = explicitVariantId ?? selectedVariant?.id ?? '';
  const disabled =
    explicitVariantId === null ||
    variantId === '' ||
    selectedVariant === null ||
    addingItem ||
    passthroughProps.disabled;

  useEffect(() => {
    if (addingItem && status === 'idle') {
      setAddingItem(false);
    }
  }, [status, addingItem]);

  const handleAddItem = useCallback(() => {
    setAddingItem(true);
    linesAdd([
      {
        quantity,
        merchandiseId: variantId,
        attributes,
      },
    ]);
  }, [linesAdd, quantity, variantId, attributes]);

  return (
    <>
      <BaseButton
        disabled={disabled}
        onClick={onClick}
        defaultOnClick={handleAddItem}
        {...passthroughProps}
      >
        {children}
      </BaseButton>
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
