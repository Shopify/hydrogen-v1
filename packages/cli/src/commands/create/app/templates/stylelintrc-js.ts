import {Feature} from '../../../../utilities/feature';
import {TemplateOptions} from '../../../../types';

export default function ({features, ifFeature}: TemplateOptions) {
  const tailwindRules = ifFeature(
    Feature.Tailwind,
    `'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],`
  );

  const extendedConfigs = [
    `'@shopify/stylelint-plugin'`,
    `'@shopify/stylelint-plugin/prettier'`,
  ];

  return `
module.exports = {
  extends: [${extendedConfigs.join(', ')}],
  rules: {
    ${tailwindRules}
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['model-viewer'],
      },
    ],
  },
};
`;
}
