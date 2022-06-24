/* eslint-disable no-case-declarations */
import rimraf from 'rimraf';
import {resolve, basename, sep, extname} from 'path';
import fs from 'fs-extra';
import glob from 'fast-glob';
import ts from 'typescript';
import prettier from 'prettier';

export async function compileTemplate(
  template = 'demo-store',
  {source, destination} = {}
) {
  if (!template) {
    throw new Error('No template specified');
  }

  const JSTemplateDirectory = destination
    ? resolve(destination)
    : resolve(process.cwd(), 'templates', `${template}-js`);

  const TSTemplateDirectory = source
    ? resolve(source, template)
    : resolve(process.cwd(), 'templates', template);

  const globPath = [TSTemplateDirectory, '**', '/!(*.d)'].join(sep);
  const files = glob.sync(globPath, {
    nosort: true,
    nodir: true,
    dot: true,
    ignore: ['**/dist/**', '**/node_modules/**'],
  });

  rimraf.sync(JSTemplateDirectory);

  const processor = await createProcessor(
    TSTemplateDirectory,
    JSTemplateDirectory,
    template
  );

  await Promise.all(files.map(processor));
}

async function createProcessor(from, to, template) {
  const tsConfig = await fs.readFile(resolve(from, 'tsconfig.json'), 'utf8');
  const config = JSON.parse(tsConfig);

  return async function processFile(filepath) {
    const filename = basename(filepath);
    const ext = extname(filepath);
    let destination = filepath.replace(from, to);
    let content = await fs.readFile(filepath, 'utf8');

    switch (ext) {
      case '.ts':
      case '.tsx':
        const withArtificialNewLines = escapeNewLines(content);
        const compiled = compile(
          withArtificialNewLines,
          config.compilerOptions
        );

        content = restoreNewLines(compiled.outputText);
        destination = destination.replace('.ts', '.js');

        break;
      case '.eot':
      case '.woff':
      case '.woff2':
      case '.ttf':
        await fs.mkdirp(resolve(destination, '..'));
        await fs.writeFile(destination, content);
        return;
    }

    switch (filename) {
      case 'favicon.ico':
      case '.stackblitzrc':
      case '_gitignore':
        await fs.mkdirp(resolve(destination, '..'));
        await fs.writeFile(
          destination.replace('_gitignore', '.gitignore'),
          content
        );
        return;
      case 'tsconfig.json':
        destination = destination.replace('ts', 'js');

        const compilerOptions = [
          'target',
          'module',
          'moduleResolution',
          'lib',
          'jsx',
          'types',
        ].reduce((acc, key) => {
          acc[key] = config.compilerOptions[key];
          return acc;
        }, {});

        content = JSON.stringify(
          Object.assign(config, {
            compilerOptions,
            include: config.include.map((path) => path.replace('.ts', '.js')),
          }),
          null,
          2
        );

        break;
      case 'yarn.lock':
      case '.gitignore':
      case 'yarn-error.log':
        return;
      case 'README.md':
        content = content
          .replace('TypeScript', 'JavaScript')
          .replace('typescript', 'javascript')
          .replace('.ts', '.js')
          .replace('-ts', '-js');
        break;
      case 'package.json':
        const packageJSON = JSON.parse(content);
        const newPackageJSON = Object.assign(packageJSON, {
          name: `${template}-js`,
          description:
            template === 'hello-world'
              ? 'An example using JavaScript in Hydrogen'
              : packageJSON.description,
        });

        delete packageJSON.devDependencies.typescript;
        delete packageJSON.devDependencies['@types/react'];

        content = JSON.stringify(newPackageJSON, null, 2);
    }

    content = await format(content, filename);

    await fs.mkdirp(resolve(destination, '..'));
    await fs.writeFile(destination, content);
  };
}

const escapeNewLines = (code) => code.replace(/\n\n/g, '\n/* :newline: */');
const restoreNewLines = (code) => code.replace(/\/\* :newline: \*\//g, '\n');

function compile(code, options) {
  return ts.transpileModule(code, {
    reportDiagnostics: false,
    compilerOptions: {
      ...options,
      jsx: 'preserve',
      removeComments: false,
    },
  });
}

async function format(content, path) {
  const ext = extname(path);
  const prettierConfig = {
    arrowParens: 'always',
    singleQuote: true,
    bracketSpacing: false,
    trailingComma: 'all',
    parser: 'babel',
  };

  switch (ext) {
    case '.md':
      prettierConfig.parser = 'markdown';
      break;
    case '.html':
    case '.svg':
      prettierConfig.parser = 'html';
      break;
    case '.json':
    case '.css':
      prettierConfig.parser = ext.slice(1);
      break;
  }

  const formattedContent = await prettier.format(content, prettierConfig);

  return formattedContent;
}
/* eslint-enable no-case-declarations */
