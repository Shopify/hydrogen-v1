import {withCli} from '../../../../testing';

describe('component', () => {
  it('scaffolds a basic JSX component with a name', async () => {
    await withCli(async ({run, fs}) => {
      await run('create component', {
        name: 'Button',
      });

      expect(await fs.read('src/components/Button.client.jsx')).toBe(
        `export function Button() {
  return <div>Button component at \`src/components/Button.client.jsx\`</div>;
}
`
      );
    });
  });

  it('scaffolds a basic TSX component with a name when a tsconfig exists', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write('tsconfig.json', JSON.stringify({}, null, 2));
      await run('create component', {
        name: 'ProductCard',
      });

      expect(await fs.read('src/components/ProductCard.client.tsx')).toBe(
        `export function ProductCard() {
  return (
    <div>ProductCard component at \`src/components/ProductCard.client.tsx\`</div>
  );
}
`
      );
    });
  });

  it('uses the components directory from the hydrogen config', async () => {
    const componentsDirectory = 'foo/bar/baz';
    await withCli(async ({run, fs}) => {
      await fs.write(
        '.hydrogenrc.json',
        JSON.stringify({componentsDirectory}, null, 2)
      );
      await run('create component', {
        name: 'ProductCard',
      });

      expect(
        await fs.read(`${componentsDirectory}/ProductCard.client.jsx`)
      ).toBe(
        `export function ProductCard() {
  return (
    <div>ProductCard component at \`${componentsDirectory}/ProductCard.client.jsx\`</div>
  );
}
`
      );
    });
  });
});
