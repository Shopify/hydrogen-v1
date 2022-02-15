import {TemplateOptions} from 'types';

export default function ({storeDomain, storefrontToken}: TemplateOptions) {
  return `
module.exports = {
  storeDomain: '${storeDomain}',
  storefrontToken: '${storefrontToken}',
  storefrontApiVersion: '2022-01',
};
`;
}
