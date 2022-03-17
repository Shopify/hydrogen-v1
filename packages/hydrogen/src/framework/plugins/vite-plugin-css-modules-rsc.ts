import {type Plugin} from 'vite';

export default function cssModulesRsc() {
  // 1. Original CSS module: `.myStyle { color: red; }`
  // 2. CSS module after 'pre' Vite transforms: `.myStyle_hashedXYZ { color: red; }`
  // 3. CSS module after 'post' Vite transforms: `export const myStyle = 'myStyle_hashedXYZ';`

  let cssMap = new Map();

  return [
    {
      name: 'css-modules-rsc',
      configResolved() {
        cssMap = new Map();
      },
      transform(code, id) {
        if (/\.module\.(s?css|sass|less)/.test(id)) {
          cssMap.set(id, code);
        }
      },
    },
    {
      name: 'css-modules-rsc-post',
      enforce: 'post',
      transform(code, id) {
        if (id.includes('.module.') && cssMap.has(id)) {
          return code.replace(
            /export default .*$/gms,
            `import React from 'react'; export const StyleTag = () => React.createElement('style', {}, \`${cssMap.get(
              id
            )}\`);`
          );
        }
      },
    },
  ] as Plugin[];
}
