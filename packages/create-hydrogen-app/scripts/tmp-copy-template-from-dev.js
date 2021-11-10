// @ts-check

/**
 * This is a temporary script meant to copy `packages/dev` to `./template-hydrogen`
 * while we are actively developing H2 in `dev`. Eventually, the template will just
 * live in this folder.
 */

const path = require('path');
const fs = require('fs');
const {copy} = require('./utils');

const devPath = path.resolve(__dirname, '..', '..', 'dev');
const templatePath = path.resolve(__dirname, '..', './template-hydrogen');
const skipFiles = ['node_modules', 'dist', '.stackblitzrc'];

// Remove the symlink and replace it with a folder
fs.unlinkSync(templatePath);
fs.mkdirSync(templatePath, {recursive: true});

copy(devPath, templatePath, skipFiles);
