import {resolve} from 'path';
import {execSync} from 'child_process';
import {yellow, green, cyan} from 'chalk';
import generateDocs from './generate-docs';

const SHOPIFY_DEV_ROOT_PATH = resolve(process.cwd(), '../shopify-dev');
const log = (str = '') => {
  console.log();

  if (str !== '') {
    console.log(`${cyan('Docs')}   ${str}`);
  }
};

async function run() {
  log('generating documentation files...');

  await generateDocs({generateDocsForShopifyDev: true});

  log('checking for new documentation changes in this release...');

  const [changedDocsFiles, addedDocsFiles] = getModifiedDocsFiles();

  if (changedDocsFiles.length > 0) {
    log(`Detected ${changedDocsFiles.length} files with documentation changes`);

    log(changedDocsFiles.join(`\n    ${yellow('•')}  `));

    log(`Detected ${addedDocsFiles.length} new documentation files`);

    log(addedDocsFiles.join(`\n    ${green('•')}  `));

    const changedDocsFilesForGit = [
      ...changedDocsFiles,
      ...addedDocsFiles,
    ].join(' ');

    const newBranchName = `hydrogen-docs/${Date.now().valueOf()}`;

    createShopifyDevPR({
      branchName: newBranchName,
      files: changedDocsFilesForGit,
    });
  } else {
    log('no documentation changes found.');
  }

  const changedReadmeFiles = getChangedReadMeFiles();

  if (changedReadmeFiles.length > 0) {
    log(`Detected ${changedReadmeFiles.length} README files with changes`);

    const changedReadmeFilesForGit = changedReadmeFiles
      .map((docFilePath) => JSON.stringify(docFilePath))
      .join(' ');

    execSync(`git add ${changedReadmeFilesForGit} -A`);
  }
}

run().catch((error) => log(error));

function getModifiedDocsFiles() {
  const workingTree = execSync(`git status --short`, {
    cwd: SHOPIFY_DEV_ROOT_PATH,
    stdio: ['pipe'],
  })
    .toString()
    .trim()
    .split('\n');

  const changed = workingTree
    .filter((name) => name.startsWith(` M`))
    .map((name) => name.replace(` M `, ''));
  const added = workingTree
    .filter((name) => name.startsWith(`??`))
    .map((name) => name.replace(`?? `, ''));

  return [changed, added];
}

function getChangedReadMeFiles() {
  return execSync(`git diff --cached --name-only`, {
    stdio: ['pipe'],
  })
    .toString()
    .trim()
    .split('\n')
    .filter((filename) => filename.endsWith('README.md'));
}

function createShopifyDevPR({files, branchName}) {
  const execArgs = {
    cwd: SHOPIFY_DEV_ROOT_PATH,
  };

  log(`Creating pull request in shopify-dev with changes`);
  log();
  execSync(`git add ${files} -A`, execArgs);
  execSync(`git checkout -b ${branchName}`, execArgs);
  log();
  execSync(`git add ${files}`, execArgs);
  log();
  execSync(`git commit -m "[generated] docs updates for ${files}"`, execArgs);
  execSync(`git push --set-upstream origin ${branchName}`, execArgs);

  log(
    `Published new branch in shopify-dev at https://github.com/Shopify/shopify-dev/compare/${branchName}?expand=1`
  );
}
