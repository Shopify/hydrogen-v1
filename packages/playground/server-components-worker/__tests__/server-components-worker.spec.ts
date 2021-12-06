import {port} from './serve';

const url = `http://localhost:${port}`;

it('shows the homepage, navigates to about, and increases the count', async () => {
  await page.goto(url + '/');

  expect(await page.textContent('h1')).toContain('Home');

  const secretsServer = await page.textContent('.secrets-server');
  expect(secretsServer).toContain('PUBLIC_VAR:42-public|');
  expect(secretsServer).toContain('PRIVATE_VAR:42-private|');
  const secretsClient = await page.textContent('.secrets-client');
  expect(secretsClient).toContain('PUBLIC_VAR:42-public|');
  expect(secretsClient).toContain('PRIVATE_VAR:|'); // Missing private var in client bundle

  await page.click('.btn');

  expect(await page.textContent('body')).toContain('About');
  expect(await page.textContent('.count')).toBe('Count is 0');

  await page.click('.increase');
  expect(await page.textContent('.count')).toBe('Count is 1');
});

it('follows synchronous redirects', async () => {
  await page.goto(url + '/redirected');
  expect(await page.url()).toContain('/about');
  expect(await page.textContent('h1')).toContain('About');
});
