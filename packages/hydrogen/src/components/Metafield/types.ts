import {Metafield} from '../../storefront-api-types';

export type MetafieldType = Omit<Partial<Metafield>, 'value'> & {
  value?: string | number | boolean | Date | Record<string, any>;
};
