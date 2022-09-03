import type {Plugin} from 'vite';

/* -- Plugin notes:
 * This plugin makes sure we don't leak server logic to the browser when importing
 * the `useEnvContext` utility.
 */

export default () => {
  return {
    name: 'hydrogen:ssr-interop',
    enforce: 'pre',
    transform(code, id, options = {}) {
      if (options.ssr && id.includes('foundation/ssr-interop')) {
        return {
          code: code
            .replace(/(\s*META_ENV_SSR\s*=\s*)false/, '$1import.meta.env.SSR')
            .replace(/\/\/@SSR\s*/g, ''),
          map: {mappings: ''},
        };
      }
    },
  } as Plugin;
};
