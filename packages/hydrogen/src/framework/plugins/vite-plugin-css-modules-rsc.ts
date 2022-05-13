import type {Plugin, ResolvedConfig} from 'vite';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware';
import MagicString from 'magic-string';
import path from 'path';

const cssModuleRE = /\.module\.(s?css|sass|less|stylus)/;

export default function cssModulesRsc() {
  // 1. Original CSS module: `.myStyle { color: red; }`
  // 2. CSS module after 'pre' Vite transforms: `.myStyle_hashedXYZ { color: red; }`
  // 3. CSS module after 'post' Vite transforms: `export const myStyle = 'myStyle_hashedXYZ';`

  let cssMap = new Map();
  let config: ResolvedConfig;

  return [
    {
      name: 'css-modules-rsc',
      configResolved(_config) {
        config = _config;
        cssMap = new Map();

        // Place this plugin before react-refresh to
        // modify files before JSX is compiled.
        // @ts-ignore
        config.plugins.unshift(autoStyleTagPlugin(config));
      },
      transform(code, id) {
        if (cssModuleRE.test(id)) {
          cssMap.set(id, code);
        }
      },
    },
    {
      name: 'css-modules-rsc-post',
      enforce: 'post',
      transform(code, id) {
        if (id.includes('.module.') && cssMap.has(id)) {
          const key = path.relative(config.root, id.split('?')[0]);

          return (
            `import React from 'react';` +
            `export const StyleTag = (props) => React.createElement('style', {...props, 'data-module': '${key}', dangerouslySetInnerHTML: {__html: ${JSON.stringify(
              cssMap.get(id)
            )}}});` +
            `\nStyleTag.key = '${key}';\n` +
            code.replace(/export default \{/gs, `export default {\n  StyleTag,`)
          );
        }
      },
    },
  ] as Plugin[];
}

function autoStyleTagPlugin(config: ResolvedConfig) {
  return {
    name: 'css-modules-auto-style-tag',
    transform(code, id, options) {
      id = id.split('?')[0];

      if (
        /\.[jt]sx$/.test(id) &&
        !id.endsWith(HYDROGEN_DEFAULT_SERVER_ENTRY) &&
        !id.endsWith(
          path.format({
            name: HYDROGEN_DEFAULT_SERVER_ENTRY,
            ext: path.extname(id),
          })
        ) &&
        cssModuleRE.test(code) &&
        code.includes('export default') &&
        !code.includes('__ApplyStyleTags')
      ) {
        const s = new MagicString(code);

        // 1. Gather style tags in an array
        let styleCount = 0;
        s.prepend(`const __styleTags = [];\n`);
        s.replace(
          /^import\s+(.+?)\s+from\s+['"]([^'"]+?\.module\.[^'"]+?)['"]/gm,
          (all, statements, from) => {
            if (!cssModuleRE.test(from)) {
              return all;
            }

            if (statements.startsWith('{')) {
              // Add default import
              const replacement = `__style${styleCount++}, {`;
              statements = statements.replace('{', replacement);
              all = all.replace('{', replacement);
            }

            const defaultImport = statements
              .split(',')[0]
              .replace(/\*\s+as\s+/, '')
              .trim();

            return all + `; __styleTags.push(${defaultImport}.StyleTag)`;
          }
        );

        // 2. Wrap default export in a new component that includes the style tags
        s.replace(/export default/gm, 'const __defaultExport = ');
        s.append(
          generateDefaultExport(
            path.relative(config.root, id),
            Boolean(options?.ssr)
          )
        );

        return {
          code: s.toString(),
          map: s.generateMap({file: id, source: id}),
        };
      }
    },
  } as Plugin;
}

function generateDefaultExport(rendererId: string, isServer: boolean) {
  let code = '';

  if (isServer) {
    code += `\nimport {useEnvContext} from '@shopify/hydrogen/dist/esnext/foundation/ssr-interop';\n`;
  }

  code += `\nconst __ApplyStyleTags = function (props) {\n`;
  code += `  const renderer = '${rendererId}';\n  let styleTags = [];`;

  if (isServer) {
    // In the server, do not render style tags that have already been registered in the current request.
    code += `  const cssModules = useEnvContext((req) => req.ctx.cssModules);\n`;
    code += `  styleTags = __styleTags.filter(ST => !cssModules.includes(ST.key));\n`;
    // Register the new style tags that are rendered in this component.
    code += `  cssModules.push(...styleTags.map(ST => ST.key));\n`;
  } else {
    // In the client, only render the style tags if they don't exist in the DOM yet, or if they do
    // but the renderer is the current component (hydrating an SSRed style tag).
    code += `  const cssModules = Array.from(document.querySelectorAll('style[data-module]')).reduce((acc, el) => { acc[el.dataset.module] = el.dataset.renderer; return acc; }, {});\n`;
    code += `  styleTags = __styleTags.filter(ST => !cssModules[ST.key] || cssModules[ST.key] === renderer);\n`;
  }

  // Return a fragment with all the style tags and the original component
  code +=
    `  return <>{styleTags.map(ST => <ST key={ST.key} data-renderer={renderer} />)}<__defaultExport {...props} /></>;` +
    `\n}\n`;

  // Append original component name to the new export for debugging
  code += `Object.defineProperty(__ApplyStyleTags, 'name', {value: 'ApplyStyleTags_' + (__defaultExport.name || '')});\n`;

  code += `export default __ApplyStyleTags;`;

  return code;
}
