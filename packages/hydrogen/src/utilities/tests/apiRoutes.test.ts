//getAPI
import {ImportGlobEagerOutput} from '../../types';
import {getApiRoutes} from '../apiRoutes';

const STUB_MODULE = {default: null, api: {}};

it('handles index API routes', () => {
  const pages: ImportGlobEagerOutput = {
    './routes/index.server.jsx': STUB_MODULE,
    './routes/contact.server.jsx': STUB_MODULE,
    './routes/api/index.server.jsx': STUB_MODULE,
  };

  const routes = getApiRoutes(pages, '*');

  expect(routes).toEqual([
    {
      path: '/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/api',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});
