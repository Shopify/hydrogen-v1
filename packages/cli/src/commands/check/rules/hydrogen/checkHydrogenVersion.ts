import semver from 'semver';
import {Env, CheckResult} from '../../../../types';
import addHydrogen from '../../../add/hydrogen';

export const HYDROGEN_MIN_VERSION =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../../../../package.json').version;

export async function checkHydrogenVersion({
  workspace,
}: Env): Promise<CheckResult[]> {
  const h2Version = await workspace.hasDependency('@shopify/hydrogen');
  const normalizedVersion = h2Version
    ? semver.coerce(h2Version)?.version
    : `@shopify/hydrogen not installed`;
  const latestHydrogen =
    typeof h2Version === 'string' &&
    typeof normalizedVersion === 'string' &&
    semver.gte(normalizedVersion, HYDROGEN_MIN_VERSION);

  const success = h2Version === 'latest' || latestHydrogen;

  const description = success
    ? `Has latest hydrogen version`
    : `Didn’t find latest version of hydrogen (${HYDROGEN_MIN_VERSION}), found ${normalizedVersion}`;

  return [
    {
      id: 'hydrogen-latest',
      type: 'Dependencies',
      description,
      success,
      fix: addHydrogen,
    },
  ];
}
