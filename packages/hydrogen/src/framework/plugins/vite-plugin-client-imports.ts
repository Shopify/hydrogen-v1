import type {Plugin} from 'vite';

/* -- Plugin notes:
 * This plugin allows to import always from '@shopify/hydrogen' path, instead of
 * using '@shopify/hydrogen/client' in browser files. It does this by redirecting
 * the server path to the browser path if the importer file is a client component.
 */

export default function clientImports(): Plugin {
  return {
    name: 'hydrogen:client-imports',

    enforce: 'pre',

    /**
     * When importer does not end in `server.jsx`, and source is `@shopify/hydrogen`,
     * replace with `@shopify/hydrogen/client`. This prevents other server-only imports
     * from "leaking" into the client bundle.
     */
    async resolveId(source, importer, {ssr}) {
      if (ssr) return;
      if (/\.server\.(j|t)sx?/.test(importer ?? '')) return;
      if ('@shopify/hydrogen' !== source) return;

      const resolution = await this.resolve(
        '@shopify/hydrogen/client',
        importer,
        {skipSelf: true}
      );

      if (resolution) {
        return resolution.id;
      }
    },
  };
}
