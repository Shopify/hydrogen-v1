import {useShopQuery} from '@shopify/hydrogen';
import {Button} from './Button.client';

export function SuspendedServer() {
  const {data} = useShopQuery({query: `query { shop { name } }`});

  return (
    <div className="suspended-server">
      <p>Shop: {data.shop.name}</p>
      <Button>Click Me</Button>
    </div>
  );
}
