import {resolve, join, parse} from 'path';
import markdownTable from 'markdown-table';
import {pathExists, ensureDir} from 'fs-extra';
import type {FrontMatter} from './types';
import {createDependencyGraph} from '@shopify/docs-tools';
import {findUuid, strip, firstSentence} from './utilities/shared';
import {padBreak, stripMarkdown} from './utilities/markdown';
import type {Node} from './utilities/shared';
import {FileResult} from './FileResult';
import {Column} from './types';

const SHOPIFY_DEV_CONTENT_PATH = '../shopify-dev/content';
const SOURCE_DIRECTORY_NAME = 'src';

export interface Options {
  inputRootPath: string;
  packageName: string;
  generateDocsForShopifyDev?: boolean;
}

interface TableItem {
  name: string;
  type: 'Shared' | 'Client' | 'Server';
  description: string;
}

interface SectionOptions extends FrontMatter {
  entry?: string | string[];
  level: number;
  tables?: ((items: TableItem[]) => (string | string[])[])[];
  intro: string;
}

interface TableOptions {
  columns: (string | Column)[];
  title: string;
  description: string;
}

export class DocsGen {
  private packageRoot: string;
  private outputRoot: string;
  private writeDocs?: boolean;

  constructor(private options: Options) {
    this.packageRoot = resolve(
      this.options.inputRootPath,
      'packages',
      this.options.packageName
    );
    this.outputRoot = resolve(
      this.options.inputRootPath,
      SHOPIFY_DEV_CONTENT_PATH
    );
    this.writeDocs = options.generateDocsForShopifyDev;
  }

  table(config: TableOptions) {
    return (items: TableItem[]) => {
      const cells = items.map((comp) => {
        if (config.columns.includes(Column.ComponentType)) {
          return [comp.name, comp.type, comp.description];
        }
        return [comp.name, comp.description];
      });

      return [
        `## ${config.title}`,
        config.description,
        padBreak([markdownTable([config.columns, ...cells])]),
      ];
    };
  }

  async section({
    url,
    title = 'untitled',
    description,
    entry = '.',
    level = 1,
    tables = [],
    intro = '',
    ...passThroughFrontMatter
  }: Partial<SectionOptions>) {
    const isOverviewPage = Array.isArray(entry);
    const paths = await this.paths(url);
    const indexResult = new FileResult({
      gid: findUuid(paths.output),
      url: paths.url,
      title,
      description,
      ...passThroughFrontMatter,
    });

    if (isOverviewPage) {
      await indexResult.push(intro);
      await indexResult.push(`\n`);

      const pagePromises = entry.map((en) => {
        return this.section({
          ...passThroughFrontMatter,
          url,
          title,
          entry: en,
          description,
          level: level + 1,
        });
      });

      const tableOfContents: TableItem[] = [];

      for await (const page of pagePromises) {
        tableOfContents.push(page[0]);
      }

      const tableMarkup = tables.map((table) => {
        const tm = table(tableOfContents.filter((x) => x)).join('\n\n');

        return tm;
      });

      indexResult.push(tableMarkup.join(''));

      if (this.writeDocs) {
        await indexResult.writeDevDoc(paths.output);
      }

      return [];
    }

    const basePath = join(this.packageRoot, SOURCE_DIRECTORY_NAME, entry);

    if (level === 1) {
      await indexResult.docs(basePath);
    }

    if (basePath.endsWith('.md')) {
      await indexResult.add(basePath);
    }

    if (level === 1) {
      await indexResult.overview(basePath);
    }

    const outputDirectory = resolve(
      url?.split('/').slice(0, -1).join('/') || ''
    );

    const components = await this.gatherComponents({
      entry: basePath,
      output: outputDirectory,
      level,
    });

    return components;
  }

  async gatherComponents({
    entry,
    output,
    level,
  }: {
    entry: string;
    output: string;
    level: number;
  }) {
    const listItems: TableItem[] = [];
    const componentIndex = join(entry, 'index.ts');

    if (await pathExists(componentIndex)) {
      const {components, hooks, nodes} = await buildComponentGraph(
        componentIndex
      );

      for (const component of [...components, ...hooks]) {
        const {
          value: {name, docs, props},
        } = component as any;
        const componentUrl = join(output, name.toLowerCase());

        const componentOutputFile = `${componentUrl}.md`;
        const componentPaths = await this.paths(componentOutputFile);
        const componentDocsContent = docs
          ? `${strip(docs.content).trim()}\n`
          : '';
        const description = `${firstSentence(componentDocsContent)}`;
        const plainDescription = `${firstSentence(
          await stripMarkdown(componentDocsContent)
        )}`;
        const componentResult = new FileResult({
          gid: findUuid(componentPaths.output),
          url: componentPaths.url,
          title: name,
          description: plainDescription,
        });
        const componentEntryBase = resolve(
          componentPaths.entry,
          entry,
          level === 1 ? name : ''
        );

        await componentResult.push(componentDocsContent);
        await componentResult.examples(componentEntryBase);

        const face = nodes.find(({value}: any) => value.name === props?.name);

        if (
          face &&
          face.value.kind === 'InterfaceType' &&
          face.value.properties.length > 0
        ) {
          await componentResult.push(`## Props\n`);

          componentResult.table({
            properties: face.value.properties,
            exports: nodes,
            directory: entry,
          });

          await componentResult.push(`\n`);
        }

        await componentResult.docs(componentEntryBase);

        await componentResult.writeReadme(componentEntryBase);

        if (this.writeDocs) {
          componentResult.writeDevDoc(componentPaths.output);
        }

        const componentType = getComponentType(join(entry, name));

        listItems.push({
          name: `<a href="${componentUrl}">${name}</a>`,
          description,
          type: componentType as 'Server' | 'Client' | 'Shared',
        });
      }
    }
    return listItems;
  }

  private async paths(url?: string) {
    if (!url) {
      throw Error('You need to provide a url for this doc');
    }

    const urlPath = parse(url);

    await ensureDir(join(this.outputRoot, urlPath.dir));

    const paths = {
      entry: resolve(this.packageRoot, SOURCE_DIRECTORY_NAME),
      output: join(this.outputRoot, url),
      url:
        urlPath.base === 'index.md'
          ? urlPath.dir
          : [urlPath.dir, urlPath.name].join('/'),
    };
    return paths;
  }
}

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

export function list({
  items,
  columns = [],
}: {
  items: {name: string; description: string}[];
  columns?: string[];
}) {
  const cells = items.map((comp) => {
    return [comp.name, comp.description];
  });
  return padBreak([markdownTable([columns, ...cells])]);
}

function getComponentType(path: string) {
  try {
    if (require.resolve(`${path}.client.tsx`)) {
      return 'Client';
    }
  } catch {}

  try {
    if (require.resolve(`${path}.server.tsx`)) {
      return 'Server';
    }
  } catch {}

  return 'Shared';
}
