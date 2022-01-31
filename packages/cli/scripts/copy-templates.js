/* eslint-disable no-console, consistent-return */
const {resolve, relative} = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const {copy} = require('./utils');

function copyFiles() {
  console.log('');
  console.log('Copying examples files for CLI...');
  console.log('');
  glob(
    resolve(__dirname, '../../../examples/*'),
    {
      dot: true,
    },
    (globErr, files) => {
      if (globErr) {
        return console.error(globErr);
      }

      files.forEach((file) => {
        const dest = file.replace(
          'examples',
          'packages/cli/dist/commands/init/templates'
        );

        console.log(`copying • ${relative(process.cwd(), file)}`);
        console.log(`      ↳ • ${relative(process.cwd(), dest)}`);
        console.log('');
        const skipFiles = ['node_modules', 'dist', '.stackblitzrc'];
        copy(file, dest, skipFiles);
      });
    }
  );
}

copyFiles();
