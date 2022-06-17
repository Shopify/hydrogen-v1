import React, { createContext, useMemo, useCallback, 
// @ts-ignore
useTransition, useState, } from 'react';
const PRIVATE_PROPS = ['request', 'response'];
export const ServerPropsContext = createContext(null);
export function ServerPropsProvider({ initialServerProps, setServerPropsForRsc, children, }) {
    const [locationServerProps, setLocationServerProps] = useState(initialServerProps);
    const [serverProps, setServerProps] = useState({});
    const [pending, startTransition] = useTransition();
    const setServerPropsCallback = useCallback((input, propValue) => {
        startTransition(() => {
            setServerProps((prev) => getNewValue(prev, input, propValue));
            setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
        });
    }, [setServerProps, setServerPropsForRsc]);
    const setLocationServerPropsCallback = useCallback((input, propValue) => {
        // Flush the existing user server state when location changes, leaving only the persisted state
        startTransition(() => {
            setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
            setServerProps({});
            setLocationServerProps((prev) => getNewValue(prev, input, propValue));
        });
    }, [setServerProps, setServerPropsForRsc, setLocationServerProps]);
    const getProposedLocationServerPropsCallback = useCallback((input, propValue) => {
        return getNewValue(locationServerProps, input, propValue);
    }, [locationServerProps]);
    function getNewValue(prev, input, propValue) {
        let newValue;
        if (typeof input === 'function') {
            newValue = input(prev);
        }
        else if (typeof input === 'string') {
            newValue = { [input]: propValue };
        }
        else {
            newValue = input;
        }
        if (__HYDROGEN_DEV__) {
            const privateProp = PRIVATE_PROPS.find((prop) => prop in newValue);
            if (privateProp) {
                console.warn(`Custom "${privateProp}" property in server state is ignored. Use a different name.`);
            }
        }
        return {
            ...prev,
            ...newValue,
        };
    }
    const value = useMemo(() => ({
        pending,
        locationServerProps,
        serverProps,
        setServerProps: setServerPropsCallback,
        setLocationServerProps: setLocationServerPropsCallback,
        getProposedLocationServerProps: getProposedLocationServerPropsCallback,
    }), [
        pending,
        locationServerProps,
        serverProps,
        setServerPropsCallback,
        setLocationServerPropsCallback,
        getProposedLocationServerPropsCallback,
    ]);
    return (React.createElement(ServerPropsContext.Provider, { value: value }, children));
}
