import {init, parse} from 'es-module-lexer';
import {promises as fs} from 'fs';
import {transformWithEsbuild} from 'vite';
import MagicString from 'magic-string';

const DEFAULT_EXPORT = 'default';

export async function proxyClientComponent({
  id,
  src,
}: {
  id: string;
  src?: string;
}) {
  // Modify the import ID to avoid infinite wraps
  const importFrom = `${id}?no-proxy`;

  await init;

  if (!src) {
    src = await fs.readFile(id, 'utf-8');
  }

  const {code} = await transformWithEsbuild(src, id);
  const [, exportStatements] = parse(code);

  // Classify exports in components to wrap vs. everything else (e.g. GQL Fragments)
  const otherExports = [] as string[];
  const componentExports = [] as string[];
  for (const key of exportStatements) {
    if (
      key !== DEFAULT_EXPORT &&
      /^use[A-Z]|Fragment$|Context$|^[A-Z_]+$/.test(key)
    ) {
      otherExports.push(key);
    } else {
      componentExports.push(key);
    }
  }

  if (componentExports.length === 0) {
    return `export * from '${importFrom}';\n`;
  }

  const s = new MagicString(
    `import {wrapInClientMarker} from '@shopify/hydrogen/marker';\n` +
      `import * as allImports from '${importFrom}';\n\n`
  );

  // Re-export other stuff directly without wrapping
  if (otherExports.length > 0) {
    s.append(`export {${otherExports.join(', ')}} from '${importFrom}';\n`);
  }

  // Wrap components in Client Marker
  componentExports.forEach((key) => {
    const isDefault = key === DEFAULT_EXPORT;
    const componentName = isDefault
      ? (id.split('/').pop()?.split('.').shift() as string)
      : key;

    s.append(
      `export ${
        isDefault ? DEFAULT_EXPORT : `const ${componentName} =`
      } wrapInClientMarker({ name: '${componentName}', id: '${id}', component: allImports['${key}'], named: ${!isDefault} });\n`
    );
  });

  return s.toString();
}
