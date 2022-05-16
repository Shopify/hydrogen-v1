import {findRoutePrefix} from '../findRoutePrefix';

describe('findRoutePrefix', () => {
  it('provides a default value if no common prefix is found', () => {
    expect(findRoutePrefix(['./first.jsx'])).toBeInstanceOf(RegExp);

    expect(
      findRoutePrefix(['./first.jsx', './second.jsx', './third.jsx'])
    ).toBeInstanceOf(RegExp);
  });

  it('does not provide a prefix when routes are absolute', () => {
    expect(findRoutePrefix(['/api/hello', '/api/world'])).toEqual('');
  });

  it('finds a common route prefix', () => {
    expect(
      findRoutePrefix([
        './src/pages/first.jsx',
        './src/pages/second.jsx',
        './src/pages/deep/third.jsx',
      ])
    ).toEqual('./src/pages');

    expect(
      findRoutePrefix([
        './pages/first.jsx',
        './pages/second.jsx',
        './pages/deep/third.jsx',
      ])
    ).toEqual('./pages');

    expect(
      findRoutePrefix([
        './routes/products/index.server.jsx',
        './routes/products/[handle].server.jsx',
        './routes/blogs/index.server.jsx',
        './routes/products/snowboards/fastones/index.server.jsx',
        './routes/articles/index.server.jsx',
        './routes/articles/[...handle].server.jsx',
      ])
    ).toEqual('./routes');
  });
});
