import React, {createContext, useContext, useMemo, useState} from 'react';

// @ts-ignore
globalThis.__routeDataContext ||= createContext<any>(null);
// @ts-ignore
const RouteDataContext = globalThis.__routeDataContext;

export function RouteDataProvider({value: initialValue, children}: any) {
  const [value, setRouteData] = useState(initialValue);

  const providerValue = useMemo(() => {
    return {
      value,
      setRouteData,
    };
  }, [value]);

  return (
    <RouteDataContext.Provider value={providerValue}>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__hydrogenRouteData = ${JSON.stringify(value)}`,
        }}
      ></script>
      {children}
    </RouteDataContext.Provider>
  );
}

export function useRouteData() {
  // @ts-ignore
  return useContext(RouteDataContext)?.value;
}

export function useRouteDataInternal() {
  // @ts-ignore
  return useContext(RouteDataContext);
}
