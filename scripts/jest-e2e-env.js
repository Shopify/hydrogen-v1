// This file must be in JavaScript, not TS

const os = require('os');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line node/no-extraneous-require
const NodeEnvironment = require('jest-environment-node');
const {chromium} = require('playwright-chromium');

const DIR = path.join(os.tmpdir(), 'jest_playwright_global_setup');

module.exports = class PlaywrightEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config);
    this.testPath = context.testPath;
  }

  async setup() {
    await super.setup();
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf-8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // skip browser setup for non-playground tests
    if (!this.testPath.includes('playground')) {
      return;
    }

    const browser =
      (this.global.browser =
      this.browser =
        await chromium.connect(wsEndpoint));
    this.global.page = await browser.newPage();
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
    await super.teardown();
  }
};
