import semver from 'semver';
import {Env, CheckResult} from '../../../../types';

const NODE_MIN_VERSION = '>=12.0.0';

export async function checkNodeVersion({
  workspace,
}: Env): Promise<CheckResult[]> {
  const nodeVersion = await workspace.nodeVersion();
  const normalizedVersion = semver.coerce(nodeVersion)?.version;

  return [
    {
      id: 'node-version',
      type: 'Dependencies',
      description: 'Has min node version',
      success:
        !nodeVersion ||
        (normalizedVersion !== undefined &&
          semver.satisfies(normalizedVersion, NODE_MIN_VERSION)),
      link: 'https://shopify.dev/custom-storefronts/hydrogen/support',
    },
  ];
}
