import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import glob from 'glob';
import {dirname, join, relative, resolve, sep} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG = {
  // A key-value map of file paths to the destination path in the docs repo.
  // File paths included here will use the value as the destination path.
  overrides: {
    'framework/': 'content/custom-storefronts/hydrogen',
    'deployment.md': 'content/custom-storefronts/hydrogen/deployment.md',
  },
  // Array of file paths to skip.
  skip: [
    'docs/images',
    'docs/contributing',
    'docs/README.md',
    'docs/decisions',
  ],
  // require a path entry to be copied. If true files will still be copied by default
  // and appear in the same directory structure as their source file.
  enableDefaultPaths: true,
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
  const globPath = [CONFIG.src, '**', '*.md'].join(sep);

  const files = glob.sync(globPath, {nosort: true});
  const filesCopy = [...files];

  Object.entries(CONFIG.overrides)
    .filter(([path]) => path.endsWith('/'))
    .forEach(([folder, replacement]) => {
      filesCopy.forEach((file) => {
        const dest = resolve(file.replace(CONFIG.src, repoPath));

        if (file.startsWith(`${CONFIG.src}/${folder}`)) {
          process(file, dest.replace(CONFIG.output, replacement), CONFIG.skip);

          const handledIndex = files.indexOf(file);
          if (handledIndex > -1) {
            files.splice(handledIndex, 1);
          }
        }
      });
    });

  files.forEach((file) => {
    const dest = resolve(file.replace(CONFIG.src, repoPath));
    process(file, dest, CONFIG.skip);
  });
})();

function process(src, dest, skipFiles = []) {
  const key = relative(CONFIG.src, src);
  const fullPath = relative(join(__dirname, '../../'), src);

  const destination = getDestinationFilePath(key) ?? dest;

  if (skipFiles.some((skip) => src.includes(skip))) {
    console.log(`Skipping - ${fullPath}`);
    return;
  }

  const stat = statSync(src);

  if (stat.isDirectory()) {
    processDirectory(src, destination, skipFiles);

    return;
  }

  if (!CONFIG.enableDefaultPaths && !CONFIG.overrides[key]) {
    console.log(`Skipping (no destination in paths) - ${fullPath}`);
    return;
  }

  const contents = readFileSync(src, 'utf8');
  const newContents = removeAbsoluteLinksToShopifyDev(
    prependBannerText(fullPath, contents)
  );

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
  const destination = CONFIG.overrides[key];
  if (destination) {
    return resolve(__dirname, '../../', CONFIG.repo, destination);
  }
}

function prependBannerText(path, content) {
  const banner = `<!-- This file is generated from source code in the Shopify/hydrogen repo at ${path}. Any changes you make here will be overwritten. For more information, refer to https://shopify.dev/internal/operations/reference-docs/hydrogen. -->`;
  return `${banner}\n\n${content}`;
}

function removeAbsoluteLinksToShopifyDev(content) {
  return content.replaceAll('](https://shopify.dev', '](');
}
