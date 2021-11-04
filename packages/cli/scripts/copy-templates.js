/* eslint-disable no-console, consistent-return */
const {resolve, join} = require('path');
const fs = require('fs-extra');
const glob = require('glob');

function copyFiles() {
  glob(
    resolve(__dirname, '../../create-hydrogen-app/template-hydrogen/*'),
    {
      dot: true,
    },
    (globErr, files) => {
      if (globErr) {
        return console.error(globErr);
      }

      files.forEach((file) => {
        if (file.includes('node_modules')) {
          return;
        }

        const dest = file.replace(
          'create-hydrogen-app/template-hydrogen',
          'cli/dist/commands/init/templates/template-hydrogen'
        );
        fs.copy(resolve(file), resolve(dest), (copyErr) => {
          if (copyErr) {
            console.error(file, dest, copyErr);
          }
        });
      });
    }
  );
}

copyFiles();
