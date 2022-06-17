import React from 'react';
interface Props {
    open?: boolean;
    title?: string | React.ReactNode;
    onClose?: () => void;
    onOpen?: () => void;
    activator?: React.ReactElement;
    children?: React.ReactNode;
}
export declare function Interface({ children, onClose, onOpen, ...props }: Props): JSX.Element;
export {};
