import type {Plugin} from 'vite';

export default function clientImports(): Plugin {
  return {
    name: 'hydrogen:client-imports',

    enforce: 'pre',

    // When importer ends in `client.jsx`, and source is `@shopify/hydrogen`, replace with `@shopify/hydrogen/client`.
    // This prevents other server-only imports from "leaking" into the client bundle.
    async resolveId(source, importer, {ssr}) {
      if (ssr) return;
      if (!/\.client\.(j|t)sx?/.test(importer ?? '')) return;
      if ('@shopify/hydrogen' !== source) return;

      const resolution = await this.resolve(
        '@shopify/hydrogen/client',
        importer,
        {
          skipSelf: true,
        }
      );

      if (resolution) {
        return resolution.id;
      }
    },
  };
}
