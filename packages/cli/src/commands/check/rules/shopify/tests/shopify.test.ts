import {withCli} from '../../../../../testing';

it('fails when missing shopify.config.js', async () => {
  await withCli(async ({run, fs}) => {
    const result = await run('check');
    console.log(result);
    expect(result.output.stdout.join('')).toMatch(/✕ Has Shopify config/);
  });
});

it('passes when shopify.config.js exists', async () => {
  await withCli(async ({run, fs}) => {
    await fs.write(
      'shopify.config.js',
      `
        module.exports = {};
      `
    );
    const result = await run('check');
    expect(result.output.stdout.join('')).toMatch(/✓ Has Shopify config/);
  });
});

it('fails when storeDomain is not a shopify.com domain', async () => {
  await withCli(async ({run, fs}) => {
    await fs.write(
      'shopify.config.js',
      `
        module.exports = {
          storeDomain: 'NOT A DOMAIN',
        };
      `
    );
    const result = await run('check');
    expect(result.output.stdout.join('')).toMatch(/✕ Has valid storeDomain/);
  });
});

it('passes when storeDomain is a shopify.com domain', async () => {
  await withCli(async ({run, fs}) => {
    await fs.write(
      'shopify.config.js',
      `
        module.exports = {
          storeDomain: 'hydrogen.myshopify.com',
        };
      `
    );
    const result = await run('check');
    expect(result.output.stdout.join('')).toMatch(/✓ Has valid storeDomain/);
  });
});
