import {withCli} from '../../../../testing';

describe.skip('page', () => {
  it('scaffolds a basic JSX page with a name', async () => {
    await withCli(async ({run, fs}) => {
      await run('create page', {
        name: 'Products',
        url: 'products',
      });

      expect(await fs.read('src/routes/products.server.jsx')).toBe(
        `export default function Products({request, response, ...serverState}) {
  return <div>Products component at \`src/routes/products.server.jsx\`</div>;
}
`
      );
    });
  });

  it('scaffolds a basic TSX page with a name when a tsconfig exists', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write('tsconfig.json', JSON.stringify({}, null, 2));
      await run('create page', {
        name: 'Collections',
        url: 'collections',
      });

      expect(await fs.read('src/routes/collections.server.tsx')).toBe(
        `export default function Collections({request, response, ...serverState}) {
  return <div>Collections component at \`src/routes/collections.server.tsx\`</div>;
}
`
      );
    });
  });

  it('supports nested and dynamic components', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write('tsconfig.json', JSON.stringify({}, null, 2));
      await run('create page', {
        name: 'ProductDetails',
        url: 'products/[handle]',
      });

      expect(await fs.read('src/routes/products/[handle].server.tsx')).toBe(
        `export default function ProductDetails({request, response, ...serverState}) {
  return (
    <div>
      ProductDetails component at \`src/routes/products/[handle].server.tsx\`
    </div>
  );
}
`
      );
    });
  });
});
