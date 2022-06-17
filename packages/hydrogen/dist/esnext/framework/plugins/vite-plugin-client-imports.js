export default function clientImports() {
    return {
        name: 'hydrogen:client-imports',
        enforce: 'pre',
        /**
         * When importer does not end in `server.jsx`, and source is `@shopify/hydrogen`,
         * replace with `@shopify/hydrogen/client`. This prevents other server-only imports
         * from "leaking" into the client bundle.
         */
        async resolveId(source, importer, { ssr }) {
            if (ssr)
                return;
            if (/\.server\.(j|t)sx?/.test(importer ?? ''))
                return;
            if ('@shopify/hydrogen' !== source)
                return;
            const resolution = await this.resolve('@shopify/hydrogen/client', importer, {
                skipSelf: true,
            });
            if (resolution) {
                return resolution.id;
            }
        },
    };
}
