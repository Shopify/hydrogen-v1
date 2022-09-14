import {compileTemplate} from './compile-template.mjs';
import {resolve} from 'path';
import fs from 'fs-extra';

(async () => {
  const [template] = process.argv.slice(2);
  const destination = resolve(process.cwd(), 'templates', `${template}-js`);
  const source = resolve(process.cwd(), 'templates');

  await compileTemplate(template, {source, destination});
  copy(`${source}/${template}`, `${source}/${template}-ts`);
  fs.removeSync(`${source}/${template}`);
})();

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, {recursive: true});
  for (const file of fs.readdirSync(srcDir)) {
    const newFile = file.startsWith('_') ? `.${file.substring(1)}` : file;
    const srcFile = resolve(srcDir, file);
    const destFile = resolve(destDir, newFile);
    copy(srcFile, destFile);
  }
}

function copy(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}
