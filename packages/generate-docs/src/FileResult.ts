import {resolve} from 'path';
import prettier from 'prettier';
import {inPageAnchors} from './utilities/markdown';
import {writeFile, readFile, pathExists, readdir} from 'fs-extra';
import {renderMarkdownExample} from './utilities/examples';
import {TableConfig, table} from './utilities/shared';
import type {FrontMatter} from './types';

const EXAMPLES_DIRECTORY_NAME = 'examples';
const CONTENT_DIRECTORY_NAME = 'docs';
const PRETTIER_CONFIG = {
  ...require('@shopify/prettier-config'),
  parser: 'markdown',
  tabWidth: 2,
  printWidth: 80,
  trailingComma: 'es5',
};

export class FileResult {
  private staged: string[];
  private frontMatter: string;

  constructor(frontMatter: FrontMatter) {
    this.frontMatter = this.renderYamlFrontMatter(frontMatter);
    this.staged = [];
  }

  public async writeDevDoc(path: string) {
    const result = inPageAnchors(this.staged.join(''));
    const docPath =
      'https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md';

    const comment = `<!-- This file is generated from source code in the Shopify/hydrogen repo. Any changes you make here will be overwritten. For more information, refer to ${docPath}. -->`;

    await this.write(path, [this.frontMatter, comment, result].join('\n\n'));
  }

  public async writeReadme(path: string) {
    try {
      if (this.staged.join('') === '') {
        return;
      }

      const localPath = path.replace(resolve('.'), '');
      const docPath =
        'https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md';
      const finalPath = resolve(path, 'README.md');
      const comment = `<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in ${localPath} and run 'yarn generate-docs' at the root of this repo. For more information, refer to ${docPath}. -->`;
      await this.write(
        finalPath,
        [comment, ...this.staged].join('\n\n').trim()
      );
    } catch {}
  }

  public push(content: string | string[]) {
    const finalContent = Array.isArray(content) ? content : [content];

    this.staged = [...this.staged, ...finalContent];
  }

  async write(path: string, content: string) {
    const formattedContent = prettier.format(content, PRETTIER_CONFIG);
    await writeFile(path, formattedContent);
  }

  async add(
    entry: string,
    callback?: (file: string, content: string) => string
  ) {
    let additionalContent = [];

    if (entry.endsWith('.md')) {
      const content = await readFile(entry, 'utf8');
      const finalContent = callback ? await callback(entry, content) : content;
      this.staged.push(finalContent);

      return;
    }

    try {
      additionalContent = (await readdir(entry))
        .map((file) => resolve(entry, file))
        .sort();
    } catch {
      return;
    }

    for (const file of additionalContent) {
      const content = await readFile(file, 'utf8');

      const finalContent = callback ? await callback(file, content) : content;
      this.staged.push(finalContent);
    }
  }

  public async examples(entry: string) {
    const examplesPath = resolve(entry, EXAMPLES_DIRECTORY_NAME);

    if (await pathExists(examplesPath)) {
      this.staged.push(`\n## Example code`);
    }

    await this.add(examplesPath, renderMarkdownExample);
  }

  public async docs(entry: string) {
    await this.add(resolve(entry, CONTENT_DIRECTORY_NAME), (file, content) =>
      file.endsWith('overview.md') ? '' : content
    );
  }

  public async overview(entry: string) {
    const overviewPath = resolve(entry, CONTENT_DIRECTORY_NAME, 'overview.md');
    if (await pathExists(overviewPath)) {
      await this.add(overviewPath);
    }
  }

  table(args: TableConfig) {
    this.staged.push(`\n`);
    this.staged.push(table(args));
    this.staged.push(`\n`);
  }

  private renderYamlFrontMatter(frontMatter: FrontMatter) {
    let matter = '---\n';

    (Object.keys(frontMatter) as (keyof FrontMatter)[]).forEach((key) => {
      if (frontMatter[key]) {
        matter += `${key}: ${frontMatter[key]}\n`;
      }
    });

    matter += '---';

    return matter;
  }
}
