import {resolve, join} from 'path';
import {pathExists} from 'fs-extra';
import {createDependencyGraph} from '@shopify/docs-tools';
import type {Node} from './utilities/shared';

const SOURCE_DIRECTORY_NAME = 'src';

export async function components({
  inputRootPath,
  packageName,
  entry,
}: {
  inputRootPath: string;
  packageName: string;
  entry: string;
}) {
  const packageRoot = resolve(inputRootPath, 'packages', packageName);
  const componentIndexBase = join(packageRoot, SOURCE_DIRECTORY_NAME, entry);
  const componentIndex = join(componentIndexBase, 'index.ts');

  let items: Node[] = [];

  if (await pathExists(componentIndex)) {
    console.log('building component graph for', componentIndex);
    const {components, hooks} = await buildComponentGraph(componentIndex);

    items = [...components, ...hooks];
  }
  return items;
}

/** this should be part of docs-tools? */
async function buildComponentGraph(componentIndex: string) {
  const graph = await createDependencyGraph(componentIndex);

  const nodes: Node[] = [];

  graph.forEach((value) => {
    value.locals.forEach((value: any, key) => {
      if (value.kind !== 'Imported') {
        if (value.name == null) {
          value.name = key;
        }
        nodes.push({value, module: undefined});
      }
    });
  });

  const components = [
    ...new Set(nodes.filter(({value}: any) => value.kind === 'Component')),
  ];

  const hooks = [
    ...new Set(nodes.filter(({value}: any) => value.kind === 'Hook')),
  ];

  // Sort alphabetically (tsdoc seems to get this confused)
  components.sort((aa: any, bb: any) => {
    if (aa.value.name > bb.value.name) {
      return 1;
    } else if (aa.value.name < bb.value.name) {
      return -1;
    } else {
      return 0;
    }
  });

  return {nodes, hooks, components};
}

/** save this */
// function getComponentType(path: string) {
//   try {
//     if (require.resolve(`${path}.client.tsx`)) {
//       return 'Client';
//     }
//   } catch {}

//   try {
//     if (require.resolve(`${path}.server.tsx`)) {
//       return 'Server';
//     }
//   } catch {}

//   return 'Shared';
// }
