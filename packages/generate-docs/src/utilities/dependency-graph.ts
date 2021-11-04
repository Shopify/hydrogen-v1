import * as path from 'path';
import {readFileSync} from 'fs';
import {sync as resolveSync} from 'resolve';

import {parse} from '@babel/parser';
import {TSDocParser, DocNode, DocExcerpt, DocComment} from '@microsoft/tsdoc';

import type {
  Node,
  Comment,
  Statement,
  Identifier,
  TSType,
  TSUnionType,
  TSParenthesizedType,
} from '@babel/types';

import type {
  ArrayType,
  ImportedReference,
  LocalReference,
  PropertySignature,
  RemoteComponent,
  UndocumentedType,
  Exportable,
  StringLiteralType,
  ParameterType,
  Tag,
  InterfaceType,
  HydrogenComponent,
} from '../types';

interface UnresolvedLocal {
  node: Node;
  name: string;
  comments?: readonly Comment[];
}

interface CollectContext {
  readonly path: string;
  readonly exportedLocals: Set<string>;
  readonly resolvedLocals: Map<string, Exportable | LocalReference | false>;
  readonly unresolvedLocals: Map<string, UnresolvedLocal>;
}

interface ProcessContext {
  readonly path: string;
  readonly source: string;
  readonly docParser: import('@microsoft/tsdoc').TSDocParser;
  readonly resolvedLocals: Map<string, Exportable | LocalReference | false>;
  readonly localsToResolve: Set<string>;
}

export interface Module {
  readonly path: string;
  readonly exports: Map<string, Exportable>;
  readonly locals: Map<string, Exportable | LocalReference>;
  readonly usedImports: Set<ImportedReference>;
}

const DOCS_COMMENT_REGEX = /^\/\*\*/;
const UNDOCUMENTED: UndocumentedType = {kind: 'UndocumentedType'};
const MAX_CONCURRENCY = 5;

export async function createDependencyGraph(entry: string) {
  const modules = new Map<string, Module>();

  await new Promise((resolve, reject) => {
    const fileQueue: string[] = [];
    const seen = new Set<string>();

    let usedConcurrency = 0;

    take(entry);

    function take(file: string) {
      if (seen.has(file)) return;

      seen.add(file);

      if (usedConcurrency < MAX_CONCURRENCY) {
        usedConcurrency += 1;
        process(file);
      } else {
        fileQueue.push(file);
      }
    }

    function release() {
      const queued = fileQueue.shift();

      if (queued) {
        process(queued);
        return;
      }

      usedConcurrency -= 1;

      if (usedConcurrency === 0) {
        resolve(undefined);
      }
    }

    async function process(file: string) {
      try {
        const module = await extractModule(file);
        const importedFiles = new Set(
          [...module.usedImports].map((imported) => imported.path)
        );

        for (const importedFile of importedFiles) {
          take(importedFile);
        }

        modules.set(file, module);
        release();
      } catch (error) {
        reject(error);
      }
    }
  });

  return resolveRemoteExtends(modules);
}

async function extractModule(file: string): Promise<Module> {
  const source = readFileSync(file, 'utf8');

  const parsed = parse(source, {
    sourceType: 'module',
    plugins: ['dynamicImport', 'jsx', 'typescript'],
    tokens: true,
  });

  const exportedLocals: CollectContext['exportedLocals'] = new Set();
  const unresolvedLocals: CollectContext['unresolvedLocals'] = new Map();
  const resolvedLocals: ProcessContext['resolvedLocals'] = new Map();

  const collectContext: CollectContext = {
    path: file,
    resolvedLocals,
    exportedLocals,
    unresolvedLocals,
  };

  for (const statement of parsed.program.body) {
    collectLocalsFromStatement(statement, collectContext);
  }

  const localsToResolve = new Set(exportedLocals);

  const processContext: ProcessContext = {
    path: file,
    source,
    docParser: new TSDocParser(),
    resolvedLocals,
    localsToResolve,
  };

  while (localsToResolve.size > 0) {
    const queue = [...localsToResolve];
    localsToResolve.clear();

    for (const queued of queue) {
      if (resolvedLocals.has(queued)) continue;

      const unresolved = unresolvedLocals.get(queued);

      if (unresolved == null) {
        resolvedLocals.set(queued, UNDOCUMENTED);

        continue;
      }

      const local =
        resolveNodeToLocal(
          unresolved.node,
          processContext,
          unresolved.comments
        ) ?? false;

      resolvedLocals.set(queued, local);
    }
  }

  const exports = new Map<string, Exportable>(
    [...exportedLocals].map((name) => [name, resolvedLocals.get(name) as any])
  );

  for (const [name, local] of resolvedLocals) {
    if (local === false) {
      throw new Error(`Unresolved export: ${name}`);
    }
  }

  const locals: Module['locals'] = resolvedLocals as any;
  const imports = [...locals.values()].filter(
    (value): value is ImportedReference => value.kind === 'Imported'
  );

  return {path: file, exports, locals, usedImports: new Set(imports)};
}

/** https://astexplorer.net/ */
function resolveNodeToLocal(
  node: Node,
  context: ProcessContext,
  comments?: readonly Comment[]
): Exportable | LocalReference {
  switch (node.type) {
    case 'TSParenthesizedType': {
      return resolveNodeToLocal(node.typeAnnotation, context);
    }
    case 'TSTypeLiteral': {
      const properties = [];
      for (const n of node.members) {
        properties.push(resolveNodeToLocal(n, context));
      }

      return {
        kind: 'Local',
        params: properties,
        name: 'Unknown',
      };
    }
    // case 'TSIntersectionType': {
    //   console.log(node);
    //   return {kind: 'Local', name: 'Unknown'};
    // }
    case 'TSTypeParameter': {
      if (node.constraint) {
        const local = resolveNodeToLocal(node.constraint, context);
        if (local.kind === 'Local') {
          return {kind: 'TypeParameter', constraint: local.name};
        }
      }
      return undocumented(node);
    }
    case 'TSTypeReference': {
      if (node.typeName.type === 'TSQualifiedName') {
        return {
          kind: 'Local',
          name:
            node.typeName.left.type === 'Identifier'
              ? node.typeName.left.name
              : '',
        };
      }

      if (node.typeName.type !== 'Identifier') {
        throw new Error();
      }

      const typeParams = node.typeParameters?.params;
      let params;

      if (typeParams) {
        params = typeParams.map((param) => resolveNodeToLocal(param, context));
      } else {
        const referenced = context.resolvedLocals.get(node.typeName.name);

        if (referenced) {
          params = [referenced];
        }
      }

      const name = node.typeName.name;
      context.localsToResolve.add(name);

      return {kind: 'Local', name, params};
    }
    case 'TSTypeAnnotation': {
      return resolveNodeToLocal(node.typeAnnotation, context);
    }
    case 'TSLiteralType': {
      switch (node.literal.type) {
        case 'StringLiteral': {
          return {kind: 'StringLiteralType', value: node.literal.value};
        }
        case 'NumericLiteral': {
          return {kind: 'NumberLiteralType', value: node.literal.value};
        }
        case 'BooleanLiteral': {
          return {kind: 'BooleanLiteralType', value: node.literal.value};
        }
        default: {
          throw new Error();
        }
      }
    }
    case 'TSStringKeyword': {
      return {kind: 'StringType'};
    }
    case 'TSBooleanKeyword': {
      return {kind: 'BooleanType'};
    }
    case 'TSNumberKeyword': {
      return {kind: 'NumberType'};
    }
    case 'TSVoidKeyword': {
      return {kind: 'VoidType'};
    }
    case 'TSUndefinedKeyword': {
      return {kind: 'UndefinedType'};
    }
    case 'TSNullKeyword': {
      return {kind: 'NullType'};
    }
    case 'TSUnknownKeyword': {
      return {kind: 'UnknownType'};
    }
    case 'TSAnyKeyword': {
      return {kind: 'AnyType'};
    }
    case 'TSFunctionType': {
      return {
        kind: 'FunctionType',
        parameters: node.parameters.map((parameter) => ({
          kind: 'ParameterType',
          rest: parameter.type === 'RestElement',
          name:
            parameter.type === 'Identifier'
              ? parameter.name
              : (parameter.argument as Identifier).name,
          type:
            parameter.typeAnnotation == null
              ? undocumented(node)
              : (resolveNodeToLocal(parameter.typeAnnotation, context) as any),
        })),
        returnType:
          node.typeAnnotation == null
            ? {kind: 'VoidType'}
            : (resolveNodeToLocal(node.typeAnnotation, context) as any),
      };
    }
    case 'TSUnionType': {
      const members = [...flattenUnion(node)]
        .map((type) => resolveNodeToLocal(type, context))
        .filter((type): type is Exportable | LocalReference => type != null);

      return {
        kind: 'UnionType',
        types: members as any,
      };
    }
    case 'TSIntersectionType': {
      const properties: PropertySignature[] = [];
      let name = '';
      let docs;

      node.types.forEach((node) => {
        const ref = resolveNodeToLocal(node, context);
        if (ref) {
          if (ref.kind === 'Local') {
            ref?.params?.forEach((param) => {
              if (param.kind === 'InterfaceType') {
                name = param.name;
                docs = param.docs;

                param.properties.forEach((prop) => {
                  properties.push({
                    kind: prop.kind,
                    name: prop.name,
                    value: prop.value,
                    docs: prop.docs,
                  });
                });
              }
            });
          }
        }
      });
      return {
        kind: 'InterfaceType',
        name,
        properties,
        docs,
      };
    }
    case 'TSInterfaceDeclaration': {
      const properties: PropertySignature[] = [];
      let remoteExtends: string | undefined;

      // If this interface extends another, find the base
      // we're extending and grab its properties
      if (node.extends) {
        for (const extens of node.extends) {
          const resolved = resolveNodeToLocal(extens, context);

          if (resolved.kind === 'Extends') {
            const extendedNode = context.resolvedLocals.get(resolved.extends);

            if (extendedNode) {
              if (extendedNode.kind === 'InterfaceType') {
                extendedNode.properties.forEach((property) =>
                  properties.push(property)
                );
              } else if (extendedNode.kind === 'Imported') {
                // if this interface extends a node that's imported from outside this project,
                // flag it for later resolution (see resolveRemoteExtends).
                // At this point, we haven't collected  types from the remotely imported file yet,
                // so we can't resolve these properties yet.
                remoteExtends = extendedNode.name;
              }
            }
          }
        }
      }

      for (const property of node.body.body) {
        if (property.type === 'TSCallSignatureDeclaration') {
          if (property.typeAnnotation == null) {
            continue;
          }

          const parameters: ParameterType[] = property.parameters.map(
            (parameter) => ({
              kind: 'ParameterType',
              rest: parameter.type === 'RestElement',
              name:
                parameter.type === 'Identifier'
                  ? parameter.name
                  : (parameter.argument as Identifier).name,
              type:
                parameter.typeAnnotation == null
                  ? undocumented(node)
                  : (resolveNodeToLocal(
                      parameter.typeAnnotation,
                      context
                    ) as any),
            })
          );

          properties.push({
            kind: 'PropertySignature',
            name: '',
            optional: false,
            value: resolveNodeToLocal(property.typeAnnotation, context) as any,
            docs: docsFromCommentBlocks([property.leadingComments], context),
            parameters,
          });
        } else if (property.type === 'TSPropertySignature') {
          if (
            (property.key.type !== 'Identifier' &&
              property.key.type !== 'StringLiteral') ||
            property.typeAnnotation == null
          ) {
            continue;
          }

          const name =
            property.key.type === 'Identifier'
              ? property.key.name
              : property.key.value;

          properties.push({
            kind: 'PropertySignature',
            name,
            optional: property.optional ?? false,
            value: resolveNodeToLocal(property.typeAnnotation, context) as any,
            docs: docsFromCommentBlocks(
              [property.leadingComments],
              context,
              true
            ),
          });
        } else if (property.type === 'TSMethodSignature') {
          if (
            property.key.type !== 'Identifier' ||
            property.typeAnnotation == null
          ) {
            continue;
          }

          properties.push({
            kind: 'PropertySignature',
            name: property.key.name,
            optional: property.optional ?? false,
            value: {
              kind: 'FunctionType',
              parameters: property.parameters.map((parameter) => {
                return {
                  kind: 'ParameterType',
                  name:
                    parameter.type === 'Identifier'
                      ? parameter.name
                      : (parameter.argument as Identifier).name,
                  rest: parameter.type === 'RestElement',
                  type:
                    parameter.typeAnnotation == null
                      ? {kind: 'VoidType'}
                      : (resolveNodeToLocal(
                          parameter.typeAnnotation,
                          context
                        ) as any),
                };
              }),
              returnType: property.typeAnnotation
                ? (resolveNodeToLocal(property.typeAnnotation, context) as any)
                : {kind: 'VoidType'},
            },
            docs: docsFromCommentBlocks([property.leadingComments], context),
          });
        }
      }

      return {
        kind: 'InterfaceType',
        name: node.id.name,
        properties,
        remoteExtends,
        docs: docsFromCommentBlocks([node.leadingComments, comments], context),
      };
    }
    case 'FunctionDeclaration': {
      const {id, params} = node;
      const [props] = params;

      if (node.id?.type !== 'Identifier') {
        return undocumented(node);
      }

      if (props == null) {
        const component: HydrogenComponent = {
          kind: 'Component',
          name: id ? id.name : 'Unknown',
          docs: docsFromCommentBlocks(
            [node.leadingComments, comments],
            context
          ),
        };

        return component;
      }

      if (props?.typeAnnotation == null) {
        return undocumented(node);
      }

      const nextProps = props?.typeAnnotation;

      const component: HydrogenComponent = {
        kind: 'Component',
        name: id ? id.name : 'Unknown',
        docs: docsFromCommentBlocks([node.leadingComments, comments], context),
        props: resolveNodeToLocal(nextProps, context) as any,
      };

      return component;
    }
    case 'CallExpression': {
      if (node.callee.type !== 'Identifier') {
        return undocumented(node);
      }

      const typeParams = node.typeParameters?.params;

      if (typeParams == null) return undocumented(node);

      const [nameType, propsType] = typeParams;

      const componentName =
        nameType?.type === 'TSLiteralType' &&
        nameType.literal.type === 'StringLiteral'
          ? nameType.literal.value
          : undefined;

      if (componentName == null) return undocumented(node);

      const component: RemoteComponent = {
        kind: 'Component',
        name: componentName,
        docs: docsFromCommentBlocks([node.leadingComments, comments], context),
        props: resolveNodeToLocal(propsType, context) as any,
      };

      return component;
    }
    case 'TSArrayType': {
      const elements = resolveNodeToLocal(node.elementType, context);

      const array: ArrayType = {
        kind: 'ArrayType',
        elements: elements as any,
      };

      return array;
    }
    case 'TSTypeOperator': {
      switch (node.operator) {
        case 'keyof': {
          const local = resolveNodeToLocal(node.typeAnnotation, context);
          if (local.kind === 'Local') {
            const ref = context.resolvedLocals.get(local.name);

            if (ref && ref.kind === 'InterfaceType') {
              const types = ref.properties.map((prop) => {
                const type: StringLiteralType = {
                  kind: 'StringLiteralType',
                  value: prop.name,
                };
                return type;
              });

              return {
                kind: 'UnionType',
                types,
              };
            }
          }
          return undocumented(node);
        }
        default: {
          return undocumented(node);
        }
      }
    }

    case 'TSNeverKeyword': {
      return {kind: 'NeverKeyword'};
    }

    case 'TSExpressionWithTypeArguments': {
      const {expression} = node;
      if (expression.type === 'Identifier') {
        const name = expression.name;
        return {
          kind: 'Extends',
          extends: name,
        };
      }
      return undocumented(node);
    }

    /**
     * https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
     */
    case 'TSMappedType': {
      const {typeParameter} = node;
      const local = resolveNodeToLocal(typeParameter, context);

      if (local.kind === 'TypeParameter' && local.constraint) {
        if (typeof node.start === 'number' && typeof node.end === 'number') {
          const mapping = context.source.substr(node.start, node.end);
          return {
            kind: 'MappedType',
            ref: local.constraint,
            mapping,
          };
        }
      }
      return undocumented(node);
    }

    default: {
      return undocumented(node);
    }
  }
}

function* flattenUnion(
  node: TSUnionType
): Generator<Exclude<TSType, TSParenthesizedType>, void, void> {
  for (const child of node.types) {
    if (child.type === 'TSParenthesizedType') {
      if (child.typeAnnotation.type === 'TSUnionType') {
        yield* flattenUnion(child.typeAnnotation);
      } else {
        yield flattenParenthesized(child);
      }
    } else {
      yield child;
    }
  }
}

function flattenParenthesized(
  node: TSParenthesizedType
): Exclude<TSType, TSParenthesizedType> {
  return node.typeAnnotation.type === 'TSParenthesizedType'
    ? flattenParenthesized(node.typeAnnotation)
    : node.typeAnnotation;
}

function contentWithTags(docComment: DocComment) {
  let tagName: string;

  const tags: Tag[] = [];

  // using summarySection omits tags
  const content = recurseDocNodes(docComment.summarySection);

  // Parse block tags
  docComment.customBlocks.forEach((block) => recurseDocNodes(block, true));

  /**
   * Parse modifier tags (ie beta)
   * see:
   *   https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/StandardTags.ts
   *   https://github.com/microsoft/tsdoc/blob/bab67532f80d731087eb167c586943e946dc8b11/tsdoc/src/configuration/TSDocTagDefinition.ts#L7-L24
   */
  docComment.modifierTagSet.nodes.forEach((x) => {
    if (x.tagName) {
      tags.push({name: x.tagName, content: ''});
    }
  });

  return {content, tags};

  function recurseDocNodes(docNode?: DocNode, accumulate?: boolean): string {
    let result = '';
    if (docNode) {
      if (docNode instanceof DocExcerpt) {
        if (docNode.kind === 'Excerpt' && accumulate) {
          if (docNode.excerptKind === 'BlockTag') {
            tagName = docNode.content.toString();
          } else if (docNode.excerptKind === 'PlainText') {
            tags.push({
              name: tagName,
              content: docNode.content.toString().replace(/^ /g, ''),
            });
          }
        }
        result += docNode.content.toString();
      }
      for (const childNode of docNode.getChildNodes()) {
        result += recurseDocNodes(childNode, accumulate);
      }
    }
    return result;
  }
}

function docsFromCommentBlocks(
  blocks: (readonly Comment[] | undefined | null)[],
  {source}: ProcessContext,
  parseTags?: boolean
): RemoteComponent['docs'] {
  const docs: string[] = [];

  for (const block of blocks) {
    if (block == null) continue;

    for (const comment of block) {
      const expandedComment = source.slice(comment.start, comment.end);
      if (DOCS_COMMENT_REGEX.test(expandedComment)) docs.push(expandedComment);
    }
  }

  if (docs.length === 0) {
    return undefined;
  }

  const parser = new TSDocParser();
  const parserContext = parser.parseString(docs.join('\n'));
  const {docComment} = parserContext;

  return contentWithTags(docComment);
}

function collectLocalsFromStatement(
  node: Statement,
  context: CollectContext,
  comments?: readonly Comment[]
): string[] | undefined {
  switch (node.type) {
    case 'TSTypeAliasDeclaration': {
      const name = node.id.name;
      context.unresolvedLocals.set(name, {
        name,
        node: node.typeAnnotation,
        comments: node.leadingComments ?? undefined,
      });
      return [name];
    }
    case 'TSInterfaceDeclaration': {
      const name = node.id.name;
      context.unresolvedLocals.set(name, {name, node, comments});
      return [name];
    }
    case 'FunctionDeclaration': {
      const {id, leadingComments} = node;

      if (!id) {
        return;
      }

      const name = id.name;

      context.unresolvedLocals.set(name, {
        name,
        node,
        comments: leadingComments?.length ? leadingComments : comments,
      });

      return [name];
    }
    case 'VariableDeclaration': {
      const {leadingComments} = node;
      const references: string[] = [];

      for (const {id, init} of node.declarations) {
        if (id.type !== 'Identifier' || init == null) continue;
        const name = id.name;
        context.unresolvedLocals.set(name, {
          name,
          node: init,
          comments: leadingComments?.length ? leadingComments : comments,
        });
        references.push(name);
      }

      return references;
    }
    // ie "export {Thing} from './path';"
    case 'ExportNamedDeclaration': {
      if (node.declaration) {
        const exported = collectLocalsFromStatement(
          node.declaration,
          context,
          node.leadingComments ?? undefined
        )?.[0];

        if (exported) context.exportedLocals.add(exported);
      }

      const resolved = node.source
        ? resolveImportPath(context.path, node.source.value)
        : undefined;

      for (const specifier of node.specifiers) {
        switch (specifier.type) {
          case 'ExportSpecifier': {
            const importedName = specifier.local.name;
            const exportedName =
              specifier.exported.type === 'Identifier'
                ? specifier.exported.name
                : '';
            context.exportedLocals.add(exportedName);

            if (resolved) {
              const imported: ImportedReference = {
                kind: 'Imported',
                name: importedName,
                path: resolved,
              };

              context.resolvedLocals.set(exportedName, imported);
            }

            break;
          }
        }
      }
      break;
    }
    // ie "import {Thing} from './path';"
    case 'ImportDeclaration': {
      if (node.importKind !== 'type') break;

      const resolved = node.source
        ? resolveImportPath(context.path, node.source.value)
        : undefined;

      for (const specifier of node.specifiers) {
        switch (specifier.type) {
          case 'ImportSpecifier': {
            const importedName = specifier.local.name;
            const exportedName =
              specifier.imported.type === 'Identifier'
                ? specifier.imported.name
                : '';

            if (resolved) {
              const imported: ImportedReference = {
                kind: 'Imported',
                name: importedName,
                path: resolved,
              };

              context.resolvedLocals.set(exportedName, imported);
            }
          }
        }
      }
    }
  }
}

function resolveImportPath(from: string, to: string) {
  if (to.startsWith('@shopify')) {
    const packageName = to.replace('@shopify/', '');
    return resolveSync(`${packageName}/src`, {
      basedir: path.dirname(from),
      moduleDirectory: 'packages',
      extensions: ['.ts', '.tsx', '.js'],
    });
  }

  return resolveSync(to, {
    basedir: path.dirname(from),
    extensions: ['.ts', '.tsx', '.js'],
  });
}

function undocumented(node: Node) {
  console.warn(`${node.type} is unhandled.`);
  return UNDOCUMENTED;
}

/**
 * Resolves situations like:
 *
 * import \{BaseProps\} from '\@shopify/ui-extensions';
 * export interface Props extends BaseProps \{\}
 */
function resolveRemoteExtends(graph: Map<string, Module>): Map<string, Module> {
  graph.forEach((graphModule) => {
    graphModule.locals.forEach((local) => {
      if (local.kind === 'InterfaceType' && local.remoteExtends) {
        const extendedNodes = filterGraph(
          graph,
          ({name, kind}) => kind !== 'Imported' && name === local.remoteExtends
        );

        if (extendedNodes.length) {
          const extendedNode = extendedNodes[0];
          extendedNode.properties.forEach((property) =>
            local.properties.push(property)
          );
        }
      }
    });
  });

  return graph;
}

function filterGraph(
  graph: Map<string, Module>,
  filterMethod: (any: Record<string, any>) => boolean
): InterfaceType[] {
  const allInterfaces: InterfaceType[] = [];

  graph.forEach((value) => {
    const localValues: any[] = [...value.locals.values()];
    allInterfaces.push(
      ...(localValues.filter(({name, kind}) =>
        filterMethod({name, kind})
      ) as InterfaceType[])
    );
  });

  return allInterfaces;
}
