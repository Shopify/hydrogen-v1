import {TemplateOptions} from 'types';

export default function ({storeDomain, storefrontToken}: TemplateOptions) {
  return `
module.exports = {
  locale: 'en-us',
  storeDomain: '${storeDomain}',
  storefrontToken: '${storefrontToken}',
  graphqlApiVersion: 'unstable',
};
`;
}
