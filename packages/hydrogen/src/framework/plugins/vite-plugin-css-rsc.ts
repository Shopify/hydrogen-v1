import path from 'path';
import MagicString from 'magic-string';
import {
  normalizePath,
  type HtmlTagDescriptor,
  type Plugin,
  type ResolvedConfig,
  type ViteDevServer,
} from 'vite';

const VITE_CSS_CHUNK_NAME = 'style.css';
const INJECT_STYLES_COMMENT = '<!--__INJECT_STYLES__-->';

const CSS_EXTENSIONS_RE = /\.(css|sass|scss|stylus|less)(\.|\?|$)/;
const CSS_MODULES_EXTENSIONS_RE = /\.module\.(css|sass|scss|stylus|less)(\?|$)/;

const EVENT_CSS_IMPORT = 'hydrogen-css-modules-update-imports';
const EVENT_CSS_CLASSES = 'hydrogen-css-modules-update-classes';
const CSS_MODULES_HMR_INJECT = `
import {createHotContext, injectQuery} from "/@vite/client";

if (!import.meta.hot) {
  import.meta.hot = createHotContext("/index.html");
}

import.meta.hot.on('${EVENT_CSS_IMPORT}', ({ids, timestamp}) => {
  ids.forEach((id) => {
    import(injectQuery(id, 't=' + timestamp));
  });
});

import.meta.hot.on('${EVENT_CSS_CLASSES}', ({replacements}) => {
  replacements.forEach(([oldClass, newClass]) => {
    document.querySelectorAll('.' + oldClass).forEach(node => {
      node.classList.replace(oldClass, newClass);
    })
  });
});
`;

// Keep this in the outer scope to share it
// across client <> server builds.
let clientBuildPath: string;

/* -- Plugin notes:
 * This plugin collects all the CSS imported in both client and server components and
 * extracts it in a single stylesheet that is added to the <head>. It does this by:
 * 1. Removing all the CSS generated during the client build. The client build CSS is a sub-set of the
 * server build CSS because it can only find CSS imported in client components. This avoids duplicates.
 * 2. Force Vite to collect CSS in every file during the server build, and emit it as a chunk.
 * 3. Move the generated CSS chunk in the server build to the client build output as an asset, and link to it in `index.html`.
 */

export default function cssRsc() {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let isUsingCssModules = false;
  const hmrCssCopy = new Map<string, string>();
  const hmrCssQueue = new Set<string>();

  return {
    name: 'hydrogen:css-rsc',
    enforce: 'post',
    config() {
      // Disable CSS code split to avoid preloading styles
      // that are already included in index.html
      return {build: {cssCodeSplit: false}};
    },
    configResolved(_config) {
      config = _config;
    },
    configureServer(_server) {
      server = _server;
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

      // Manual HMR for CSS Modules
      if (server && CSS_MODULES_EXTENSIONS_RE.test(id)) {
        isUsingCssModules = true;
        const file = id.split('?')[0];

        // Note: this "CSS" file is actually JavaScript code.
        // Get a copy of how this CSS was before the current update
        const oldCode = hmrCssCopy.get(file);
        // Save a copy of the current CSS for future updates
        hmrCssCopy.set(file, code);

        if (!oldCode || !hmrCssQueue.has(file)) return;
        hmrCssQueue.delete(file);

        // Diff old code with new code and use the exported class names as a reference
        // to find out how the resulting CSS classes are renamed.  With this, we can
        // update classes in the DOM without requesting a full rendering from the server.
        // Example:
        // Previous code => export const red = ".red_k3tz4_module";
        // New code      => export const red = ".red_t93kw_module";
        const classRE = /export const (.+?) = "(.+?)"/g;
        const oldClasses = [...oldCode.matchAll(classRE)];
        const replacements = [] as Array<[string, string]>;

        for (const [, newKey, newClass] of code.matchAll(classRE)) {
          const oldClass = oldClasses.find(
            ([, oldKey]) => oldKey === newKey
          )?.[2];

          if (oldClass && oldClass !== newClass) {
            replacements.push([oldClass, newClass]);
          }
        }

        if (replacements.length > 0) {
          // This event asks the browser to replace old
          // hash-based CSS classes with new ones.
          // Example: from `.red_k3tz4_module` to `.red_t93kw_module`
          server.ws.send({
            type: 'custom',
            event: EVENT_CSS_CLASSES,
            data: {replacements},
          });
        }
      }
    },
    transformIndexHtml(html, {server}) {
      // Add discovered styles during dev
      if (server) {
        const tags = (
          isUsingCssModules
            ? [
                {
                  tag: 'script',
                  attrs: {type: 'module'},
                  children: CSS_MODULES_HMR_INJECT,
                },
              ]
            : []
        ) as HtmlTagDescriptor[];

        const foundCssFiles = new Set<string>();

        for (const [key, value] of server.moduleGraph.idToModuleMap.entries()) {
          if (
            // Note: Some CSS-in-JS libraries use `.css.js`
            // extension and we should match it here:
            CSS_EXTENSIONS_RE.test(normalizePath(key).split('/').pop()!)
          ) {
            let {url, file, lastHMRTimestamp, importers} = value;

            if (
              !foundCssFiles.has(file!) &&
              !Array.from(importers).some((importer) =>
                foundCssFiles.has(importer.file!)
              )
            ) {
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
      type OutputChunk = Extract<typeof bundle[0], {type: 'chunk'}>;
      type OutputAsset = Extract<typeof bundle[0], {type: 'asset'}>;

      if (config.build?.ssr) {
        // -- Server build

        if (!clientBuildPath) {
          // Default value
          clientBuildPath = normalizePath(
            path.resolve(config.root, config.build.outDir, '..', 'client')
          );
        }

        const relativeClientPath = normalizePath(
          path.relative(
            normalizePath(path.resolve(config.root, config.build.outDir)),
            clientBuildPath
          )
        );

        let cssAssetFileName = '';
        const cssAsset = Object.values(bundle).find(
          (file) => file.type === 'asset' && file.name === VITE_CSS_CHUNK_NAME
        ) as OutputAsset | undefined;
        const outputChunk = Object.values(bundle).find(
          (file) => file.type === 'chunk' && file.isEntry
        ) as OutputChunk;

        if (cssAsset) {
          cssAssetFileName = cssAsset.fileName;
          // Move the CSS file to the client build assets
          cssAsset.fileName = normalizePath(
            path.join(relativeClientPath, cssAsset.fileName)
          );
        }

        let assetPrefix = process.env.HYDROGEN_ASSET_BASE_URL || '/';
        if (!assetPrefix.endsWith('/')) assetPrefix += '/';

        // Add a reference to the CSS file in indexTemplate
        outputChunk.code = outputChunk.code.replace(
          INJECT_STYLES_COMMENT,
          cssAssetFileName &&
            `<link rel="stylesheet" href="${assetPrefix + cssAssetFileName}">`
        );
      } else {
        // -- Client build

        // Save outDir from client build in the outer scope
        // to read it during the server build. The CLI runs Vite in
        // the same process so the scope is shared across builds.
        clientBuildPath = normalizePath(
          path.resolve(config.root, config.build.outDir)
        );

        const indexHtml = bundle['index.html'] as OutputAsset;
        const cssAsset = Object.values(bundle).find(
          (file) => file.type === 'asset' && file.name === VITE_CSS_CHUNK_NAME
        ) as OutputAsset | undefined;

        if (cssAsset) {
          // The client build CSS is incomplete because it only includes
          // CSS imported in client components (server components are not
          // discovered in this build). Remove it from this build and
          // let it be added by the server build after this.
          delete bundle[cssAsset.fileName];
          indexHtml.source = (indexHtml.source as string).replace(
            new RegExp(
              `\\s*<link[^<>]+${cssAsset.fileName.replace('.', '\\.')}.*?>`,
              ''
            ),
            ''
          );
        }
      }
    },
    async handleHotUpdate({modules, server}) {
      if (modules.every((m) => CSS_MODULES_EXTENSIONS_RE.test(m.file || ''))) {
        // Opt-out of Vite's default HMR for CSS Modules, we'll handle this manually

        const file = modules[0].file!;
        hmrCssQueue.add(file);

        // This event asks the browser to download fresh CSS files.
        // Fetching these fresh CSS files will trigger another event
        // from the `transform` hook to replace classes in the DOM.
        server.ws.send({
          type: 'custom',
          event: EVENT_CSS_IMPORT,
          data: {
            ids: modules.map((m) => m.id!),
            timestamp: modules[0].lastHMRTimestamp || Date.now(),
          },
        });

        return [];
      }
    },
  } as Plugin;
}
