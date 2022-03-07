// @ts-check
// Generate a bundle analysis based on the current build output.

const {promises: fs} = require('fs');
const {promisify} = require('util');
const {gzip} = require('zlib');

const compress = promisify(gzip);

// Version the bundle schema so we can adjust without breaking all PRs
const VERSION = 1;

const BUNDLES = [
  {
    name: 'Default Template: Client',
    async path() {
      const manifest = JSON.parse(
        await fs.readFile(
          './examples/template-hydrogen-default/dist/client/manifest.json',
          'utf8'
        )
      );

      // Grab the filename of the first import from `index.html`
      const vendorName = manifest['index.html'].imports[0];
      const vendorPath = manifest[vendorName].file;

      return `./examples/template-hydrogen-default/dist/client/${vendorPath}`;
    },
    isClient: true,
  },
  {
    name: 'Default Template: Server (Node.js)',
    path: './examples/template-hydrogen-default/dist/server/index.js',
  },
  {
    name: 'Default Template: Server (Worker)',
    path: './examples/template-hydrogen-default/dist/worker/index.js',
  },
];

async function run(compareToFilePath) {
  // Determine the size for each entry in the bundle
  const bundles = await Promise.all(
    BUNDLES.map(async (bundle) => {
      const {sizeInKbs, sizeInKbsGzipped} = await analyzeBundle(bundle.path);
      return {
        name: bundle.name,
        sizeInKbs,
        sizeInKbsGzipped,
        isClient: !!bundle.isClient,
      };
    })
  );

  const bundleSizes = {
    version: VERSION,
    bundles,
  };

  // Write it to disk
  const output = JSON.stringify(bundleSizes, null, 2);
  const outputPath = './bundle-sizes.json';
  console.log(`Writing bundle sizes to ${outputPath}`);
  await fs.writeFile(outputPath, output);

  if (compareToFilePath) {
    // Compare the sizes to the previous version
    const previousBundleSizes = JSON.parse(
      await fs.readFile(compareToFilePath, 'utf8')
    );

    if (previousBundleSizes.version !== VERSION) {
      console.log(
        `Skipping comparison because previous bundle sizes are from a different schema: v${previousBundleSizes.version}`
      );
      return;
    }
  }
}

async function analyzeBundle(bundlePath) {
  const filePath =
    typeof bundlePath === 'string' ? bundlePath : await bundlePath();
  const file = await fs.readFile(filePath);
  const sizeInKbs = (file.length / 1024).toFixed(2);

  const gzipped = await compress(file);
  const sizeInKbsGzipped = (gzipped.length / 1024).toFixed(2);

  return {sizeInKbs, sizeInKbsGzipped};
}

// If --compare is passed, compare the bundle sizes to the previous run.
const compareToFilePath = process.argv?.[2]?.split('=')?.[1];

run(compareToFilePath);
