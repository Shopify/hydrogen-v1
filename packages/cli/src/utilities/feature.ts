export enum Feature {
  Tailwind = 'Tailwind CSS',
  TypeScript = 'TypeScript',
}

export interface FeatureOption {
  name: string;
  value: Feature;
}

export function ifFeature(allFeatures: Feature[]) {
  return (testFeature: Feature, output: string) =>
    allFeatures.includes(testFeature) ? output : '';
}
