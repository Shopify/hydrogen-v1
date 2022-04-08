import React, {createContext, FC} from 'react';

type RouteParamsContextValue = {routeParams: Record<string, string>};

export const RouteParamsContext = createContext<RouteParamsContextValue>({
  routeParams: {},
});

export const RouteParamsProvider: FC<{
  routeParams: Record<string, string>;
  children?: React.ReactNode;
}> = ({children, routeParams}) => {
  return (
    <RouteParamsContext.Provider value={{routeParams}}>
      {children}
    </RouteParamsContext.Provider>
  );
};
