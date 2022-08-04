import type {ImportGlobEagerOutput} from '../../types.js';
import {createRoutes, mergeRouteSets} from '../routes.js';

const STUB_MODULE_COMPONENT_ONLY = {default: {}, api: null};
const STUB_MODULE_API_ONLY = {default: null, api: {}};
const STUB_MODULE_ALL = {default: {}, api: {}};

describe('Page routes', () => {
  it('converts normal pages to routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({
      files,
      basePath: '*',
      dirPrefix: './routes',
    });

    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
    ]);
  });

  it('handles index pages', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
    ]);
  });

  it('handles nested index pages', () => {
    const files: ImportGlobEagerOutput = {
      './routes/products/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/blogs/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/products/snowboards/fastones/index.server.jsx':
        STUB_MODULE_COMPONENT_ONLY,
      './routes/articles/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/articles/[...handle].server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes', sort: true});

    expect(routes).toEqual([
      {
        path: '/products',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/blogs',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/products/snowboards/fastones',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/articles',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/products/:handle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/articles/:handle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: false,
      },
    ]);
  });

  it('handles dynamic paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});
    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/products/:handle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
    ]);
  });

  it('handles catch all routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/products/[...handle].server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});
    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/products/:handle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: false,
      },
    ]);
  });

  it('handles nested dynamic paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/blogs/[handle]/[articleHandle].server.jsx':
        STUB_MODULE_COMPONENT_ONLY,
      './routes/blogs/[handle]/[...articleHandle].server.jsx':
        STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/products/:handle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/blogs/:handle/:articleHandle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/blogs/:handle/:articleHandle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: false,
      },
    ]);
  });

  it('prioritizes overrides next to dynamic paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_COMPONENT_ONLY,
      // Alphabetically, `hoodie` will likely come after `[handle]`
      './routes/products/hoodie.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/blogs/[handle]/[articleHandle].server.jsx':
        STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes', sort: true});

    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      // But in the routes, it needs to come first!
      {
        path: '/products/hoodie',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/products/:handle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/blogs/:handle/:articleHandle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
    ]);
  });

  it('handles typescript paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.tsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
    ]);
  });

  it('lowercases routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/Contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
    ]);
  });

  it('factors in the top-level path prefix', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({
      files,
      basePath: '/foo/*',
      dirPrefix: './routes',
    });

    expect(routes).toEqual([
      {
        path: '/foo/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '/foo',
        exact: true,
      },
      {
        path: '/foo/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '/foo',
        exact: true,
      },
    ]);
  });

  it('uses a custom file directory path', () => {
    const files: ImportGlobEagerOutput = {
      './custom/contact.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './custom/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './custom'});

    expect(routes).toEqual([
      {
        path: '/contact',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
      },
    ]);
  });
});

describe('API routes', () => {
  it('converts API functions to routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('handles index API routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/contact.server.jsx': STUB_MODULE_API_ONLY,
      './routes/api/index.server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/api',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('handles nested index API routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/products/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_API_ONLY,
      './routes/blogs/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/products/snowboards/fastones/index.server.jsx':
        STUB_MODULE_API_ONLY,
      './routes/articles/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/articles/[...handle].server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes', sort: true});

    expect(routes).toEqual([
      {
        path: '/products',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/blogs',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/products/snowboards/fastones',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/articles',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/products/:handle',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/articles/:handle',
        exact: false,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('handles dynamic paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_API_ONLY,
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});
    expect(routes).toEqual([
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/products/:handle',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('handles catch all routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_API_ONLY,
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/products/[...handle].server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});
    expect(routes).toEqual([
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/products/:handle',
        exact: false,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('handles nested dynamic paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_API_ONLY,
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_API_ONLY,
      './routes/blogs/[handle]/[articleHandle].server.jsx':
        STUB_MODULE_API_ONLY,
      './routes/blogs/[handle]/[...articleHandle].server.jsx':
        STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/products/:handle',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/blogs/:handle/:articleHandle',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/blogs/:handle/:articleHandle',
        exact: false,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('prioritizes overrides next to dynamic paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_API_ONLY,
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_API_ONLY,
      // Alphabetically, `hoodie` will likely come after `[handle]`
      './routes/products/hoodie.server.jsx': STUB_MODULE_API_ONLY,
      './routes/blogs/[handle]/[articleHandle].server.jsx':
        STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes', sort: true});

    expect(routes).toEqual([
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      // But in the routes, it needs to come first!
      {
        path: '/products/hoodie',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/products/:handle',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/blogs/:handle/:articleHandle',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('handles typescript paths', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.tsx': STUB_MODULE_API_ONLY,
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('lowercases routes', () => {
    const files: ImportGlobEagerOutput = {
      './routes/Contact.server.jsx': STUB_MODULE_API_ONLY,
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({files, dirPrefix: './routes'});

    expect(routes).toEqual([
      {
        path: '/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
      {
        path: '/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
      },
    ]);
  });

  it('factors in the top-level path prefix', () => {
    const files: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_API_ONLY,
      './routes/index.server.jsx': STUB_MODULE_API_ONLY,
    };

    const routes = createRoutes({
      files,
      basePath: '/foo/*',
      dirPrefix: './routes',
    });

    expect(routes).toEqual([
      {
        path: '/foo/contact',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '/foo',
      },
      {
        path: '/foo/',
        exact: true,
        resource: STUB_MODULE_API_ONLY,
        basePath: '/foo',
      },
    ]);
  });
});

describe.only('Merging route sets', () => {
  it('merges different sets of routes and sorts them accordingly', () => {
    const userFiles: ImportGlobEagerOutput = {
      './routes/contact.server.jsx': STUB_MODULE_ALL,
      './routes/index.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/products/[handle].server.jsx': STUB_MODULE_API_ONLY,
      './routes/products/hoodie.server.jsx': STUB_MODULE_COMPONENT_ONLY,
      './routes/blogs/[handle]/[articleHandle].server.jsx': STUB_MODULE_ALL,
    };

    const pluginFiles: ImportGlobEagerOutput = {
      './node_modules/test-plugin/routes/products/[handle].server.jsx':
        STUB_MODULE_COMPONENT_ONLY,
      './node_modules/test-plugin/routes/blogs/[handle]/[articleHandle].server.jsx':
        STUB_MODULE_COMPONENT_ONLY,
    };

    const mergedRoutes = mergeRouteSets({
      default: {files: userFiles, dirPrefix: './routes'},
      plugin: {
        files: pluginFiles,
        dirPrefix: './node_modules/test-plugin/routes',
      },
    });

    expect(mergedRoutes).toEqual([
      // 1. Alphabetically
      {
        path: '/',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
        app: true,
      },
      {
        path: '/contact',
        resource: STUB_MODULE_ALL,
        basePath: '',
        exact: true,
        app: true,
      },
      // 2. Specific routes before dynamic routes
      {
        path: '/products/hoodie',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
        app: true,
      },
      // 3. Prioritize user routes if both have server components
      {
        path: '/blogs/:handle/:articleHandle',
        resource: STUB_MODULE_ALL,
        basePath: '',
        exact: true,
        app: true,
      },
      {
        path: '/blogs/:handle/:articleHandle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
        app: false,
      },
      // 4. Prioritize routes with server components
      {
        path: '/products/:handle',
        resource: STUB_MODULE_COMPONENT_ONLY,
        basePath: '',
        exact: true,
        app: false,
      },
      {
        path: '/products/:handle',
        resource: STUB_MODULE_API_ONLY,
        basePath: '',
        exact: true,
        app: true,
      },
    ]);
  });
});
