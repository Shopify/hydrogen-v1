/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace globalThis {
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
  globalThis.__ctx = ctx;
}

export function getContext() {
  return globalThis.__ctx;
}

export function setCache(cache?: Cache) {
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
    return fn();
  }

  return context.waitUntil(fn());
}
