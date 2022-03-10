import {clientComponentBannedHooks} from './client-component-banned-hooks';
import {serverComponentBannedHooks} from './server-component-banned-hooks';
import {preferImageComponent} from './prefer-image-component';

export const rules: {[key: string]: any} = {
  'client-component-banned-hooks': clientComponentBannedHooks,
  'server-component-banned-hooks': serverComponentBannedHooks,
  'prefer-image-component': preferImageComponent,
};
