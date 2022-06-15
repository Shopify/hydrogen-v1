import React, {ReactNode, Ref} from 'react';
import {useCallback} from 'react';

interface Props {
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
}

export type BaseButtonProps = Omit<
  JSX.IntrinsicElements['button'],
  'onClick' | 'children'
> &
  Props;

export function BaseButton({
  onClick,
  defaultOnClick,
  children,
  buttonRef,
  ...passthroughProps
}: BaseButtonProps) {
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

  return (
    <button {...passthroughProps} ref={buttonRef} onClick={handleOnClick}>
      {children}
    </button>
  );
}
