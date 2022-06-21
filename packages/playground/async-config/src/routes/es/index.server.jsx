import {useShop} from '@shopify/hydrogen';

export default function Index() {
  const {defaultLanguageCode, defaultCountryCode} = useShop();
  return (
    <>
      <h1>ES Home</h1>
      <div id="locale">{`${defaultLanguageCode}-${defaultCountryCode}`}</div>
    </>
  );
}
