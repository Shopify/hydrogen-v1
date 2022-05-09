import {Link, useShop} from '@shopify/hydrogen';

export default function Index() {
  const {locale} = useShop();
  return (
    <>
      <h1>Home</h1>
      <div id="locale">{locale}</div>
      <Link to="/es" id="link">
        Go to ES
      </Link>
    </>
  );
}
