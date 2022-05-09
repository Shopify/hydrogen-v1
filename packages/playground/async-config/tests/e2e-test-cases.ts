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

    expect(await page.textContent('h1')).toContain('ES Home');
    expect(await page.textContent('#locale')).toContain('ES-ES');
  });

  it('fetches redirects before handling request', async () => {
    await page.goto(getServerUrl() + '/en/productos');
    expect(await page.url()).toContain('/en/products');

    await page.goto(getServerUrl() + '/es/products');
    expect(await page.url()).toContain('/es/productos');
  });
}
