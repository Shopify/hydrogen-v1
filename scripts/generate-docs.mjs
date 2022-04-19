import {fileURLToPath} from 'url';
import {resolve, relative, dirname, join, sep} from 'path';
import glob from 'glob';
import {
  writeFileSync,
  statSync,
  readFileSync,
  readdirSync,
  mkdirSync,
} from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG = {
  // A key-value map of file paths to the destination path in the docs repo.
  // File paths included here will use the value as the destination path.
  // Otherwise, it will still be copied to the docs repo but at the same path
  // as the source file.
  paths: {},
  // Array of file paths to skip.
  skip: [
    'docs/code_of_conduct.md',
    'docs/contributing.md',
    'docs/migration_guide.md',
    'docs/welcome.md',
  ],
  // The directory name of the destination repo.
  repo: 'shopify-dev',
  // The directory name of the output directory inside the repo.
  output: 'content/api/hydrogen',
  // The directory name of the documentation source.
  src: 'docs',
};

/**
 * This script will generate the docs for Shopify.dev from the `/docs` directory in this repo.
 * This can only be done by developers who work at Shopify and have access to the Shopify.dev repository.
 */
(async () => {
  console.log(`Generating docs for ${CONFIG.repo} in ${CONFIG.output}...`);
  console.log();

  const repoPath = resolve(__dirname, '../../', CONFIG.repo, CONFIG.output);
  const globPath = [CONFIG.src, '*'].join(sep);

  glob(
    globPath,

    (globErr, files) => {
      if (globErr) {
        return console.error(globErr);
      }

      files.forEach((file) => {
        const dest = resolve(file.replace(CONFIG.src, repoPath));
        process(file, dest, CONFIG.skip);
      });
    }
  );
})();

function process(src, dest, skipFiles = []) {
  const key = relative(CONFIG.src, src);
  const fullPath = relative(join(__dirname, '../../'), src);
  const destination = getDestinationFilePath(key) ?? dest;

  if (skipFiles.some((key) => src.includes(key))) {
    console.log(`Skipping - ${fullPath}`);
    return;
  }

  const stat = statSync(src);

  if (stat.isDirectory()) {
    processDirectory(src, destination, skipFiles);

    return;
  }

  const contents = readFileSync(src, 'utf8');
  const newContents = prependBannerText(fullPath, contents);

  console.log(
    [
      'Copying -',
      fullPath,
      ' → ',
      relative(join(__dirname, '../../'), destination),
    ].join(' ')
  );

  writeFileSync(destination, newContents);
}

function processDirectory(srcDir, destDir, skipFiles = []) {
  mkdirSync(destDir, {recursive: true});

  for (const file of readdirSync(srcDir)) {
    const srcFile = resolve(srcDir, file);
    const destFile = resolve(destDir, file);
    process(srcFile, destFile, skipFiles);
  }
}

function getDestinationFilePath(key) {
  const destination = CONFIG.paths[key];
  if (destination) {
    return resolve(
      __dirname,
      '../../',
      CONFIG.repo,
      CONFIG.output,
      destination
    );
  }
}

function prependBannerText(path, content) {
  const banner = `<!-- This file is generated from source code in the Shopify/hydrogen repo at ${path}. Any changes you make here will be overwritten. For more information, refer to https://shopify.dev/internal/operations/reference-docs/hydrogen. -->`;
  const newContent = `${banner}\n\n${content}`;

  return newContent;
}
