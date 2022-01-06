import {Env} from '../../../types';

export async function addHydrogen(env: Env) {
  const {workspace} = env;

  workspace.install('@shopify/hydrogen');
}
