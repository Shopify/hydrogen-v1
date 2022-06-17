import React from 'react';
import { useCallback } from 'react';
export function BaseButton({ onClick, defaultOnClick, children, buttonRef, ...passthroughProps }) {
    const handleOnClick = useCallback((event) => {
        if (onClick) {
            const clickShouldContinue = onClick(event);
            if ((typeof clickShouldContinue === 'boolean' &&
                clickShouldContinue === false) ||
                event?.defaultPrevented)
                return;
        }
        defaultOnClick?.(event);
    }, [defaultOnClick, onClick]);
    return (React.createElement("button", { ...passthroughProps, ref: buttonRef, onClick: handleOnClick }, children));
}
