import {clientComponentBannedHooks} from './client-component-banned-hooks';
import {serverComponentBannedHooks} from './server-component-banned-hooks';
import {preferImageComponent} from './prefer-image-component';
import {preferScriptComponent} from './prefer-script-component';
import {serverNoJsonParse} from './server-no-json-parse';
import {preferGQL} from './prefer-gql';
import {noScriptCallbacksInServerComponents} from './no-script-callbacks-in-server-components';
import {scriptsInLayoutComponents} from './scripts-in-layout-components';

export const rules: {[key: string]: any} = {
  'client-component-banned-hooks': clientComponentBannedHooks,
  'server-component-banned-hooks': serverComponentBannedHooks,
  'prefer-image-component': preferImageComponent,
  'prefer-script-component': preferScriptComponent,
  'server-no-json-parse': serverNoJsonParse,
  'prefer-gql': preferGQL,
  'no-script-callbacks-in-server-components':
    noScriptCallbacksInServerComponents,
  'scripts-in-layout-components': scriptsInLayoutComponents,
};
