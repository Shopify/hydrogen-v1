import React, {ReactNode} from 'react';
import {QueryClientProvider, QueryClient} from 'react-query';
import {Hydrate} from 'react-query/hydration';
import type {ReactQueryHydrationContext} from '../../foundation/ShopifyProvider/types';

export function QueryProvider({
  children,
  hydrationContext,
}: {
  children: ReactNode;
  hydrationContext?: ReactQueryHydrationContext;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {suspense: true}},
  });

  if (hydrationContext) {
    hydrationContext.queryClient = queryClient;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={hydrationContext?.dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  );
}
