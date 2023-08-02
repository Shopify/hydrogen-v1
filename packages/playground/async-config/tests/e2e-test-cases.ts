import fetch from 'node-fetch';

type TestOptions = {
  getServerUrl: () => string;
  isWorker?: boolean;
  isBuild?: boolean;
};

export default async function testCases({
  getServerUrl,
  isBuild,
  isWorker,
}: TestOptions) {
  it('shows the homepage with the correct locale', async () => {
    await page.goto(getServerUrl());

    expect(await page.textContent('h1')).toContain('Home');
    expect(await page.textContent('#locale')).toContain('EN-US');

    await page.goto(getServerUrl() + '/es/');

    expect(await page.textContent('h1')).toContain('ES Home');
    expect(await page.textContent('#locale')).toContain('ES-ES');
  });

  it('shows the homepage with the correct locale in RSC', async () => {
    await page.goto(getServerUrl());

    expect(await page.textContent('h1')).toContain('Home');
    expect(await page.textContent('#locale')).toContain('EN-US');

    await page.click('#link');
    await page.waitForURL('**/es');

    // I don't know why I need this, but I cannot get the tests to pass without adding this.
    await sleep(1000);

    expect(await page.textContent('body')).toContain('ES Home');
    expect(await page.textContent('#locale')).toContain('ES-ES');
  });

  it('fetches redirects before handling request', async () => {
    await page.goto(getServerUrl() + '/en/productos');
    expect(await page.url()).toContain('/en/products');

    await page.goto(getServerUrl() + '/es/products');
    expect(await page.url()).toContain('/es/productos');
  });

  it('does not powered-by header when disabled', async () => {
    const response = await fetch(getServerUrl() + '/');
    expect(response.headers.has('powered-by')).toBe(false);
  });

  if (!isBuild) {
    it('sends client configuration to the browser and picks it', async () => {
      await page.goto(getServerUrl());
      expect(await page.textContent('h1')).toContain('Home');
    });
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
