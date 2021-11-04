export enum Feature {
  Pwa = 'Progressive Web App (PWA)',
  Eslint = 'JavaScript/TypeScript linting (ESlint)',
  Stylelint = 'CSS linting (Stylelint)',
  Tailwind = 'Tailwind CSS',
  GraphQL = 'Graphql',
  Prettier = 'Prettier',
  CustomServer = 'Custom server (express)',
}

export interface FeatureOption {
  name: string;
  value: Feature;
}

export function ifFeature(allFeatures: Feature[]) {
  return (testFeature: Feature, output: string) =>
    allFeatures.includes(testFeature) ? output : '';
}
