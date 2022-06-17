import React, { ReactNode, Ref } from 'react';
interface Props {
    /** Any ReactNode elements. */
    children: ReactNode;
    /** Click event handler. Default behaviour triggers unless prevented */
    onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | boolean;
    /** A default onClick behaviour */
    defaultOnClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | boolean;
    /** A ref to the underlying button */
    buttonRef?: Ref<HTMLButtonElement>;
}
export declare type BaseButtonProps = Omit<JSX.IntrinsicElements['button'], 'onClick' | 'children'> & Props;
export declare function BaseButton({ onClick, defaultOnClick, children, buttonRef, ...passthroughProps }: BaseButtonProps): JSX.Element;
export {};
