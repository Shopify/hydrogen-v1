// @ts-check

/**
 * This is a temporary script meant to copy `templates/template-hydrogen-default` to `./template-hydrogen`
 * while we are actively developing H2 in `templates/template-hydrogen-default`. Eventually, something else might happen.
 */

const path = require('path');
const fs = require('fs');
const {copy} = require('./utils');

const devPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'templates',
  'template-hydrogen-default'
);
const templatePath = path.resolve(__dirname, '..', './template-hydrogen');
const skipFiles = ['node_modules', 'dist', '.stackblitzrc'];

// Remove the symlink and replace it with a folder
fs.unlinkSync(templatePath);
fs.mkdirSync(templatePath, {recursive: true});

copy(devPath, templatePath, skipFiles);
