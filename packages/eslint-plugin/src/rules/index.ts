import {noStateInServerComponents} from './no-state-in-server-components';
import {noEffectsInServerComponents} from './no-effects-in-server-components';
import {preferImageComponent} from './prefer-image-component';

export const rules: {[key: string]: any} = {
  'no-effects-in-server-components': noEffectsInServerComponents,
  'no-state-in-server-components': noStateInServerComponents,
  'prefer-image-component': preferImageComponent,
};
