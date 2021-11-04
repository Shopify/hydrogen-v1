import {port} from './serve';

const url = `http://localhost:${port}`;

it('shows the homepage, navigates to about, and increases the count', async () => {
  await page.goto(url + '/');

  expect(await page.textContent('body')).toContain('Home');
  await page.click('.btn');

  expect(await page.textContent('body')).toContain('About');
  expect(await page.textContent('.count')).toBe('Count is 0');

  await page.click('.increase');
  expect(await page.textContent('.count')).toBe('Count is 1');
});
