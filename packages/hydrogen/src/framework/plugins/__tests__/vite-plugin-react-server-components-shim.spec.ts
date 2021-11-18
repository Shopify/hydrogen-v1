import middleware from '../vite-plugin-react-server-components-shim';
import fs from 'fs';
import path from 'path';
import {resolve} from '../resolver';

jest.mock('../resolver');

(resolve as any).mockImplementation(() => '@shopify/hydrogen');

let m: any;

beforeEach(() => {
  m = middleware();
  m.configResolved({
    root: '.',
  });
});

it('only transforms client-imports', function () {
  expect(m.transform('', '')).toBe(undefined);
});

it('transforms client-imports', function () {
  const code = fs.readFileSync(
    path.resolve(__dirname, '../../Hydration/client-imports.ts'),
    'utf8'
  );
  const result = m.transform(code, '/Hydration/client-imports');

  expect(result).toMatchSnapshot();
});

it('throws an error when non-Server components load Server components', async function () {
  await expect(m.resolveId('.server.tsx', '.client.tsx')).rejects.toThrow();

  await expect(m.resolveId('.server.jsx', '.client.jsx')).rejects.toThrow();
});

it('passes when server components import client components', async function () {
  m.resolveId('.client.tsx', '.server.tsx');
  m.resolveId('.client.jsx', '.server.jsx');
});

it('throws an error when client components load hydrogen from the server-only entrypoint', async function () {
  await expect(
    m.resolveId('@shopify/hydrogen', '.client.tsx')
  ).rejects.toThrow();

  await expect(
    m.resolveId('@shopify/hydrogen', '.client.jsx')
  ).rejects.toThrow();
});
