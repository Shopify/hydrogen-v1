import {TemplateOptions} from 'types';

export default function ({storeDomain, storefrontToken}: TemplateOptions) {
  return `
const shopifyConfig  = {
  locale: 'en-us',
  storeDomain: '${storeDomain}',
  storefrontToken: '${storefrontToken}',
  graphqlApiVersion: 'unstable',
};

export default shopifyConfig
`;
}
