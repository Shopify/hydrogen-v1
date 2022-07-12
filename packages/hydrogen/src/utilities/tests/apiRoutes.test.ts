//getAPI
import {ImportGlobEagerOutput} from '../../types.js';
import {getApiRoutes} from '../apiRoutes.js';

const STUB_MODULE = {default: null, api: {}};

it('converts API functions to routes', () => {
  const files: ImportGlobEagerOutput = {
    './routes/contact.server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});

  expect(routes).toEqual([
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('handles index API routes', () => {
  const files: ImportGlobEagerOutput = {
    './routes/index.server.js': STUB_MODULE,
    './routes/contact.server.js': STUB_MODULE,
    './routes/api/index.server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});

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

it('handles nested index API routes', () => {
  const files: ImportGlobEagerOutput = {
    './routes/products/index.server.js': STUB_MODULE,
    './routes/products/[handle].server.js': STUB_MODULE,
    './routes/blogs/index.server.js': STUB_MODULE,
    './routes/products/snowboards/fastones/index.server.js': STUB_MODULE,
    './routes/articles/index.server.js': STUB_MODULE,
    './routes/articles/[...handle].server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});

  expect(routes).toEqual([
    {
      path: '/products',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/blogs',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/products/snowboards/fastones',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/articles',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/products/:handle',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/articles/:handle',
      exact: false,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('handles dynamic paths', () => {
  const files: ImportGlobEagerOutput = {
    './routes/contact.server.js': STUB_MODULE,
    './routes/index.server.js': STUB_MODULE,
    './routes/products/[handle].server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});
  expect(routes).toEqual([
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/products/:handle',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('handles catch all routes', () => {
  const files: ImportGlobEagerOutput = {
    './routes/contact.server.js': STUB_MODULE,
    './routes/index.server.js': STUB_MODULE,
    './routes/products/[...handle].server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});
  expect(routes).toEqual([
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/products/:handle',
      exact: false,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('handles nested dynamic paths', () => {
  const files: ImportGlobEagerOutput = {
    './routes/contact.server.js': STUB_MODULE,
    './routes/index.server.js': STUB_MODULE,
    './routes/products/[handle].server.js': STUB_MODULE,
    './routes/blogs/[handle]/[articleHandle].server.js': STUB_MODULE,
    './routes/blogs/[handle]/[...articleHandle].server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});

  expect(routes).toEqual([
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/products/:handle',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/blogs/:handle/:articleHandle',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/blogs/:handle/:articleHandle',
      exact: false,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('prioritizes overrides next to dynamic paths', () => {
  const files: ImportGlobEagerOutput = {
    './routes/contact.server.js': STUB_MODULE,
    './routes/index.server.js': STUB_MODULE,
    './routes/products/[handle].server.js': STUB_MODULE,
    // Alphabetically, `hoodie` will likely come after `[handle]`
    './routes/products/hoodie.server.js': STUB_MODULE,
    './routes/blogs/[handle]/[articleHandle].server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});

  expect(routes).toEqual([
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    // But in the routes, it needs to come first!
    {
      path: '/products/hoodie',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/products/:handle',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/blogs/:handle/:articleHandle',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('handles typescript paths', () => {
  const files: ImportGlobEagerOutput = {
    './routes/contact.server.tsx': STUB_MODULE,
    './routes/index.server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});

  expect(routes).toEqual([
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('lowercases routes', () => {
  const files: ImportGlobEagerOutput = {
    './routes/Contact.server.js': STUB_MODULE,
    './routes/index.server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({files, dirPrefix: './routes'});

  expect(routes).toEqual([
    {
      path: '/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});

it('factors in the top-level path prefix', () => {
  const files: ImportGlobEagerOutput = {
    './routes/contact.server.js': STUB_MODULE,
    './routes/index.server.js': STUB_MODULE,
  };

  const routes = getApiRoutes({
    files,
    basePath: '/foo/*',
    dirPrefix: './routes',
  });

  expect(routes).toEqual([
    {
      path: '/foo/contact',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
    {
      path: '/foo/',
      exact: true,
      hasServerComponent: false,
      resource: {},
    },
  ]);
});
