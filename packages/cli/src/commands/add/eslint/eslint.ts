import {Env} from '../../../types';

export async function addEslint(env: Env) {
  const {workspace, fs} = env;

  await fs.write(
    fs.join(workspace.root(), '.eslintrc.js'),
    (await import('./templates/eslintrc-js')).default()
  );
  workspace.install('eslint', {dev: true, version: '^7.31.0'});
  workspace.install('eslint-plugin-hydrogen', {dev: true, version: '^0.6.2'});
}
