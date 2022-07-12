import React, {ReactNode, Ref} from 'react';
import {useCallback} from 'react';

export interface BaseButtonProps<AsType extends React.ElementType> {
  as?: AsType;
  /** Any ReactNode elements. */
  children: ReactNode;
  /** Click event handler. Default behaviour triggers unless prevented */
  onClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | boolean;
  /** A default onClick behaviour */
  defaultOnClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | boolean;
  /** A ref to the underlying button */
  buttonRef?: Ref<HTMLButtonElement>;

  disabled?: boolean;
}

export const BaseButton = <AsType extends React.ElementType = 'button'>({
  as,
  onClick,
  defaultOnClick,
  children,
  buttonRef,
  ...passthroughProps
}: BaseButtonProps<AsType>) => {
  const handleOnClick = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onClick) {
        const clickShouldContinue = onClick(event);
        if (
          (typeof clickShouldContinue === 'boolean' &&
            clickShouldContinue === false) ||
          event?.defaultPrevented
        )
          return;
      }

      defaultOnClick?.(event);
    },
    [defaultOnClick, onClick]
  );

  const Component = as || 'button';

  return React.createElement(
    Component,
    {
      ref: buttonRef,
      onClick: handleOnClick,
      ...passthroughProps,
    },
    children
  );
};
