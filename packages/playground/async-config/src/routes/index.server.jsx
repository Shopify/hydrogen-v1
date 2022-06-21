import {Link, useShop} from '@shopify/hydrogen';

export default function Index() {
  const {defaultLanguageCode, defaultCountryCode} = useShop();
  return (
    <>
      <h1>Home</h1>
      <div id="locale">{`${defaultLanguageCode}-${defaultCountryCode}`}</div>
      <Link to="/es" id="link">
        Go to ES
      </Link>
    </>
  );
}
