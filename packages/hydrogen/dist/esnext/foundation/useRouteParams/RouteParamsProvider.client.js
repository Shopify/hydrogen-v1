import React, { createContext } from 'react';
export const RouteParamsContext = createContext({
    routeParams: {},
});
export const RouteParamsProvider = ({ children, routeParams }) => {
    return (React.createElement(RouteParamsContext.Provider, { value: { routeParams } }, children));
};
