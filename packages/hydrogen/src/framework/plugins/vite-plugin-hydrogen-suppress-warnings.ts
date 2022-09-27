import {Plugin} from 'vite';

/* -- Plugin notes:
 * Vite prints some warnings automatically are not important and
 * not actionable. We hide them here to prevent confusing devs when
 * real warnings or errors appear.
 */

export default () => {
  return {
    name: 'hydrogen:suppress-warnings',
    configResolved(config) {
      // TODO: Fix the actual issues that cause these warnings
      const filterOut = (msg: string) =>
        msg.startsWith(
          "@shopify/hydrogen doesn't appear to be written in CJS"
        ) ||
        (msg.includes('missing source files') &&
          ['kolorist'].some((lib) => msg.includes(lib)));

      for (const method of ['warn', 'warnOnce'] as const) {
        const original = config.logger[method];
        config.logger[method] = (msg: string, ...args) => {
          if (filterOut(msg)) return;
          return original(msg, ...args);
        };
      }
    },
  } as Plugin;
};
