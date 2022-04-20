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
  paths: {
    // Hooks
    // Product Variant
    'hooks/useproduct.md': 'hooks/product-variant/useproduct.md',
    'hooks/useproductoptions.md': 'hooks/product-variant/useproductoptions.md',
    // Primitive
    'hooks/useloadscript.md': 'hooks/primitive/useloadscript.md',
    'hooks/usemoney.md': 'hooks/primitive/usemoney.md',
    // Cart
    'hooks/usecart.md': 'hooks/cart/usecart.md',
    'hooks/usecartline.md': 'hooks/cart/usecartline.md',
    // Localization
    'hooks/usecountry.md': 'hooks/localization/usecountry.md',
    // Global
    'hooks/fetchsync.md': 'hooks/global/fetchsync.md',
    'hooks/usequery.md': 'hooks/global/usequery.md',
    'hooks/useserverstate.md': 'hooks/global/useserverstate.md',
    'hooks/useshop.md': 'hooks/global/useshop.md',
    'hooks/useshopquery.md': 'hooks/global/useshopquery.md',
    'hooks/useurl.md': 'hooks/global/useurl.md',
    // Framework
    'hooks/userouteparams.md': 'hooks/framework/userouteparams.md',
    'hooks/usenavigate.md': 'hooks/framework/usenavigate.md',
    // Metafield
    'hooks/useparsedmetafields.md': 'hooks/metafield/useparsedmetafields.md',

    // Components
    // Cart
    'components/addtocartbutton.md': 'components/cart/addtocartbutton.md',
    'components/buynowbutton.md': 'components/cart/buynowbutton.md',
    'components/cartcheckoutbutton.md': 'components/cart/cartcheckoutbutton.md',
    'components/cartestimatedcost.md': 'components/cart/cartestimatedcost.md',
    'components/cartlineimage.md': 'components/cart/cartlineimage.md',
    'components/cartlineprice.md': 'components/cart/cartlineprice.md',
    'components/cartlineproducttitle.md':
      'components/cart/cartlineproducttitle.md',
    'components/cartlineprovider.md': 'components/cart/cartlineprovider.md',
    'components/cartlinequantity.md': 'components/cart/cartlinequantity.md',
    'components/cartlinequantityadjustbutton.md':
      'components/cart/cartlinequantityadjustbutton.md',
    'components/cartlines.md': 'components/cart/cartlines.md',
    'components/cartprovider.md': 'components/cart/cartprovider.md',
    'components/cartshoppaybutton.md': 'components/cart/cartshoppaybutton.md',
    // Framework
    'components/fileroutes.md': 'components/framework/fileroutes.md',
    'components/link.md': 'components/framework/link.md',
    'components/route.md': 'components/framework/route.md',
    'components/router.md': 'components/framework/router.md',
    // Global
    'components/shopifyprovider.md': 'components/global/shopifyprovider.md',
    // Localization
    'components/localizationprovider.md':
      'components/localization/localizationprovider.md',
    // Primitive
    'components/externalvideo.md': 'components/primitive/externalvideo.md',
    'components/image.md': 'components/primitive/image.md',
    'components/mediafile.md': 'components/primitive/mediafile.md',
    'components/modelviewer.md': 'components/primitive/modelviewer.md',
    'components/money.md': 'components/primitive/money.md',
    'components/seo.md': 'components/primitive/seo.md',
    'components/shoppaybutton.md': 'components/primitive/shoppaybutton.md',
    'components/unitprice.md': 'components/primitive/unitprice.md',
    'components/video.md': 'components/primitive/video.md',
    'components/metafield.md': 'components/primitive/metafield.md',
    // Product Variant
    'components/productdescription.md':
      'components/product-variant/productdescription.md',
    'components/productmetafield.md':
      'components/product-variant/productmetafield.md',
    'components/productprice.md': 'components/product-variant/productprice.md',
    'components/productprovider.md':
      'components/product-variant/productprovider.md',
    'components/producttitle.md': 'components/product-variant/producttitle.md',

    // Utilities
    'utilities/flattenconnection.md': 'utilities/flattenconnection.md',
    'utilities/isclient.md': 'utilities/isclient.md',
    'utilities/isserver.md': 'utilities/isserver.md',
    'utilities/log.md': 'utilities/log.md',
    'utilities/parsemetafieldvalue.md': 'utilities/parsemetafieldvalue.md',
    'utilities/queryshop.md': 'utilities/queryshop.md',
  },
  // Array of file paths to skip.
  skip: [
    'docs/code_of_conduct.md',
    'docs/contributing.md',
    'docs/migration_guide.md',
    'docs/welcome.md',
    'docs/releasing.md',
    'docs/images',
    'docs/contributing',
  ],
  // require a path entry to be copied
  enableDefaultPaths: false,
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

  if (!CONFIG.enableDefaultPaths && destination === dest) {
    console.log(`Skipping (no destination in paths) - ${fullPath}`);
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
