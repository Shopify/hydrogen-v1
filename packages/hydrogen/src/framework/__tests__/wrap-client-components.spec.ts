import {wrapClientComponents} from '../server-components';

const FAKE_FILE_PATH = 'full/path/to/Counter.client.jsx';
const getManifestFile = async (id: string) => FAKE_FILE_PATH;

it('wraps default exports for dev', async () => {
  expect(
    await wrapClientComponents({
      id: '/path/to/Counter.client.jsx?fromServer',
      getManifestFile,
      root: '/path/to/',
      isBuild: false,
    })
  ).toBe(`import React from 'react';
  import {ClientMarker} from '@shopify/hydrogen/marker';
  import _Component from '/path/to/Counter.client.jsx';

  export default function _ClientComponent(props) {
    return React.createElement(ClientMarker, { name: 'Counter', id: '/path/to/Counter.client.jsx', props, component: _Component, named: false });
  }
  export * from '/path/to/Counter.client.jsx';`);
});

it('wraps default exports for build', async () => {
  expect(
    await wrapClientComponents({
      id: '/path/to/Counter.client.jsx?fromServer',
      getManifestFile,
      root: '/path/to/',
      isBuild: true,
    })
  ).toBe(`import React from 'react';
  import {ClientMarker} from '@shopify/hydrogen/marker';
  import _Component from '/path/to/Counter.client.jsx';

  export default function _ClientComponent(props) {
    return React.createElement(ClientMarker, { name: 'Counter', id: '/${FAKE_FILE_PATH}', props, component: _Component, named: false });
  }
  export * from '/path/to/Counter.client.jsx';`);
});

it('wraps single named export for dev', async () => {
  expect(
    await wrapClientComponents({
      id: '/path/to/Counter.client.jsx?fromServer=Counter',
      getManifestFile,
      root: '/path/to/',
      isBuild: false,
    })
  ).toBe(`import React from 'react';
  import {ClientMarker} from '@shopify/hydrogen/marker';
  import {Counter as _Component0} from '/path/to/Counter.client.jsx';

  export function Counter(props) {
    return React.createElement(ClientMarker, { name: 'Counter', id: '/path/to/Counter.client.jsx', props, component: _Component0, named: true });
  }`);
});

it('wraps multiple named exports for dev', async () => {
  expect(
    await wrapClientComponents({
      id: '/path/to/Counter.client.jsx?fromServer=Counter,Clicker',
      getManifestFile,
      root: '/path/to/',
      isBuild: false,
    })
  ).toBe(`import React from 'react';
  import {ClientMarker} from '@shopify/hydrogen/marker';
  import {Counter as _Component0, Clicker as _Component1} from '/path/to/Counter.client.jsx';

  export function Counter(props) {
    return React.createElement(ClientMarker, { name: 'Counter', id: '/path/to/Counter.client.jsx', props, component: _Component0, named: true });
  }

  export function Clicker(props) {
    return React.createElement(ClientMarker, { name: 'Clicker', id: '/path/to/Counter.client.jsx', props, component: _Component1, named: true });
  }`);
});

it('wraps re-named exports for dev', async () => {
  expect(
    await wrapClientComponents({
      id: '/path/to/Counter.client.jsx?fromServer=Counter:Foo',
      getManifestFile,
      root: '/path/to/',
      isBuild: false,
    })
  ).toBe(`import React from 'react';
  import {ClientMarker} from '@shopify/hydrogen/marker';
  import {Counter as _Component0} from '/path/to/Counter.client.jsx';

  export function Counter(props) {
    return React.createElement(ClientMarker, { name: 'Counter', id: '/path/to/Counter.client.jsx', props, component: _Component0, named: true });
  }`);
});
