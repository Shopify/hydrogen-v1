import {Page} from 'playwright-chromium';
import {RollupWatcher} from 'rollup';

declare global {
  // injected by the custom jest env in scripts/jest-e2e-env.js
  const page: Page;

  // injected in scripts/jest-e2e-setup-test.ts
  const browserLogs: string[];
  const viteTestUrl: string;
  const watcher: RollupWatcher;
}
