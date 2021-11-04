import {parse, join} from 'path';
import {ESLintUtils} from '@typescript-eslint/experimental-utils';

export * from './react';

const PACKAGE_JSON = require('../../package.json');
const REPO = getRepoFromPackageJson(PACKAGE_JSON);

export const createRule = ESLintUtils.RuleCreator((name) => {
  const ruleName = parse(name).name;
  return `${REPO}/blob/v${PACKAGE_JSON.version}/packages/eslint-plugin/src/rules/${ruleName}/README.md`;
});

function getRepoFromPackageJson(pkg: any) {
  const repoPathParts = parse(pkg.repository.url);

  return join(repoPathParts.dir, repoPathParts.name, pkg.repository.directory);
}
