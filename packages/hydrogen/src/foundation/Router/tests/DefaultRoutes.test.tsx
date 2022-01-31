import {createRoutesFromPages} from '../DefaultRoutes';
import {ImportGlobEagerOutput} from '../../../types';
import {Logger} from '../../..';

const STUB_MODULE = {default: {}, api: null};

it('converts normal pages to routes', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
  ]);
});

it('handles index pages', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ]);
});

it('handles nested index pages', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/products/index.server.jsx': STUB_MODULE,
    './pages/products/[handle].server.jsx': STUB_MODULE,
    './pages/blogs/index.server.jsx': STUB_MODULE,
    './pages/products/snowboards/fastones/index.server.jsx': STUB_MODULE,
    './pages/articles/index.server.jsx': STUB_MODULE,
    './pages/articles/[...handle].server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);

  expect(routes).toEqual([
    {
      path: '/products',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/snowboards/fastones',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/articles',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/articles/:handle',
      component: STUB_MODULE.default,
      exact: false,
    },
  ]);
});

it('handles dynamic paths', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
    './pages/products/[handle].server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);
  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
  ]);
});

it('handles catch all routes', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
    './pages/products/[...handle].server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);
  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: false,
    },
  ]);
});

it('handles nested dynamic paths', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
    './pages/products/[handle].server.jsx': STUB_MODULE,
    './pages/blogs/[handle]/[articleHandle].server.jsx': STUB_MODULE,
    './pages/blogs/[handle]/[...articleHandle].server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs/:handle/:articleHandle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs/:handle/:articleHandle',
      component: STUB_MODULE.default,
      exact: false,
    },
  ]);
});

it('prioritizes overrides next to dynamic paths', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
    './pages/products/[handle].server.jsx': STUB_MODULE,
    // Alphabetically, `hoodie` will likely come after `[handle]`
    './pages/products/hoodie.server.jsx': STUB_MODULE,
    './pages/blogs/[handle]/[articleHandle].server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
    // But in the routes, it needs to come first!
    {
      path: '/products/hoodie',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/products/:handle',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/blogs/:handle/:articleHandle',
      component: STUB_MODULE.default,
      exact: true,
    },
  ]);
});

it('handles typescript paths', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.tsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ]);
});

it('lowercases routes', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/Contact.server.jsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages);

  expect(routes).toEqual([
    {
      path: '/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ]);
});

it('factors in the top-level path prefix', () => {
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': STUB_MODULE,
    './pages/index.server.jsx': STUB_MODULE,
  };

  const routes = createRoutesFromPages(pages, '/foo/*');

  expect(routes).toEqual([
    {
      path: '/foo/contact',
      component: STUB_MODULE.default,
      exact: true,
    },
    {
      path: '/foo/',
      component: STUB_MODULE.default,
      exact: true,
    },
  ]);
});

it("errors routes don't have a default or api export", () => {
  const log: Logger = {...console, fatal: jest.fn(), warn: jest.fn()};
  const pages: ImportGlobEagerOutput = {
    './pages/contact.server.jsx': {} as any,
  };

  createRoutesFromPages(pages, '*', log);

  expect(log.warn).toBeCalledWith(
    `./pages/contact.server.jsx doesn't export a default React component or an API function`
  );
});
