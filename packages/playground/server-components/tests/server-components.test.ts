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
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe('OK');
});

it('should return 404 on unknown method', async () => {
  const response = await page.request.patch(viteTestUrl + '/comments', {
    headers: {
      Accept: 'application/json',
    },
  });
  expect(response.status()).toBe(404);
  expect(response.statusText()).toBe('Not found');
});
