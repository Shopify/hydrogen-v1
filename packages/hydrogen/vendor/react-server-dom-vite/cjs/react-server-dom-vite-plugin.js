/**
 * @license React
 * react-server-dom-vite-plugin.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

'use strict';

var esModuleLexer = require('es-module-lexer');
var vite = require('vite');
var fs = require('fs');
var path = require('path');

// $FlowFixMe[module-missing]
var rscViteFileRE = /\/react-server-dom-vite.js/;
function ReactFlightVitePlugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isServerComponen = _ref.isServerComponentImporterAllowed,
      isServerComponentImporterAllowed = _ref$isServerComponen === void 0 ? function (importer) {
    return false;
  } : _ref$isServerComponen,
      _ref$isClientComponen = _ref.isClientComponent,
      isClientComponent = _ref$isClientComponen === void 0 ? function (id) {
    return /\.client\.[jt]sx?($|\?)/.test(id);
  } : _ref$isClientComponen,
      findClientComponentsForDev = _ref.findClientComponentsForDev,
      findClientComponentsForClientBuild = _ref.findClientComponentsForClientBuild;

  var config;
  var server;
  var timeout;
  var absoluteImporterPath;
  var discoveredClientComponents = [];

  if (!findClientComponentsForDev) {
    findClientComponentsForDev = function () {
      return Array.from(server.moduleGraph.fileToModulesMap.keys()).filter(isClientComponent);
    };
  }

  return {
    name: 'vite-plugin-react-server-components',
    enforce: 'pre',
    configureServer: function (_server) {
      server = _server;
    },
    configResolved: async function (_config) {
      config = _config; // By pushing this plugin at the end of the existing array,
      // we enforce running it *after* Vite resolves import.meta.glob.

      config.plugins.push(hashImportsPlugin);

      if (config.command === 'build' && !config.build.ssr) {
        if (findClientComponentsForClientBuild) {
          discoveredClientComponents = await findClientComponentsForClientBuild(config);
        } else {
          throw new Error('[react-server-dom-vite] Parameter findClientComponentsForClientBuild is required for client build');
        }
      }
    },
    resolveId: async function (source, importer) {
      if (!importer) return null;
      /**
       * Throw errors when non-Server Components try to load Server Components.
       */

      if (/\.server(\.[jt]sx?)?$/.test(source) && !(/(\.server\.[jt]sx?|entry-server\.[jt]sx?|index\.html)$/.test(importer) || isServerComponentImporterAllowed(importer, source))) {
        throw new Error("Cannot import " + source + " from \"" + importer + "\". " + 'By react-server convention, .server.js files can only be imported from other .server.js files. ' + 'That way nobody accidentally sends these to the client by indirectly importing it.');
      }
    },
    load: async function (id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!options.ssr) return null; // Wrapped components won't match this becase they end in ?no-proxy

      if (isClientComponent(id) && !/[&?]no-proxy($|&)/.test(id)) {
        // Refresh the list of discovered client components
        // every time a new one is processed.
        if (config.command === 'serve') {
          clearTimeout(timeout);
          timeout = setTimeout(async function () {
            discoveredClientComponents = findClientComponentsForDev ? await findClientComponentsForDev(config, server) : [];

            if (absoluteImporterPath) {
              // Signal Vite that this file needs to be
              // refreshed both in server and browser.
              server.watcher.emit('change', absoluteImporterPath);
            }
          }, 100);
        }

        return proxyClientComponent(id);
      }

      return null;
    },
    transform: function (code, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      /**
       * In order to allow dynamic component imports from RSC, we use Vite's import.meta.glob.
       * This hook replaces the glob placeholders with resolved paths to all client components.
       *
       * NOTE: Glob import paths MUST be relative to the importer file in
       * order to get the `?v=xxx` querystring from Vite added to the import URL.
       * If the paths are relative to the root instead, Vite won't add the querystring
       * and we will have duplicated files in the browser (with duplicated contexts, etc).
       */
      if (rscViteFileRE.test(id)) {
        var INJECTING_RE = /\{\s*__INJECTED_CLIENT_IMPORTERS__[:\s]*null[,\s]*\}\s*;/;
        absoluteImporterPath = id.split('?')[0];

        if (options && options.ssr) {
          // In SSR, directly use components already discovered by RSC
          // instead of globs to avoid bundling unused components.
          return code.replace(INJECTING_RE, 'globalThis.__COMPONENT_INDEX');
        }

        var importerPath = path.dirname(id);
        var importers = discoveredClientComponents.map(function (absolutePath) {
          return vite.normalizePath(path.relative(importerPath, absolutePath));
        });
        var injectedGlobs = "Object.assign(Object.create(null), " + importers.map(function (glob) {
          return (// Mark the globs to modify the result after Vite resolves them.
            "/* HASH_BEGIN */ " + ("import.meta.glob('" + vite.normalizePath(glob) + "') /* HASH_END */")
          );
        }).join(', ') + ");";
        return code.replace(INJECTING_RE, injectedGlobs);
      }
    }
  };
}

var btoa = function (hash) {
  return (// eslint-disable-next-line react-internal/safe-string-coercion
    Buffer.from(String(hash), 'binary').toString('base64')
  );
}; // Quick, lossy hash function: https://stackoverflow.com/a/8831937/4468962
// Prevents leaking path information in the browser, and minifies RSC responses.


function hashCode(value) {
  var hash = 0;

  for (var i = 0; i < value.length; i++) {
    var char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }

  return btoa(hash).replace(/=+/, '');
}

var getComponentFilename = function (filepath) {
  return filepath.split('/').pop().split('.').shift();
};

var getComponentId = function (filepath) {
  return getComponentFilename(filepath) + "-" + hashCode(filepath);
};
async function proxyClientComponent(filepath, src) {
  var DEFAULT_EXPORT = 'default'; // Modify the import ID to avoid infinite wraps

  var importFrom = filepath + "?no-proxy";
  await esModuleLexer.init;

  if (!src) {
    src = await fs.promises.readFile(filepath, 'utf-8');
  }

  var _await$transformWithE = await vite.transformWithEsbuild(src, filepath),
      code = _await$transformWithE.code;

  var _parse = esModuleLexer.parse(code),
      exportStatements = _parse[1];

  var proxyCode = "import {wrapInClientProxy} from 'react-server-dom-vite/client-proxy';\n" + ("import * as allImports from '" + importFrom + "';\n\n"); // Wrap components in Client Proxy

  exportStatements.forEach(function (key) {
    var isDefault = key === DEFAULT_EXPORT;
    var componentName = isDefault ? getComponentFilename(filepath) : key;
    proxyCode += "export " + (isDefault ? DEFAULT_EXPORT : "const " + componentName + " =") + " wrapInClientProxy({ name: '" + componentName + "', id: '" + getComponentId(filepath) + "', value: allImports['" + key + "'], isDefault: " + // eslint-disable-next-line react-internal/safe-string-coercion
    String(isDefault) + " });\n";
  });
  return proxyCode;
}
var hashImportsPlugin = {
  name: 'vite-plugin-react-server-components-hash-imports',
  enforce: 'post',
  transform: function (code, id) {
    // Turn relative import paths to lossy hashes
    if (rscViteFileRE.test(id)) {
      return code.replace(/\/\*\s*HASH_BEGIN\s*\*\/\s*([^]+?)\/\*\s*HASH_END\s*\*\//gm, function (_, imports) {
        return imports.trim().replace(/"([^"]+?)":/gm, function (__, relativePath) {
          var absolutePath = path.resolve(path.dirname(id.split('?')[0]), relativePath);
          return "\"" + getComponentId(vite.normalizePath(absolutePath)) + "\":";
        });
      });
    }
  }
};

module.exports = ReactFlightVitePlugin;
