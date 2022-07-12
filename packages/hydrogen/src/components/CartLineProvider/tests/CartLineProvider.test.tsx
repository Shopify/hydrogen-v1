import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../CartLineProvider.client.js';
import {CART_LINE} from './fixtures.js';
import {useCartLine} from '../../../hooks/useCartLine/index.js';

it('provides a hook to access cart line data', () => {
  function Data() {
    const line = useCartLine();

    return <div>{JSON.stringify(line)}</div>;
  }

  const wrapper = mount(
    <CartLineProvider line={CART_LINE}>
      <Data />
    </CartLineProvider>
  );

  expect(wrapper.find('div')!.text()).toBe(JSON.stringify(CART_LINE));
});
