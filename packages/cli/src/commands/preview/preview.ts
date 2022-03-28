import type {Env} from 'types';
import miniOxygenPreview from '@shopify/mini-oxygen';
import path from 'path';
import vm from 'vm';

export async function preview(env: Env) {
  const {ui, workspace} = env;
  const root = workspace.root();
  const config = {
    ui,
    port: 3000,
    workerFile: path.resolve(root, 'dist/worker/index.js'),
    assetsDir: path.resolve(root, 'dist/client'),
    watch: false,
    buildCommand: 'yarn build',
    autoReload: false,
    modules: true,
    env: {},
  };

  if ('SourceTextModule' in vm) {
    // SourceTextModule is only available when running node with the --experimental-vm-modules flag
    miniOxygenPreview(config);
  } else {
    throw new Error("Preview command requires module support via node's --experimental-vm-modules flag");
  }
}
