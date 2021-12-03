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

export default function importClientComponent(moduleId: string) {
  const modImport = allClientComponents[moduleId];

  if (!modImport) {
    return Promise.reject(
      new Error(`Could not find client component ${moduleId}`)
    );
  }

  return modImport();
}
