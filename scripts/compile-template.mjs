import {execa} from 'execa';
import rimraf from 'rimraf';
import {ESLint} from 'eslint';
import {resolve} from 'path';
import {readFile, writeFile, copyFile, mkdir} from 'fs/promises';

const OTHER_FILES = [
  `index.html`,
  `README.md`,
  '.stackblitzrc',
  'public/favicon.ico',
];

(async () => {
  const [template] = process.argv.slice(2);

  if (!template) {
    throw new Error('No template specified');
  }

  const TSTemplateDirectory = resolve(
    process.cwd(),
    'templates',
    `${template}-typescript`
  );
  const JSTemplateDirectory = resolve(
    process.cwd(),
    'templates',
    `${template}-javascript`
  );

  rimraf.sync(JSTemplateDirectory);

  const tsconfigFile = await createTSConfig(template);

  await execa('yarn', ['tsc', '--project', tsconfigFile]);
  await movePackageJSON(TSTemplateDirectory, JSTemplateDirectory);
  await mkdir(`${JSTemplateDirectory}/public`);
  await Promise.all(
    OTHER_FILES.map((file) =>
      copyFile(
        `${TSTemplateDirectory}/${file}`,
        `${JSTemplateDirectory}/${file}`
      )
    )
  );

  const eslint = new ESLint({fix: true});

  const results = await eslint.lintFiles([
    `${JSTemplateDirectory}/**/*.{js,ts,jsx,tsx}`,
  ]);

  await ESLint.outputFixes(results);

  rimraf.sync(tsconfigFile);
})();

async function movePackageJSON(from, to) {
  const packageJSONContent = await readFile(`${from}/package.json`, 'utf8');
  const packageJSON = JSON.parse(packageJSONContent);
  const newPackageJSON = Object.assign(packageJSON, {
    name: 'hello-world-javascript',
    scripts: {
      ...packageJSON.scripts,
      dev: 'shopify hydrogen dev',
    },
  });
  const newPackageJSONContent = JSON.stringify(newPackageJSON, null, 2);
  await writeFile(`${to}/package.json`, newPackageJSONContent);
}

async function createTSConfig(template) {
  const tsconfigFilename = './scripts/compile-template.tsconfig.json';
  const config = {
    compilerOptions: {
      outDir: `../templates/${template}-javascript`,
      target: 'es2020',
      module: 'esnext',
      moduleResolution: 'node',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      experimentalDecorators: true,
      lib: ['dom', 'dom.iterable', 'scripthost', 'es2020'],
      allowJs: true,
      checkJs: true,
      jsx: 'preserve',
      types: ['vite/client'],
      esModuleInterop: true,
      isolatedModules: true,
      resolveJsonModule: true,
      skipLibCheck: true,
    },
    exclude: [
      `../templates/${template}-typescript/node_modules`,
      `../templates/${template}-typescript/dist`,
    ],
    include: [`../templates/${template}-typescript/**/*`],
  };
  const TSConfigContent = JSON.stringify(config, null, 2);
  await writeFile(tsconfigFilename, TSConfigContent);
  return tsconfigFilename;
}
