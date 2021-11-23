import {init, parse} from 'es-module-lexer';
import {promises as fs} from 'fs';
import {transformWithEsbuild} from 'vite';
import MagicString from 'magic-string';

export async function proxyClientComponent({
  id,
  src,
}: {
  id: string;
  src?: string;
}) {
  const defaultComponentName = id.split('/').pop()?.split('.').shift();

  // Modify the import ID to avoid infinite wraps
  const importFrom = `${id}?no-proxy`;

  await init;

  if (!src) {
    src = await fs.readFile(id, 'utf-8');
  }

  const {code} = await transformWithEsbuild(src, id);
  const [, exportStatements] = parse(code);
  const hasDefaultExport = exportStatements.includes('default');

  // Split namedImports in components to wrap and everything else (e.g. GQL Fragments)
  const namedImports = exportStatements.reduce(
    (acc, i) => {
      if (i !== 'default') {
        // Add here any other naming pattern for a non-component export
        if (/^use[A-Z]|Fragment$|Context$|^[A-Z_]+$/.test(i)) {
          acc.other.push(i);
        } else {
          acc.components.push(i);
        }
      }

      return acc;
    },
    {components: [] as string[], other: [] as string[]}
  );

  if (!hasDefaultExport && namedImports.components.length === 0) {
    return `export * from '${importFrom}';\n`;
  }

  const s = new MagicString(
    `import {wrapInClientMarker} from '@shopify/hydrogen/marker';`
  );

  s.append('\nimport ');

  if (hasDefaultExport) {
    s.append(defaultComponentName!);
    if (namedImports.components.length > 0) {
      s.append(', ');
    }
  }

  if (namedImports.components.length) {
    s.append('* as namedImports');
  }

  s.append(` from '${importFrom}';\n\n`);

  // Re-export other stuff directly without wrapping
  if (namedImports.other.length > 0) {
    s.append(
      `export {${namedImports.other.join(', ')}} from '${importFrom}';\n`
    );
  }

  if (hasDefaultExport) {
    s.append(
      generateComponentExport({
        id,
        componentName: defaultComponentName!,
        isDefault: true,
      })
    );
  }

  namedImports.components.forEach((name) =>
    s.append(
      generateComponentExport({
        id,
        componentName: name,
        isDefault: false,
      })
    )
  );

  return s.toString();
}

function generateComponentExport({
  id,
  isDefault,
  componentName,
}: {
  id: string;
  isDefault: boolean;
  componentName: string;
}) {
  const component = isDefault
    ? componentName
    : `namedImports['${componentName}']`;

  return `export ${
    isDefault ? 'default' : `const ${componentName} =`
  } wrapInClientMarker({ name: '${componentName}', id: '${id}', component: ${component}, named: ${!isDefault} });\n`;
}
