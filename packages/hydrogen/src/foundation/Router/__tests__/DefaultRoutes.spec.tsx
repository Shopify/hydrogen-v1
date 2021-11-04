import {createRoutesFromPages, ImportGlobEagerOutput} from '../DefaultRoutes';

const STUB_MODULE = {default: {}};

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
