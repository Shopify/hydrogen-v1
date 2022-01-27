it('shows the homepage, navigates to about, and increases the count', async () => {
  expect(await page.textContent('h1')).toContain('Home');
  expect(await page.textContent('.secrets')).toContain('PRIVATE_VARIABLE:42');
  await page.click('.btn');

  expect(await page.textContent('body')).toContain('About');
  expect(await page.textContent('.count')).toBe('Count is 0');

  await page.click('.increase');
  expect(await page.textContent('.count')).toBe('Count is 1');
});

it('follows synchronous redirects', async () => {
  await page.goto(viteTestUrl + '/redirected');
  expect(await page.url()).toContain('/about');
  expect(await page.textContent('h1')).toContain('About');
});

it('should support API route on a serve component for POST methods', async () => {
  const response = await page.request.post(viteTestUrl + '/', {
    headers: {
      Accept: 'text/plain',
    },
  });
  const text = await response.text();

  expect(response.status()).toBe(200);
  expect(text).toEqual('some api response');
});

it('should support API route on a serve component for PUT methods', async () => {
  const response = await page.request.put(viteTestUrl + '/', {
    headers: {
      Accept: 'text/plain',
    },
  });
  const text = await response.text();

  expect(response.status()).toBe(200);
  expect(text).toEqual('some api response');
});

it('should support API route on a serve component for PATCH methods', async () => {
  const response = await page.request.patch(viteTestUrl + '/', {
    headers: {
      Accept: 'text/plain',
    },
  });
  const text = await response.text();

  expect(response.status()).toBe(200);
  expect(text).toEqual('some api response');
});

it('should support API route on a serve component for DELETE methods', async () => {
  const response = await page.request.delete(viteTestUrl + '/', {
    headers: {
      Accept: 'text/plain',
    },
  });
  const text = await response.text();

  expect(response.status()).toBe(200);
  expect(text).toEqual('some api response');
});

it('should support API route on a serve component for HEAD methods', async () => {
  const response = await page.request.head(viteTestUrl + '/', {
    headers: {
      Accept: 'text/plain',
    },
  });
  const text = await response.text();

  expect(response.status()).toBe(200);
});

it('should GET data from an API route', async () => {
  const response = await page.request.get(viteTestUrl + '/comments', {
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toEqual([{id: 0, value: 'some comment'}]);
});

it('should GET by a route parameter', async () => {
  const response = await page.request.get(viteTestUrl + '/comments/0', {
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toEqual({id: 0, value: 'some comment'});
});

it('should POST data to an API route', async () => {
  const response = await page.request.post(viteTestUrl + '/comments', {
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
  const response = await page.request.delete(viteTestUrl + '/comments', {
    headers: {
      Accept: 'application/json',
    },
  });
  expect(response.status()).toBe(204);
  expect(response.statusText()).toBe('No Content');
});

it('should return 404 on unknown method', async () => {
  const response = await page.request.patch(viteTestUrl + '/comments', {
    data: JSON.stringify({}),
    headers: {
      Accept: 'application/json',
    },
  });

  const text = await response.text();

  expect(response.status()).toBe(405);
  expect(response.statusText()).toBe('Method Not Allowed');
  expect(text).toBe('Comment method not found');
});

it('should support simple strings returned from API routes', async () => {
  const response = await page.request.get(viteTestUrl + '/string');
  const text = await response.text();

  expect(response.status()).toBe(200);
  expect(text).toBe('some string');
});

it('should support objects as json returned from API routes', async () => {
  const response = await page.request.get(viteTestUrl + '/json');
  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toEqual({some: 'json'});
});

it.skip('supports form request on API routes', async () => {
  await page.goto(viteTestUrl + '/form');
  await page.type('#fname', 'sometext');
  await page.click('#fsubmit');
  expect(await page.textContent('*')).toContain('fname=sometext');
});

it('should return 400 status Bad Request', async () => {
  const response = await page.request.get(viteTestUrl + '/status/');

  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe('OK');
});

it('should return 400 status Bad Request', async () => {
  const response = await page.request.get(viteTestUrl + '/status/400');

  expect(response.status()).toBe(400);
  expect(response.statusText()).toBe('Bad Request');
});

it('should return 401 status Unauthorized', async () => {
  const response = await page.request.get(viteTestUrl + '/status/401');

  expect(response.status()).toBe(401);
  expect(response.statusText()).toBe('Unauthorized');
});

it('should return 403 status Forbidden', async () => {
  const response = await page.request.get(viteTestUrl + '/status/403');

  expect(response.status()).toBe(403);
  expect(response.statusText()).toBe('Forbidden');
});

it('should return 404 status Not Found', async () => {
  const response = await page.request.get(viteTestUrl + '/status/404');

  expect(response.status()).toBe(404);
  expect(response.statusText()).toBe('Not Found');
});


it('should return 418 status Teapot', async () => {
  const response = await page.request.get(viteTestUrl + '/status/418');

  expect(response.status()).toBe(418);
  expect(response.statusText()).toBe('I\'m a Teapot');
});