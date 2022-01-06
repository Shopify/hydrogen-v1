type ComponentMap = Record<string, undefined | (() => Promise<any>)>;

// Transform relative paths to absolute in order
// to match component IDs from ClientMarker.
// @ts-ignore
function normalizeComponentPaths(
  componentObject: ComponentMap,
  prefix: string
) {
  const fixComponentPath = prefix.endsWith('components/');

  return Object.entries(componentObject).reduce((acc, [key, value]) => {
    const noPrefix = key.replace(/\.\.\//gm, '');
    acc[prefix + (fixComponentPath ? noPrefix.substring(11) : noPrefix)] =
      value;
    return acc;
  }, {} as typeof componentObject);
}

// These strings are replaced in a plugin with real globs
// and paths that depend on the user project structure.
const allClientComponents: ComponentMap = {};

export default function importClientComponent(moduleId: string) {
  const modImport = allClientComponents[moduleId];

  if (!modImport) {
    debugger;
    return Promise.reject(
      new Error(`Could not find client component "${moduleId}"`)
    );
  }

  return modImport();
}

// Import globs will be appended to the end of this file automatically in the plugin.
