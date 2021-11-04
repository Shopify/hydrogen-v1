module.exports = {
  plugin: (_schema, documents, _config, _info) => {
    /**
     * `documentsByFilename` is an object whose keys correspond to the
     * filename and values correspond to the documents. We're doing thise
     * so it's easy to find the document corresponding to a filename, instead
     * of iterating through with `find` each time we need to do this.
     * */
    const documentsByFilename = documents.reduce((accumulator, document) => {
      accumulator[getFilename(document.location)] = document;
      return accumulator;
    }, {});

    return documents
      .map((document) => documentToGraphQLString(document, documentsByFilename))
      .join('\n\n');
  },
};

/**
 * Converts a document into a const string of GraphQL and
 * a corresponding comment describing the const
 * @param document: A GraphQL document
 * @param documentsByFilename: An object with the following key-values: { <fileName> : <document> }
 * @returns string
 */
function documentToGraphQLString(document, documentsByFilename) {
  const nonImportLines = getNonImportLines(document);
  const name = document.document.definitions[0].name.value;

  const nonImportLinesAsComments = nonImportLines
    .map((line) => {
      return `* ${line}`;
    })
    .join('\n');

  const nonImportLinesAsString = nonImportLines.join('\n');

  const imports = getImportFiles(document, documentsByFilename)
    .map((importFile) => documentsByFilename[importFile])
    .map((document) => {
      return document ? getNonImportLines(document) : null;
    });

  const importsAsComments = imports
    .map((importLines) => {
      return importLines.map((line) => `* ${line}`).join('\n');
    })
    .join('\n');
  const importsAsString = imports
    .map((importLines) => {
      return importLines.join('\n');
    })
    .join('\n');

  return `/**
*\`\`\`
${nonImportLinesAsComments}
${importsAsComments}
*\`\`\`
*/
export const ${name}: string = \`${nonImportLinesAsString}\n${importsAsString}\``;
}

/**
 * @param document: A GraphQL document
 * @returns An array of `#import '...'` lines
 */
function getImportLines(document) {
  const lines = document.rawSDL.split('\n');
  return lines.filter((line) => {
    return line.startsWith('#import');
  });
}

/**
 * @param document: A GraphQL document
 * @returns An array of all non-import lines
 */
function getNonImportLines(document) {
  const lines = document.rawSDL.split('\n');
  return lines.filter((line) => {
    return !line.startsWith('#import');
  });
}

/**
 *
 * @param document: A GraphQL document
 * @param documentsByFilename: An object with the following key-values: { <fileName> : <document> }
 * @returns An array of filenames that are imported by the passed `document` and its imports
 */
function getImportFiles(document, documentsByFilename) {
  const imports = getImportLines(document);

  if (imports.length == 0) {
    return imports;
  }

  const b = imports.reduce((accumulator, line) => {
    const doc = documentsByFilename[getFilename(line)];
    if (doc) {
      const thing = [
        ...accumulator,
        ...getImportFiles(doc, documentsByFilename),
      ];
      return thing;
    }
    return accumulator;
  }, []);

  return [...imports, ...b].map((imp) => {
    return getFilename(imp);
  });
}

/**
 * @param location: A string filepath
 * @returns A string corresponding to the file name
 */
function getFilename(location) {
  return location.split('/').pop().replace("'", '');
}
