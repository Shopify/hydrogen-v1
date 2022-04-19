const {resolve} = require('path');

const {config, exec, pushd, cp, mkdir, rm, echo, exit} = require('shelljs');

const logBreak = () => {
  echo(' ');
};
const log = (text) => {
  echo(`  ${text}`);
};
const logDivider = () => {
  logBreak();
  echo('-----');
  logBreak();
};
const logHeader = (header) => {
  echo(`/ ${header}`);
  logBreak();
};

function tophat({scope, files, packageDir, destProjectDir, skipBuild}) {
  const root = resolve(__dirname, '..');

  config.fatal = true;

  if (!destProjectDir) {
    log(
      'A target project directory is required. `yarn tophat PROJECT_DIRECTORY`'
    );
    exit(1);
  }

  const destPackageDir = resolve(root, `../${destProjectDir}/node_modules/`);

  logBreak();

  files.forEach(({name, scoped, directory}) => {
    logHeader(name);

    const source = resolve(packageDir, directory);
    const destination = scoped
      ? resolve(destPackageDir, scope)
      : resolve(destPackageDir);
    const destinationPackage = resolve(destination, name);

    if (skipBuild) {
      log(`skipping build`);
    } else {
      log(`building ${name}...`);
      pushd(source);
      exec('yarn run build');
      pushd('+1');
    }

    log(`Removing ${destinationPackage}...`);
    rm('-rf', destinationPackage);

    log(`Creating new build directory at ${destination}...`);
    mkdir('-p', destination);

    log(`Copying source in ${source} to build to ${destination} to `);
    cp('-R', source, destinationPackage);

    log('Success!');
    logDivider();
  });

  logBreak();
  log('Build copied to project. ');
}

const PACKAGE_CONFIG_MAP = [
  {
    name: 'eslint-plugin-shopify',
    directory: 'eslint-plugin',
    scoped: false,
  },
];

(() => {
  const args = process.argv.slice(2);
  const destProjectDir = args[0];
  const packagesIndex = args.findIndex((arg) => arg === '--packages');

  const packages = args.slice(packagesIndex + 1);
  const skipBuild = args.findIndex((arg) => arg === '--skip-build');

  const files = packages.map((pkg) => {
    const results = PACKAGE_CONFIG_MAP.filter(
      (config) => config.directory === pkg
    );

    return results.length && results[0];
  });

  tophat({
    skipBuild: skipBuild !== -1,
    files,
    scope: '@shopify',
    packageDir: 'packages',
    destProjectDir: destProjectDir,
  });
})();
