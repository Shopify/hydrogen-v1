// @ts-check

/**
 * This is a temporary script meant to copy `templates/demo-store` to `./template-hydrogen`
 * while we are actively developing H2 in `templates/demo-store`. Eventually, something else might happen.
 */

const path = require('path');
const fs = require('fs');

const devPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'templates',
  'demo-store'
);
const templatePath = path.resolve(__dirname, '..', './template-hydrogen');
const skipFiles = ['node_modules', 'dist', '.stackblitzrc'];

// Remove the symlink and replace it with a folder
fs.unlinkSync(templatePath);
fs.mkdirSync(templatePath, {recursive: true});

copy(devPath, templatePath, skipFiles);

function copyDir(srcDir, destDir, skipFiles = []) {
  fs.mkdirSync(destDir, {recursive: true});
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile, skipFiles);
  }
}

function copy(src, dest, skipFiles = []) {
  if (skipFiles.some((file) => src.includes(file))) return;

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    copyDir(src, dest, skipFiles);
  } else {
    fs.copyFileSync(src, dest);
  }
}
