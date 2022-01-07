import {generateCacheControlHeader} from '../cache';

describe('generateCacheControlHeader', () => {
  it('defaults to public', () => {
    const header = generateCacheControlHeader({
      maxAge: 100,
      staleWhileRevalidate: 50,
    });

    expect(header).toBe('public, max-age=100, stale-while-revalidate=50');
  });

  it('override to private', () => {
    const header = generateCacheControlHeader({
      maxAge: 100,
      staleWhileRevalidate: 50,
      private: true,
    });

    expect(header).toBe('private, max-age=100, stale-while-revalidate=50');
  });

  it('supports no-store', () => {
    const header = generateCacheControlHeader({
      noStore: true,
    });

    expect(header).toBe('no-store');
  });
});
