import {useShop} from '@shopify/hydrogen';

export default function Index() {
  const {locale} = useShop();
  return (
    <>
      <h1>ES Home</h1>
      <div id="locale">{locale}</div>
    </>
  );
}
