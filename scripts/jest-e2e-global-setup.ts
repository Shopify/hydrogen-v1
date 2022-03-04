import {tmpdir} from 'os';
import {mkdirp, writeFile, remove} from 'fs-extra';
import {join, resolve} from 'path';
import {chromium} from 'playwright-chromium';

const DIR = join(tmpdir(), 'jest_playwright_global_setup');

export default async function () {
  const browserServer = await chromium.launchServer({
    // Change to `true` to see the chromium browser during tests
    headless: !process.env.VITE_DEBUG_SERVE,

    args: process.env.CI
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : undefined,
  });

  globalThis.__BROWSER_SERVER__ = browserServer;

  await mkdirp(DIR);
  await writeFile(join(DIR, 'wsEndpoint'), browserServer.wsEndpoint());
  await remove(resolve(__dirname, '../temp'));
}
