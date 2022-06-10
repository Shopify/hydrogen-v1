import React, {MouseEvent, ReactNode, Ref} from 'react';
import {useCallback} from 'react';

interface Props {
  /** Any ReactNode elements. */
  children: ReactNode;
  /** A click event handler. Default behaviour triggers unless prevented */
  onClick?: (event?: MouseEvent) => void | boolean;
  /** A default onClick behaviour */
  defaultOnClick?: Function;
  /** A ref to the underlying button */
  buttonRef?: Ref<HTMLButtonElement>;
  /** Any ReactNode elements. */
}

export type BaseButtonProps = JSX.IntrinsicElements['button'] & Props;

export function BaseButton({
  onClick,
  defaultOnClick,
  children,
  buttonRef,
  ...passthroughProps
}: BaseButtonProps) {
  const handleOnClick = useCallback(
    (event: MouseEvent) => {
      if (onClick) {
        const clickShouldContinue = onClick(event);
        if (clickShouldContinue === false || event?.defaultPrevented) return;
      }

      defaultOnClick?.();
    },
    [defaultOnClick, onClick]
  );

  return (
    <button {...passthroughProps} ref={buttonRef} onClick={handleOnClick}>
      {children}
    </button>
  );
}
