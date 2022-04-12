import handleRequest from './src/App.server';
// eslint-disable-next-line node/no-missing-import
import indexTemplate from './dist/client/index.html?raw';

import setup from '../test-utils/worker-entry';

setup({handleRequest, indexTemplate});
