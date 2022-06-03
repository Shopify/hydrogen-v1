import {generateSubRequestCacheControlHeader} from '../cache-sub-request';
import {CacheSeconds, NoStore} from '../strategies';

describe('generateSubRequestCacheControlHeader', () => {
  it('generates CacheSeconds caching strategy by default', () => {
    const header = generateSubRequestCacheControlHeader();

    expect(header).toBe('public, max-age=1, stale-while-revalidate=9');
  });

  it('override to private', () => {
    const header = generateSubRequestCacheControlHeader(
      CacheSeconds({
        mode: 'private',
      })
    );

    expect(header).toBe('private, max-age=1, stale-while-revalidate=9');
  });

  it('supports no-store', () => {
    const header = generateSubRequestCacheControlHeader(NoStore());

    expect(header).toBe('no-store');
  });
});
