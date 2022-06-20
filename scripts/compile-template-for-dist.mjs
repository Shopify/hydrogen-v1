import {compileTemplate} from './compile-template.mjs';

const [template] = process.argv.slice(2);

compileTemplate(template);
