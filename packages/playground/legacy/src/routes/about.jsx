import {Link, useRouteData} from '@shopify/hydrogen';

export async function data({queryShop}) {
  return await queryShop({query: `query ShopName { shop { name } }`});
}

export default function About() {
  const {data} = useRouteData();

  return (
    <div>
      <h1>About {data.shop.name}</h1>
      <Link to="/">Home</Link>
    </div>
  );
}
