import {port} from './serve';

const url = `http://localhost:${port}`;

it('shows the homepage, navigates to about, and increases the count', async () => {
  await page.goto(url + '/');

  expect(await page.textContent('h1')).toContain('Home');

  const secretsServer = await page.textContent('.secrets-server');
  expect(secretsServer).toContain('PUBLIC_VARIABLE:42-public|');
  expect(secretsServer).toContain('PRIVATE_VARIABLE:42-private|');
  const secretsClient = await page.textContent('.secrets-client');
  expect(secretsClient).toContain('PUBLIC_VARIABLE:42-public|');
  expect(secretsClient).toContain('PRIVATE_VARIABLE:|'); // Missing private var in client bundle

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

it('should GET data from an API route', async () => {
  const response = await page.request.get(url + '/comments', {
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toEqual([{id: 0, value: 'some comment'}]);
});

it('should GET by a route parameter', async () => {
  const response = await page.request.get(url + '/comments/0', {
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toEqual({id: 0, value: 'some comment'});
});

it('should POST data to an API route', async () => {
  const response = await page.request.post(url + '/comments', {
    data: JSON.stringify({
      value: 'new comment',
    }),
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toEqual({id: 1, value: 'new comment'});
});

it('should DELETE an API route', async () => {
  const response = await page.request.delete(url + '/comments', {
    headers: {
      Accept: 'application/json',
    },
  });
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe('OK');
});

it('should return 404 on unknown method', async () => {
  const response = await page.request.patch(url + '/comments', {
    data: JSON.stringify({}),
    headers: {
      Accept: 'application/json',
    },
  });

  const text = await response.text();

  expect(response.status()).toBe(404);
  expect(response.statusText()).toBe('Not Found');
  expect(text).toBe('Comment method not found');
});
