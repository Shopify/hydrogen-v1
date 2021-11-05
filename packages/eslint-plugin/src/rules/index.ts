import {noStateInServerComponents} from './no-state-in-server-components';
import {preferImageComponent} from './prefer-image-component';

export const rules: {[key: string]: any} = {
  'no-state-in-server-components': noStateInServerComponents,
  'prefer-image-component': preferImageComponent,
};
