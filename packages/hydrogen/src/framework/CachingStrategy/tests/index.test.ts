import {
  generateCacheControlHeader,
  NoStore,
  CacheSeconds,
  CacheMinutes,
  CacheHours,
  CacheDays,
  CacheWeeks,
  CacheMonths,
  CacheCustom,
} from '..';

const expectedResultMapping: any = {
  CacheSeconds: {
    method: CacheSeconds,
    header: 'public, max-age=1, stale-while-revalidate=9',
  },
  CacheMinutes: {
    method: CacheMinutes,
    header: 'public, max-age=900, stale-while-revalidate=900',
  },
  CacheHours: {
    method: CacheHours,
    header: 'public, max-age=1800, stale-while-revalidate=1800',
  },
  CacheDays: {
    method: CacheDays,
    header: 'public, max-age=3600, stale-while-revalidate=82800',
  },
  CacheWeeks: {
    method: CacheWeeks,
    header: 'public, max-age=604800, stale-while-revalidate=604800',
  },
  CacheMonths: {
    method: CacheMonths,
    header: 'public, max-age=1296000, stale-while-revalidate=1296000',
  },
};

describe('CachingStrategy', () => {
  it('should generate the expected cache control header when NoStore is used', () => {
    expect(generateCacheControlHeader(NoStore())).toEqual('no-store');
  });

  Object.keys(expectedResultMapping).forEach((methodName) => {
    const testFunction = expectedResultMapping[methodName];
    it(`should generate the expected cache control header when ${methodName} is used`, () => {
      expect(generateCacheControlHeader(testFunction.method())).toEqual(
        testFunction.header
      );
    });

    it(`should generate the expected cache control header when ${methodName} override options is used`, () => {
      expect(
        generateCacheControlHeader(
          testFunction.method({
            mode: 'private',
            maxAge: 2,
            staleWhileRevalidate: 18,
            staleIfError: 18,
          })
        )
      ).toEqual(
        'private, max-age=2, stale-while-revalidate=18, stale-if-error=18'
      );
    });

    it(`should throw error when ${methodName} override mode with something else other than private or public`, () => {
      try {
        testFunction.method({
          mode: 'no-store',
        });
      } catch (error: any) {
        expect(error.message).toEqual(
          "'mode' must be either 'public' or 'private'"
        );
      }
    });
  });

  it('should generate the expected cache control header when CacheCustom is used', () => {
    expect(
      generateCacheControlHeader(
        CacheCustom({
          mode: 'public, must-revalidate',
          maxAge: 10,
        })
      )
    ).toEqual('public, must-revalidate, max-age=10');
  });
});
