import {noStateInServerComponents} from './no-state-in-server-components';
import {noEffectsInServerComponents} from './no-effects-in-server-components';
import {preferImageComponent} from './prefer-image-component';
import {preferUseQuery} from './prefer-use-query';

export const rules: {[key: string]: any} = {
  'no-effects-in-server-components': noEffectsInServerComponents,
  'no-state-in-server-components': noStateInServerComponents,
  'prefer-image-component': preferImageComponent,
  'prefer-use-query': preferUseQuery,
};
