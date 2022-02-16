import testCases from './e2e-test-cases';
import {resolve} from 'path';
import {edit, untilUpdated} from '../../utilities';

describe('Node.js development', () => {
  // @ts-ignore
  const getServerUrl = () => globalThis.viteTestUrl;

  it('updates the contents when a client component file changes', async () => {
    const fullPath = resolve(
      __dirname,
      '../',
      'src/components/Counter.client.jsx'
    );
    const newButtonText = 'add';

    await page.goto(getServerUrl() + '/about');
    await untilUpdated(() => page.textContent('button'), 'increase');
    await edit(
      fullPath,
      (code) => code.replace('increase count', newButtonText),
      async () =>
        await untilUpdated(() => page.textContent('button'), newButtonText)
    );
  });

  it('updates the contents when a server component file changes', async () => {
    const fullPath = resolve(__dirname, '../', 'src/pages/index.server.jsx');
    const newheading = 'Snow Devil';

    await page.goto(getServerUrl());

    // Assert that we have the default heading (h1)
    await untilUpdated(() => page.textContent('h1'), 'Home');

    // Edit the heading (h1) in the JSX code
    // Assert the page updated with the new heading
    await edit(
      fullPath,
      (code) => code.replace('<h1>Home', `<h1>${newheading}`),
      async () => await untilUpdated(() => page.textContent('h1'), newheading)
    );
  });

  testCases({
    getServerUrl,
    isWorker: false,
    isBuild: false,
  });
});
