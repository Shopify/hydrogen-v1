import semver from 'semver';
import {Env, CheckResult} from '../../../../types';
import addHydrogen from '../../../addons/hydrogen';

const HYDROGEN_MIN_VERSION = '0.0.6';

export async function checkHydrogenVersion({
  workspace,
}: Env): Promise<CheckResult[]> {
  const h2Version = await workspace.hasDependency('@shopify/hydrogen');
  const normalizedVersion = h2Version && semver.coerce(h2Version)?.version;

  return [
    {
      id: 'hydrogen-latest',
      type: 'Dependencies',
      description: 'Has latest hydrogen',
      success:
        h2Version === 'latest' ||
        (typeof normalizedVersion === 'string' &&
          semver.gt(normalizedVersion, HYDROGEN_MIN_VERSION)),
      fix: async (env) => {
        await addHydrogen(env);
      },
    },
  ];
}
