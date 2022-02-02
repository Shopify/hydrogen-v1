/** @license React vundefined
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
function ReactFlightVitePlugin() {
  var _ref =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$clientComponentP = _ref.clientComponentPaths,
    clientComponentPaths =
      _ref$clientComponentP === void 0 ? [] : _ref$clientComponentP,
    _ref$isServerComponen = _ref.isServerComponentImporterAllowed,
    isServerComponentImporterAllowed =
      _ref$isServerComponen === void 0
        ? function (importer) {
            return false;
          }
        : _ref$isServerComponen;

  var config;
  return {
    name: 'vite-plugin-react-server-components',
    enforce: 'pre',
    configResolved: function (_config) {
      config = _config;
    },
    resolveId: async function (source, importer) {
      if (!importer) return null;
      /**
       * Throw errors when non-Server Components try to load Server Components.
       */

      if (
        /\.server(\.[jt]sx?)?$/.test(source) &&
        !(
          /(\.server\.[jt]sx?|entry-server\.[jt]sx?|index\.html)$/.test(
            importer
          ) || isServerComponentImporterAllowed(importer, source)
        )
      ) {
        throw new Error(
          'Cannot import ' +
            source +
            ' from "' +
            importer +
            '". ' +
            'By react-server convention, .server.js files can only be imported from other .server.js files. ' +
            'That way nobody accidentally sends these to the client by indirectly importing it.'
        );
      }
    },
    load: async function (id) {
      var options =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!options.ssr) return null; // Wrapped components won't match this becase they end in ?no-proxy

      if (/\.client\.[jt]sx?$/.test(id)) {
        return proxyClientComponent(id);
      }

      return null;
    },
    transform: function (code, id, options) {
      /**
       * In order to allow dynamic component imports from RSC, we use Vite's import.meta.glob.
       * This hook replaces the glob placeholders with resolved paths to all client components.
       *
       * NOTE: Glob import paths MUST be relative to the importer file in
       * order to get the `?v=xxx` querystring from Vite added to the import URL.
       * If the paths are relative to the root instead, Vite won't add the querystring
       * and we will have duplicated files in the browser (with duplicated contexts, etc).
       */
      if (/\/react-server-dom-vite.js/.test(id)) {
        const INJECTING_RE =
          /\{\s*__INJECTED_CLIENT_IMPORTERS__[:\s]*null[,\s]*\}\s*;/;

        if (options && options.ssr) {
          return code.replace(INJECTING_RE, 'globalThis.__COMPONENT_INDEX');
        }

        var CLIENT_COMPONENT_GLOB = '**/*.client.[jt]s?(x)';
        var importerPath = path.dirname(id);
        var importerToRootPath = vite.normalizePath(
          path.relative(importerPath, config.root)
        );

        var _ref2 = importerToRootPath.match(/(\.\.\/)+(\.\.)?/) || [],
          importerToRootNested = _ref2[0];

        var userPrefix = path.normalize(
          path.join(
            importerPath,
            importerToRootNested.replace(/\/?$/, path.sep)
          )
        );
        var userGlob = path.join(
          importerToRootPath,
          'src',
          CLIENT_COMPONENT_GLOB
        );

        var importers = [[userGlob, userPrefix]];
        clientComponentPaths.forEach(function (componentPath) {
          var libPrefix = componentPath + path.sep;
          var libGlob = path.join(
            path.relative(importerPath, componentPath),
            CLIENT_COMPONENT_GLOB
          );
          importers.push([libGlob, libPrefix]);
        });
        var injectedGlobs =
          'Object.assign(Object.create(null), ' +
          importers
            .map(function (_ref3) {
              var glob = _ref3[0],
                prefix = _ref3[1];
              return (
                "__vncp(import.meta.glob('" +
                vite.normalizePath(glob) +
                "'), '" +
                vite.normalizePath(prefix) +
                "')"
              );
            })
            .join(', ') +
          ');';
        return code.replace(
          INJECTING_RE,
          injectedGlobs + serializedNormalizePaths()
        );
      }
    },
  };
}

var serializedNormalizePaths = function () {
  return "\nfunction __vncp(obj, prefix) {\n  const nestedRE = /\\.\\.\\//gm;\n  return Object.keys(obj).reduce(function (acc, key) {\n    acc[prefix + key.replace(nestedRE, '')] = obj[key];\n    return acc;\n  }, {});\n}\n";
};

async function proxyClientComponent(id, src) {
  var DEFAULT_EXPORT = 'default'; // Modify the import ID to avoid infinite wraps

  var importFrom = id + '?no-proxy';
  await esModuleLexer.init;

  if (!src) {
    src = await fs.promises.readFile(id, 'utf-8');
  }

  var _await$transformWithE = await vite.transformWithEsbuild(src, id),
    code = _await$transformWithE.code;

  var _parse = esModuleLexer.parse(code),
    exportStatements = _parse[1];

  var proxyCode =
    "import {wrapInClientProxy} from 'react-server-dom-vite/client-proxy';\n" +
    ("import * as allImports from '" + importFrom + "';\n\n"); // Wrap components in Client Proxy

  exportStatements.forEach(function (key) {
    var isDefault = key === DEFAULT_EXPORT;
    var componentName = isDefault
      ? id.split('/').pop().split('.').shift()
      : key;
    proxyCode +=
      'export ' +
      (isDefault ? DEFAULT_EXPORT : 'const ' + componentName + ' =') +
      " wrapInClientProxy({ name: '" +
      componentName +
      "', id: '" +
      id +
      "', component: allImports['" +
      key +
      "'], named: " + // eslint-disable-next-line react-internal/safe-string-coercion
      String(!isDefault) +
      ' });\n';
  });
  return proxyCode;
}

module.exports = ReactFlightVitePlugin;
