import {useShopQuery} from '@shopify/hydrogen';
import {Button2} from './Button2.client';

export function SuspendedServer() {
  const {data} = useShopQuery({query: `query { shop { name } }`});

  return (
    <div className="suspended-server">
      <p>Shop: {data.shop.name}</p>
      <Button2>This DOES cause a Hydration error</Button2>
    </div>
  );
}
