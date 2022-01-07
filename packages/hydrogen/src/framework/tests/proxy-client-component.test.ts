import {proxyClientComponent} from '../server-components';

it('wraps default exports for dev', async () => {
  expect(
    await proxyClientComponent({
      id: '/path/to/Counter.client.jsx',
      src: `export default function() {}`,
    })
  ).toBe(`import {wrapInClientMarker} from '@shopify/hydrogen/marker';
import * as allImports from '/path/to/Counter.client.jsx?no-proxy';

export default wrapInClientMarker({ name: 'Counter', id: '/path/to/Counter.client.jsx', component: allImports['default'], named: false });
`);
});

it('wraps named exports', async () => {
  expect(
    await proxyClientComponent({
      id: '/path/to/Counter.client.jsx',
      src: `export function Counter() {}\nexport const Clicker = () => {};`,
    })
  ).toBe(`import {wrapInClientMarker} from '@shopify/hydrogen/marker';
import * as allImports from '/path/to/Counter.client.jsx?no-proxy';

export const Counter = wrapInClientMarker({ name: 'Counter', id: '/path/to/Counter.client.jsx', component: allImports['Counter'], named: true });
export const Clicker = wrapInClientMarker({ name: 'Clicker', id: '/path/to/Counter.client.jsx', component: allImports['Clicker'], named: true });
`);
});

it('combines default and named exports', async () => {
  expect(
    await proxyClientComponent({
      id: '/path/to/Counter.client.jsx',
      src: `export default function() {}\nexport const Clicker = () => {};`,
    })
  ).toBe(`import {wrapInClientMarker} from '@shopify/hydrogen/marker';
import * as allImports from '/path/to/Counter.client.jsx?no-proxy';

export default wrapInClientMarker({ name: 'Counter', id: '/path/to/Counter.client.jsx', component: allImports['default'], named: false });
export const Clicker = wrapInClientMarker({ name: 'Clicker', id: '/path/to/Counter.client.jsx', component: allImports['Clicker'], named: true });
`);
});

it('does not wrap non-component exports', async () => {
  expect(
    await proxyClientComponent({
      id: '/path/to/Counter.client.jsx',
      src: `export default function() {}\nexport const MyFragment = 'fragment myFragment on MyQuery { id }';`,
    })
  ).toBe(`import {wrapInClientMarker} from '@shopify/hydrogen/marker';
import * as allImports from '/path/to/Counter.client.jsx?no-proxy';

export {MyFragment} from '/path/to/Counter.client.jsx?no-proxy';
export default wrapInClientMarker({ name: 'Counter', id: '/path/to/Counter.client.jsx', component: allImports['default'], named: false });
`);
});

it('can export non-component only', async () => {
  expect(
    await proxyClientComponent({
      id: '/path/to/Counter.client.jsx',
      src: `export const LocalizationContext = {}; export const useMyStuff = () => {}; export const MY_CONSTANT = 42;`,
    })
  ).toBe(`export * from '/path/to/Counter.client.jsx?no-proxy';\n`);
});
