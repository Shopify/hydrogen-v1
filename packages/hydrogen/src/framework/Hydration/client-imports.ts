// Transform relative paths to absolute in order
// to match component IDs from ClientMarker.
function normalizeComponentPaths(
  componentObject: Record<string, undefined | (() => Promise<any>)>,
  prefix: string
) {
  return Object.entries(componentObject).reduce((acc, [key, value]) => {
    acc[prefix + key.replace(/\.\.\//gm, '')] = value;
    return acc;
  }, {} as typeof componentObject);
}

// These strings are replaced in a plugin with real globs
// and paths that depend on the user project structure.
const allClientComponents = {
  ...normalizeComponentPaths(
    // @ts-ignore
    import.meta.glob('__LIB_COMPONENTS_GLOB__'),
    `__LIB_COMPONENTS_PREFIX__`
  ),
  ...normalizeComponentPaths(
    // @ts-ignore
    import.meta.glob('__USER_COMPONENTS_GLOB__'),
    `__USER_COMPONENTS_PREFIX__`
  ),
};

const moduleCache = new Map();

function importClientComponent(moduleId: string) {
  const modImport = allClientComponents[moduleId];

  if (!modImport) {
    throw new Error(`Could not find client component ${moduleId}`);
  }

  return modImport();
}

export function preloadClientComponent(id: string) {
  if (moduleCache.has(id)) return;

  function cacheResult<T = Promise<unknown> | unknown>(mod: T) {
    moduleCache.set(id, mod);
    return mod;
  }

  // Store the original promise first, then override cache with its result.
  cacheResult(importClientComponent(id)).then(cacheResult, cacheResult);
}

export function getClientComponent(id: string) {
  return moduleCache.get(id);
}
