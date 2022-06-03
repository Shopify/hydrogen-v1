import React, {createContext, FC, ReactNode} from 'react';

type RouteParamsContextValue = {routeParams: Record<string, string>};

export const RouteParamsContext = createContext<RouteParamsContextValue>({
  routeParams: {},
});

export const RouteParamsProvider: FC<{
  routeParams: Record<string, string>;
  children: ReactNode;
}> = ({children, routeParams}) => {
  return (
    <RouteParamsContext.Provider value={{routeParams}}>
      {children}
    </RouteParamsContext.Provider>
  );
};
