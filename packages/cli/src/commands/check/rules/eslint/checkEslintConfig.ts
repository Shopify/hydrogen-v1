import {Env, CheckResult} from '../../../../types';
import addEslint from '../../../addons/eslint';

export async function checkEslintConfig({
  workspace,
}: Env): Promise<CheckResult[]> {
  const eslintConfig = await workspace.getConfig('eslint');

  const hasEslintConfig = Boolean(eslintConfig);

  const hasHydrogenConfig =
    hasEslintConfig &&
    Boolean(
      eslintConfig.extends?.filter((extended: string) =>
        extended.includes('plugin:hydrogen')
      ).length
    );

  const hasHydrogenEslintPackage = Boolean(
    await workspace.hasDependency('eslint-plugin-hydrogen')
  );

  return [
    {
      id: 'eslint-config',
      type: 'Setup',
      description: 'Has eslint config',
      success: hasEslintConfig,
      link: 'https://shopify.dev/custom-storefronts/hydrogen/lint',
      fix: async (env) => {
        await addEslint(env);
      },
    },
    {
      id: 'eslint-config-hydrogen',
      type: 'Setup',
      description: 'Has hydrogen eslint config',
      success: hasHydrogenConfig && hasHydrogenEslintPackage,
      link: 'https://shopify.dev/custom-storefronts/hydrogen/lint',
      fix: async (env) => {
        await addEslint(env);
      },
    },
  ];
}
