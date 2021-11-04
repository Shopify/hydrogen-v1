export async function wrapClientComponents({
  id,
  getManifestFile,
  root,
  isBuild,
}: {
  id: string;
  getManifestFile: (manifestId: string) => Promise<string>;
  root: string;
  isBuild: boolean;
}) {
  const normalizedId = id.slice(0, id.indexOf('?fromServer'));
  const manifestId = normalizedId.replace(root, '');
  const name = id.split('/').pop()!.split('.').shift();

  /**
   * ?fromServer can designate named exports as a comma-separated list.
   * ?fromServer=Foo,Bar
   *
   * Re-named exports are also supported:
   * ?fromServer=Foo:Baz,Bar
   */
  const names = id.includes('?fromServer=')
    ? id
        .slice(id.indexOf('?fromServer=') + '?fromServer='.length)
        .split(',')
        .map((name) => name.split(':').shift())
    : [];

  /**
   * Determine the id of the chunk to be imported. If we're building
   * the production bundle, we need to reference the chunk generated
   * during the client manifest. Otherwise, we can pass the normalizedId
   * and Vite's dev server will load it as expected.
   */
  const importId = isBuild
    ? '/' + (await getManifestFile(manifestId))
    : normalizedId;

  const isNamedExport = names.length > 0;

  let code = `import React from 'react';
  import {ClientMarker} from '@shopify/hydrogen/marker';`;

  if (!isNamedExport) {
    code += `
  import _Component from '${normalizedId}';

  export default function _ClientComponent(props) {
    return React.createElement(ClientMarker, { name: '${name}', id: '${importId}', props, component: _Component, named: false });
  }
  export * from '${normalizedId}';`;
  } else {
    code += `
  import {${names
    .map((name, idx) => name + ' as ' + `_Component${idx}`)
    .join(', ')}} from '${normalizedId}';`;

    names.forEach((name, idx) => {
      code += `\n
  export function ${name}(props) {
    return React.createElement(ClientMarker, { name: '${name}', id: '${importId}', props, component: _Component${idx}, named: true });
  }`;
    });
  }

  return code;
}

export function tagClientComponents(
  src: string,
  additionalReferences: Array<string | RegExp> = []
) {
  const modulePatterns = [/[\w\/\.]+\.client(?:\.(?:j|t)sx?)?/]
    // @ts-ignore
    .concat(additionalReferences)
    .map((pattern) => (pattern instanceof RegExp ? pattern.source : pattern));

  const fromModulePattern = modulePatterns.join('|');

  /**
   * Default exports
   * @see https://rubular.com/r/XZjsrolet5twvB
   */
  let regex = new RegExp(
    `import\\s*\\w*\\s*from\\s*(?:'|")(?:(${fromModulePattern}))`,
    'g'
  );
  let code = src.replace(regex, (mod) => mod + '?fromServer');

  /**
   * Named exports
   * @see https://rubular.com/r/6qdREcs4T9Nw1e
   */
  regex = new RegExp(
    `import\\s*{([\\w\\s,]+)}\\s*from\\s*(?:'|")(?:(${fromModulePattern}))`,
    'g'
  );
  code = code.replace(
    regex,
    (mod, imports) =>
      `${mod}?fromServer=${imports.replace(/ as /g, ':').replace(/ /g, '')}`
  );

  return {code, map: {mappings: ''}};
}
