import childProcess from 'child_process';
import {join} from 'path';
import {Env} from '../../types';
import {MissingDependencyError} from '../../utilities/error';

export async function dev(env: Env) {
  const {ui, workspace, fs} = env;

  const binPath = join(workspace.root(), `/node_modules/.bin/vite`);

  if (!(await fs.exists(binPath))) {
    throw new MissingDependencyError('vite');
  }

  ui.say('Starting Hydrogen server in dev...');

  childProcess.spawn('node', [binPath], {
    cwd: workspace.root(),
    stdio: 'inherit',
  });
}
