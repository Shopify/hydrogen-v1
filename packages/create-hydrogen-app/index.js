#!/usr/bin/env node
// @ts-check

// Inspired by and borrowed from https://github.com/vitejs/vite/blob/main/packages/create-app/index.js

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const {prompt} = require('enquirer');
const {cyan, green, yellow, red} = require('kolorist');
const {copy} = require('./scripts/utils.js');

const cwd = process.cwd();

const TEMPLATES = {
  'jsx': 'hydrogen',
  'tsx': 'hydrogen-typescript'
}

const renameFiles = {
  _gitignore: '.gitignore',
};

async function init() {

  // This is if you create with name
  let targetDir = argv._[0];

  if (!targetDir) {
    /**
     * @type {{ projectName: string }}
     */
    const {projectName} = await prompt({
      type: 'input',
      name: 'projectName',
      message: `Project name:`,
      initial: 'hydrogen-app',
    });
    targetDir = projectName;
  }

  /**
   * @type {{ syntax: string }}
   */
  const {syntax} = await prompt({
    type: 'select',
    name: 'syntax',
    message: 'Template syntax (.jsx|.tsx)',
    initial: 0,
    choices: [
      {name: 'jsx', message: 'jsx', value: 'jsx'},
      {name: 'tsx', message: 'tsx', value: 'tsx'},
    ]
  })

  const packageName = await getValidPackageName(targetDir);
  const root = path.join(cwd, targetDir);
  console.log(`\nWriting files...`);

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, {recursive: true});
  } else {
    const existing = fs.readdirSync(root);
    if (existing.length) {
      /**
       * @type {{ yes: boolean }}
       */
      const {yes} = await prompt({
        type: 'confirm',
        name: 'yes',
        initial: false,
        message:
          `Target directory ${yellow(targetDir + '/')} is not empty.\n` +
          `Remove existing files and continue?`,
      });
      if (yes) {
        console.log(`Deleting files in ${yellow(targetDir + '/')}...`);
        emptyDir(root);
      } else {
        console.log('Exiting. No files deleted.');
        return;
      }
    }
  }

  // Determine template
  const template = TEMPLATES[syntax]

  const templateDir = path.join(__dirname, `template-${template}`);

  const write = (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  const skipFiles = ['package.json', 'node_modules', 'dist'];
  for (const file of files.filter((f) => !skipFiles.includes(f))) {
    write(file);
  }

  const pkg = require(path.join(templateDir, `package.json`));

  pkg.name = packageName;

  /**
   * When the user is running a LOCAL version of hydrogen external from the
   * monorepo, they expect to use the local version of the library instead
   * of the registry version. We need to use a file reference here because
   * yarn fails to link scoped packages.
   **/

  if (process.env.LOCAL) {
    pkg.dependencies['@shopify/hydrogen'] =
      'file:../../Shopify/hydrogen/packages/hydrogen';
  }

  /**
   * Rewrite some scripts to strip out custom environment variables
   * we add for use in the monorepo (LOCAL_DEV).
   */
  for (const scriptName of ['dev']) {
    const match = pkg.scripts[scriptName].match(/(vite( .*)?)$/);
    if (match) {
      pkg.scripts[scriptName] = match[0];
    }
  }

  write('package.json', JSON.stringify(pkg, null, 2));

  const pkgManager = /yarn/.test(process.env.npm_execpath) ? 'yarn' : 'npm';

  console.log(`Created ${green(packageName)} in directory ${cwd}`);
  console.log(
    `\nTo install your project dependencies and start your local ` +
      `development server, run these commands:\n`
  );
  if (root !== cwd) {
    console.log(cyan(`  cd ${path.relative(cwd, root)}`));
  }

  /**
   * The LOCAL option only works with Yarn due to issues with NPM
   * and symlinking yarn monorepos.
   */
  const usesYarn = pkgManager === 'yarn' || process.env.LOCAL;

  console.log(
    cyan(`  ${usesYarn ? `yarn` : `npm install --legacy-peer-deps`}`)
  );
  console.log(cyan(`  ${usesYarn ? `yarn dev` : `npm run dev`}`));
  console.log(
    `\nYour project will display inventory from the Hydrogen Demo Store. ` +
      `To connect this project to your Shopify store's inventory instead, ` +
      `update ${yellow(packageName + '/shopify.config.js')} with your ` +
      `store ID and Storefront API key.\n`
  );
}

async function getValidPackageName(projectName) {
  const packageNameRegExp =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (packageNameRegExp.test(projectName)) {
    return projectName;
  } else {
    const suggestedPackageName = projectName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^[._]/, '')
      .replace(/[^a-z0-9-~]+/g, '-');

    /**
     * @type {{ inputPackageName: string }}
     */
    const {inputPackageName} = await prompt({
      type: 'input',
      name: 'inputPackageName',
      message: `Package name:`,
      initial: suggestedPackageName,
      validate: (input) =>
        packageNameRegExp.test(input) ? true : 'Invalid package.json name',
    });
    return inputPackageName;
  }
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file);
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs);
      fs.rmdirSync(abs);
    } else {
      fs.unlinkSync(abs);
    }
  }
}

init().catch((e) => {
  console.error(e);
});
