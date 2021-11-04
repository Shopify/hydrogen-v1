import {tagClientComponents} from '../server-components';

it('tags default exports for local client components', () => {
  const input = `import Counter from './Counter.client.jsx';
  import Clicker from './Clicker.jsx';`;

  const output = `import Counter from './Counter.client.jsx?fromServer';
  import Clicker from './Clicker.jsx';`;

  expect(tagClientComponents(input)).toEqual({
    code: output,
    map: {mappings: ''},
  });
});

it('tags named exports for local client components', () => {
  const input = `import {Counter} from './Counter.client.jsx';
  import Clicker from './Clicker.jsx';`;

  const output = `import {Counter} from './Counter.client.jsx?fromServer=Counter';
  import Clicker from './Clicker.jsx';`;

  expect(tagClientComponents(input)).toEqual({
    code: output,
    map: {mappings: ''},
  });
});

it('tags named exports for third-party components', () => {
  const input = `import {Counter} from '@shopify/hydrogen/client';
  import Clicker from './Clicker.jsx';`;

  const output = `import {Counter} from '@shopify/hydrogen/client?fromServer=Counter';
  import Clicker from './Clicker.jsx';`;

  expect(tagClientComponents(input, ['@shopify/hydrogen/client'])).toEqual({
    code: output,
    map: {mappings: ''},
  });
});

it('tags multiple named exports for third-party components', () => {
  const input = `import {Counter, Bar} from '@shopify/hydrogen/client';
  import Clicker from './Clicker.jsx';`;

  const output = `import {Counter, Bar} from '@shopify/hydrogen/client?fromServer=Counter,Bar';
  import Clicker from './Clicker.jsx';`;

  expect(tagClientComponents(input, ['@shopify/hydrogen/client'])).toEqual({
    code: output,
    map: {mappings: ''},
  });
});

it('tags re-named named exports for third-party components', () => {
  const input = `import {Counter as Foo} from '@shopify/hydrogen/client';
  import Clicker from './Clicker.jsx';`;

  const output = `import {Counter as Foo} from '@shopify/hydrogen/client?fromServer=Counter:Foo';
  import Clicker from './Clicker.jsx';`;

  expect(tagClientComponents(input, ['@shopify/hydrogen/client'])).toEqual({
    code: output,
    map: {mappings: ''},
  });
});

it('tags both local and third-party components', () => {
  const input = `import Layout from './components/Layout.client';
  import {Counter} from '@shopify/hydrogen/client';`;

  const output = `import Layout from './components/Layout.client?fromServer';
  import {Counter} from '@shopify/hydrogen/client?fromServer=Counter';`;

  expect(tagClientComponents(input, ['@shopify/hydrogen/client'])).toEqual({
    code: output,
    map: {mappings: ''},
  });
});

it('trims spaces from import names', () => {
  const input = `import { Counter } from '@shopify/hydrogen/client';`;

  const output = `import { Counter } from '@shopify/hydrogen/client?fromServer=Counter';`;

  expect(tagClientComponents(input, ['@shopify/hydrogen/client'])).toEqual({
    code: output,
    map: {mappings: ''},
  });
});
