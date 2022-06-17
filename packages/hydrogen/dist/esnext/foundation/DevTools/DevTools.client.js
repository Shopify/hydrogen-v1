import React, { useState, useEffect, useCallback } from 'react';
import { Interface, Panels } from './components';
export function DevTools({ dataFromServer }) {
    const [open, setOpen] = useState(false);
    const toggleOpen = useCallback(() => {
        setOpen((state) => !state);
    }, []);
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (hasMounted) {
        return (React.createElement(Interface, { open: open, onClose: toggleOpen, onOpen: toggleOpen },
            React.createElement(Panels, { ...dataFromServer })));
    }
    return null;
}
