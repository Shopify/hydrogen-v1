import {resolve, join, parse} from 'path';
import markdownTable from 'markdown-table';
import {pathExists, ensureDir} from 'fs-extra';
import type {FrontMatter} from './types';
import {createDependencyGraph} from './utilities/dependency-graph';
import {findUuid, strip, firstSentence} from './utilities/shared';
import {padBreak, stripMarkdown} from './utilities/markdown';
import type {Node} from './utilities/shared';
import {FileResult} from './FileResult';

const SHOPIFY_DEV_CONTENT_PATH = '../shopify-dev/content';
const SOURCE_DIRECTORY_NAME = 'src';

export interface Options {
  inputRootPath: string;
  packageName: string;
  generateDocsForShopifyDev?: boolean;
}

interface SectionOptions extends FrontMatter {
  entry?: string | string[];
  level: number;
  tableColumns?: string[];
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

  async section({
    url,
    title = 'untitled',
    entry = '.',
    level = 1,
    tableColumns,
    ...passThroughFrontMatter
  }: Partial<SectionOptions>) {
    const paths = await this.paths(url);
    const indexResult = new FileResult({
      gid: findUuid(paths.output),
      url: paths.url,
      title,
      ...passThroughFrontMatter,
    });

    const listItems = [];

    if (Array.isArray(entry)) {
      return Promise.all([
        entry.map((en) => {
          this.section({
            ...passThroughFrontMatter,
            url,
            title,
            entry: en,
            level: level + 1,
          });
        }),
      ]);
    }

    const basePath = join(this.packageRoot, SOURCE_DIRECTORY_NAME, entry);

    if (basePath.endsWith('.md')) {
      await indexResult.add(basePath);
    }

    const componentIndex = join(basePath, 'index.ts');
    if (level === 1) {
      await indexResult.overview(basePath);
    }

    if (await pathExists(componentIndex)) {
      const {components, hooks, nodes} = await buildComponentGraph(
        componentIndex
      );
      const outputDirectory = resolve(
        url?.split('/').slice(0, -1).join('/') || ''
      );

      for (const component of [...components, ...hooks]) {
        const {
          value: {name, docs, props},
        } = component as any;
        const componentUrl = join(outputDirectory, name.toLowerCase());

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
            directory: paths.entry,
          });

          await componentResult.push(`\n`);
        }

        await componentResult.docs(componentEntryBase);

        await Promise.all([
          componentResult.writeReadme(componentEntryBase),
          componentResult.writeDevDoc(componentPaths.output),
        ]);

        listItems.push({
          name: `<a href="${componentUrl}">${name}</a>`,
          description,
        });
      }

      if (listItems.length) {
        indexResult.push(`\n`);
        indexResult.push(
          list({
            items: listItems,
            // TODO: How do we dynamically know what the columns are?
            columns: tableColumns,
          })
        );
        indexResult.push(`\n`);
      }
    }

    if (level === 1) {
      await indexResult.docs(basePath);
    }

    if (this.writeDocs) {
      await indexResult.writeDevDoc(paths.output);
    }

    /**
     * If we are in at package root (anything at the first level of packages/<package-name>)
     * we want to write a package-level readme (for example: packages/hydrogen/README.md)
     */
    if (resolve(basePath) === this.packageRoot) {
      await indexResult.writeReadme(resolve(basePath));
    }
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
