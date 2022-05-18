import {useShopQuery} from '@shopify/hydrogen';
import {Button2} from './Button2.client';

export function SuspendedServer() {
  const {data} = useShopQuery({query: `query { shop { name } }`});

  return (
    <div className="suspended-server">
      <p>Shop: {data.shop.name}</p>
      {/* Hydration error, because flight stream contains ref to client component *AFTER* suspending,
          and the browser does not have time to load it (because it also throws). */}
      <Button2>This DOES cause a Hydration error</Button2>
    </div>
  );
}
