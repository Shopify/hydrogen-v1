import fetch from 'node-fetch';
import type {Page} from 'playwright';
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
  let page: Page;
  beforeEach(async () => {
    page && (await page.close());
    page = await browser.newPage();
  });

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

      expect(await page.locator('#hydrogen-dev-tools').isHidden()).toBeFalsy();
    });
  }

  describe('<Script />', () => {
    /*
      general tests
    */
    it('Fake CDN serves test scripts', async () => {
      await page.goto(
        getServerUrl() + '/scripts/cdn?script=after-hydration-script.js',
        {
          waitUntil: 'networkidle',
        }
      );
      const script = await page.content();
      expect(script).toContain(
        `const target = document.querySelector('section.after-hydration');`
      );
    });

    /*
      beforeHydration loading strategy
    */
    it('<Script load="beforeHydration" dangerouslySetInnerHTML... />', async () => {
      await page.goto(getServerUrl() + '/scripts/script/before-hydration', {
        waitUntil: 'networkidle',
      });

      // const content = await page.content();
      // console.log({content});
      const script = await page.$(
        'script#beforeHydration-dangerouslySetInnerHTML'
      );
      // console.log({script});
      expect(script).toBeTruthy();
    });

    it('<Script load="beforeHydration" children... />', async () => {
      await page.goto(getServerUrl() + '/scripts/script/before-hydration', {
        waitUntil: 'networkidle',
      });

      const script = await page.$('script#beforeHydration-children');
      expect(script).toBeTruthy();
    });

    it('<Script load="beforeHydration" src />', async () => {
      page.on('dialog', async (dialog) => {
        expect(true).toBe(true);
        await dialog.dismiss();
      });

      await page.goto(getServerUrl() + '/scripts/script/before-hydration', {
        waitUntil: 'networkidle',
      });

      await page.close({runBeforeUnload: true});
    });

    /*
      afterHydration loading strategy
    */
    it('<Script load="afterHydration" dangerouslySetInnerHTML... />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🌊 Inline <Script afterHydration dangerouslySetInnerHTML/>'
      );
    });

    it('<Script load="afterHydration" children />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🌊 Inline <Script afterHydration children/>'
      );
    });

    it('<Script load="afterHydration" src />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🌊 <Script afterHydration src /> loaded, injecting code..'
      );
    });

    it('<Script load="afterHydration" src onLoad onReady />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain('[log] 📞 🌕 onLoad event Event');
      expect(logs).toContain('[log] 📞 🟢 onReady event Event');
    });

    it('<Script load="afterHydration" src onError />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[error] Failed to load resource: the server responded with a status of 400 (Bad Request)'
      );
    });

    // afterHydration loading strategy reload on navigation
    it('<Script load="afterHydration" children reload /> on first load', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🌊 Inline reload code inside <Script children/> works'
      );
    });

    it('<Script load="afterHydration" src reload /> on first load', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      await sleep(2000);
      expect(logs).toContain(
        '[log] 🌊 <Script afterHydration src reload /> loaded, injecting code..'
      );
    });

    it('<Script load="afterHydration" src /> does not reload on navigation', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });

      await sleep(2000);
      expect(logs).toContain(
        '[log] 🌊 <Script afterHydration src /> loaded, injecting code..'
      );

      await Promise.all([
        page.click('a#next-page'),
        page.waitForNavigation({waitUntil: 'networkidle'}),
      ]);
      await sleep(2000);
      expect(
        logs.filter(
          (log) =>
            log ===
            '[log] 🌊 <Script afterHydration src /> loaded, injecting code..'
        ).length
      ).toEqual(1);
    });

    it('<Script load="afterHydration" children reload /> on navigation', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🌊 Inline reload code inside <Script children/> works'
      );

      await Promise.all([
        page.click('a#next-page'),
        page.waitForNavigation({waitUntil: 'networkidle'}),
      ]);
      await sleep(2000);
      expect(
        logs.filter(
          (log) =>
            log ===
            '[log] 🌊 Inline reload code inside <Script children/> works'
        ).length
      ).toEqual(2);
    });

    it('<Script load="afterHydration" src reload /> on navigation', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/after-hydration', {
        waitUntil: 'networkidle',
      });

      await sleep(2000);
      expect(logs).toContain(
        '[log] 🌊 <Script afterHydration src reload /> loaded, injecting code..'
      );

      await Promise.all([
        page.click('a#next-page'),
        page.waitForNavigation({waitUntil: 'networkidle'}),
      ]);
      await sleep(2000);
      expect(
        logs.filter(
          (log) =>
            log ===
            '[log] 🌊 <Script afterHydration src reload /> loaded, injecting code..'
        ).length
      ).toEqual(2);
    });

    /*
      inWorker loading strategy
    */
    it('<Script load="inWorker" /> partytown worker available', async () => {
      await page.goto(getServerUrl() + '/scripts/script/in-worker', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      const workers = await page.workers();
      expect(workers.length).toBeTruthy();
    });

    it('<Script load="inWorker" src />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/in-worker', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      expect(logs).toContain('[log] 🎉🎉🎉 Hello from a Web Worker! 🎉🎉🎉');
    });

    it('<Script load="inWorker" src /> forwards functions', async () => {
      await page.goto(getServerUrl() + '/scripts/script/in-worker', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      // @ts-ignore
      const dataLayer = await page.evaluate(() => window.dataLayer);
      expect(dataLayer.length).toEqual(3);
    });

    /*
      onIdle loading strategy
    */
    it('<Script load="onIdle" dangerouslySetInnerHTML />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🏖 Inline <Script onIdle dangerouslySetInnerHTML/>'
      );
    });

    it('<Script load="onIdle" children />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain('[log] 🏖 Inline <Script onIdle children/>');
    });

    it('<Script load="onIdle" children reload /> on first load', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🏖🔂 Inline <Script onIdle reload children/> works'
      );
    });

    it('<Script load="onIdle" children reload /> on navigation', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });

      expect(logs).toContain(
        '[log] 🏖🔂 Inline <Script onIdle reload children/> works'
      );

      await Promise.all([
        page.click('a#next-page'),
        page.waitForNavigation({waitUntil: 'networkidle'}),
      ]);
      await sleep(1000);
      expect(
        logs.filter(
          (log) =>
            log === '[log] 🏖🔂 Inline <Script onIdle reload children/> works'
        ).length
      ).toEqual(2);
    });

    it('<Script load="onIdle" src />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      expect(logs).toContain(
        '[log] 🏖 <Script onIdle src /> loaded, injecting html..'
      );
    });

    it('<Script load="onIdle" src onLoad onReady />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      const callbackLogs = logs.filter(
        (log) =>
          log.includes('📞 🌕 onLoad event') ||
          log.includes('📞 🟢 onReady event')
      );
      expect(callbackLogs.length).toEqual(2);
    });

    it('<Script load="onIdle" src onError />', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      const callbackLogs = logs.filter((log) =>
        log.includes('📞 🔴 onError event')
      );
      expect(callbackLogs.length).toEqual(1);
    });

    it('<Script load="onIdle" src reload /> on first load', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      expect(logs).toContain(
        '[log] 🏖🔂 <Script onIdle reload src />loaded, injecting html..'
      );
    });

    it('<Script load="onIdle" src reload /> on navigation', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });

      await sleep(2000);
      expect(logs).toContain(
        '[log] 🏖🔂 <Script onIdle reload src />loaded, injecting html..'
      );

      await Promise.all([
        page.click('a#next-page'),
        page.waitForNavigation({waitUntil: 'networkidle'}),
      ]);
      await sleep(2000);
      expect(
        logs.filter(
          (log) =>
            log ===
            '[log] 🏖🔂 <Script onIdle reload src />loaded, injecting html..'
        ).length
      ).toEqual(2);
    });
  });

  describe('useScript', () => {
    it('useScript load="afterHydration" src on first load', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/use-script', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      expect(logs).toContain(
        '[log] 💦 Loaded use-load-script-after-hydration.js via useLoadScript'
      );
    });

    it('useScript load="afterHydration" src reload on navigation', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/use-script', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      expect(logs).toContain(
        '[log] 💦🔂 Loaded use-load-script-after-hydration-reload.js via useLoadScript'
      );
      await Promise.all([
        page.click('a#next-page'),
        page.waitForNavigation({waitUntil: 'networkidle'}),
      ]);
      await sleep(2000);
      expect(
        logs.filter(
          (log) =>
            log ===
            '[log] 💦🔂 Loaded use-load-script-after-hydration-reload.js via useLoadScript'
        ).length
      ).toEqual(2);
    });

    it('useScript load="onIdle" src on first load', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });
      await sleep(1000);
      expect(logs).toContain(
        '[log] 🏖🔂 Loaded use-load-script-on-idle-reload.js via useLoadScript'
      );
    });

    it('useScript load="onIdle" src reload /> on navigation', async () => {
      const logs = getLogs(page);
      await page.goto(getServerUrl() + '/scripts/script/on-idle', {
        waitUntil: 'networkidle',
      });

      await sleep(1000);
      expect(logs).toContain(
        '[log] 🏖🔂 Loaded use-load-script-on-idle-reload.js via useLoadScript'
      );

      await Promise.all([
        page.click('a#next-page'),
        page.waitForNavigation({waitUntil: 'networkidle'}),
      ]);
      await sleep(1000);
      expect(
        logs.filter(
          (log) =>
            log ===
            '[log] 🏖🔂 Loaded use-load-script-on-idle-reload.js via useLoadScript'
        ).length
      ).toEqual(2);
    });
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getLogs(page) {
  const logs: string[] = [];
  page.on('console', (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Uncaught (in promise) TypeError + friends are page errors.
  page.on('pageerror', (error) => {
    logs.push(`[${error.name}] ${error.message}`);
  });

  return logs;
}
