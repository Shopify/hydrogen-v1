import {compileTemplate} from './compile-template.mjs';
import {resolve} from 'path';
import fs from 'fs-extra';

(async () => {
  const [template] = process.argv.slice(2);
  const destination = resolve(process.cwd(), 'templates', `${template}-js`);
  const source = resolve(process.cwd(), 'templates');

  await compileTemplate(template, {source, destination});
  copy(`${source}/${template}`, `${source}/${template}-ts`);
})();

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, {recursive: true});
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = resolve(srcDir, file);
    const destFile = resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function copy(src, dest, skipFiles = []) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    copyDir(src, dest, skipFiles);
  } else {
    fs.copyFileSync(src, dest);
  }
}
