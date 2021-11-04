declare module globalThis {
  var __ctx: RuntimeContext | undefined;
  var __cache: Cache | undefined;
}

export interface RuntimeContext {
  waitUntil: (fn: Promise<any>) => void;
}

/**
 * Set a global runtime context for the current request.
 * This is used to encapsulate things like:
 * - `waitUntil()` to run promises after request has ended
 */
export function setContext(ctx?: RuntimeContext) {
  console.log('[setContext]');
  globalThis.__ctx = ctx;
}

export function getContext() {
  return globalThis.__ctx;
}

export function setCache(cache?: Cache) {
  console.log('[setCache]');
  globalThis.__cache = cache;
}

export function getCache(): Cache | undefined {
  return globalThis.__cache;
}

export function runDelayedFunction(fn: () => Promise<any>) {
  const context = getContext();

  /**
   * Runtimes (Oxygen, Node.js) might not have this.
   */
  if (!context?.waitUntil) {
    console.log('[runDelayedFunction] no waitUntil available');
    return fn();
  }

  console.log('[runDelayedFunction] running delayed function using waitUntil');
  return context.waitUntil(fn());
}
