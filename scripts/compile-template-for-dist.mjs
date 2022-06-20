import {compileTemplate} from './compile-template.mjs';
import {resolve} from 'path';
import {rename} from 'fs-extra';

(async () => {
  const [template] = process.argv.slice(2);
  const destination = resolve(process.cwd(), 'templates', `${template}-js`);
  const source = resolve(process.cwd(), 'templates', template);

  compileTemplate(template, {source, destination});
  await rename(source, `${source}-ts`);
})();
