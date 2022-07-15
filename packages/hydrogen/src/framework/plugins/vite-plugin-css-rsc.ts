import MagicString from 'magic-string';
import {normalizePath, HtmlTagDescriptor, Plugin, ResolvedConfig} from 'vite';

const INJECT_STYLES_COMMENT = '<!--__INJECT_STYLES__-->';

export default function cssRsc() {
  let config: ResolvedConfig;

  return {
    name: 'hydrogen:css-rsc',
    enforce: 'pre',
    buildStart() {
      if (config?.build?.ssr) process.env.RSC_BUILD = 'true';
    },
    buildEnd() {
      if (config?.build?.ssr) delete process.env.RSC_BUILD;
    },
    config(config) {
      // Disable CSS code split during client build to avoid
      // preloading styles (which are already inlined in index.html).
      return {build: {cssCodeSplit: !!config.build?.ssr}};
    },
    configResolved(_config) {
      config = _config;
    },
    transform(code, id, options) {
      if (options?.ssr && id.includes('index.html?raw')) {
        // Mark the client build index.html to inject styles later
        const s = new MagicString(code);
        s.replace('</head>', INJECT_STYLES_COMMENT + '</head>');

        return {
          code: s.toString(),
          map: s.generateMap({file: id, source: id}),
        };
      }
    },
    transformIndexHtml(html, {server}) {
      // Add discovered styles during dev
      if (server) {
        const tags = [] as HtmlTagDescriptor[];

        const foundCssFiles = new Set<string>();
        const {browserHash = ''} =
          (server as any)._optimizedDeps?.metadata || {};

        for (const [key, value] of server.moduleGraph.idToModuleMap.entries()) {
          if (normalizePath(key).split('/').pop()!.includes('.css')) {
            let {url, file, lastHMRTimestamp} = value;

            if (!foundCssFiles.has(file!)) {
              foundCssFiles.add(file!);

              // Vite is adding hash and timestamp to the CSS files downloaded
              // from client components. Adding the same query string params
              // here prevents this file from being downloaded twice.
              if (lastHMRTimestamp) {
                const timestampQuery = `?t=${lastHMRTimestamp}`;
                // The timestamp needs to be the first query string param.
                url = url.includes('?')
                  ? url.replace('?', timestampQuery + '&')
                  : url + timestampQuery;
              }

              if (browserHash && !url.includes('v=')) {
                // Append the hash at the end.
                url += (url.includes('?') ? '&' : '?') + `v=${browserHash}`;
              }

              tags.push(
                value.type === 'css'
                  ? {tag: 'link', attrs: {rel: 'stylesheet', href: url}}
                  : {tag: 'script', attrs: {type: 'module', src: url}}
              );
            }
          }
        }

        return tags;
      }
    },
    generateBundle(options, bundle, isWrite) {
      // Inline collected styles during build
      if (config.build?.ssr) {
        const outputChunk = Object.values(bundle).find((file) => {
          return file.type === 'chunk' && file.isEntry;
        }) as Extract<typeof bundle[0], {type: 'chunk'}>;

        // Find all the CSS files imported by the output chunk
        let css = '';
        const importedCss = Array.from(
          (outputChunk as any).viteMetadata?.importedCss || []
        ) as string[];

        for (const cssKey of importedCss) {
          const asset = bundle[cssKey];
          if (asset && asset.type === 'asset') {
            css += asset.source + ' ';
          }
        }

        // Inline styles in the bundled index.html template
        outputChunk.code = outputChunk.code.replace(
          INJECT_STYLES_COMMENT,
          css
            ? `<style>${css
                .replace(/\s+/gm, ' ')
                .replace(/'/g, "\\'")
                .replace(/"/g, '\\"')
                .trim()}</style>`
            : ''
        );
      }
    },
  } as Plugin;
}
