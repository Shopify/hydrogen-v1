import type {
  DocumentNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
  FieldNode,
  SelectionNode,
  ASTNode,
} from 'graphql';

export const TIMEOUT_MS = 2000;

type TrackerParams = {
  query: ASTNode;
  data: {data: unknown};
  onUnusedData?: (params: {queryName: string; properties: string[]}) => void;
};

export function injectGraphQLTracker({
  query,
  data,
  onUnusedData,
}: TrackerParams) {
  const {fieldNodes, fragments} = convertQueryToResolveInfo(
    query as DocumentNode
  );

  // E.g. ['shop.stuff.myString']
  const requestedFields = Object.keys(
    flattenObject(getSelectionFieldsFromAST(fieldNodes, fragments))
  );

  // Remove the last key of each path to avoid proxying primitive
  // values. Reverse order to avoid accessing already defined
  // proxies (i.e. handle child properties before parent properties)
  // E.g. `shop.stuff.myString` => `shop.stuff`
  const uniqueFieldPaths = [
    ...new Set(
      requestedFields.map((path) => path.split('.').slice(0, -1).join('.'))
    ),
  ].reverse();

  const queryName =
    findOperationDefinition(query as DocumentNode).name?.value || '';

  // Record fields that are read in the proxy to compare later.
  const readFieldsMap: Record<string, any> = {};

  let isCheckedOnce = false;
  const checkFields = (check = onUnusedData!) => {
    isCheckedOnce = true;

    const properties = requestedFields
      .filter((prop) => !readFieldsMap[prop] && !prop.endsWith('.__typename'))
      .map((prop) => prop.replace(/\.edges\./g, '.').replace(/\.node\./g, '.'));

    if (properties.length > 0) {
      return check({queryName, properties});
    }
  };

  let readTimeout: ReturnType<typeof setTimeout>;
  uniqueFieldPaths.forEach((fieldPath) =>
    deepTransform(data, 'data.' + fieldPath, (value: any) => {
      if (typeof value !== 'object' || value === null) return value;

      return new Proxy(value, {
        get(target, prop: string | symbol) {
          if (typeof prop === 'string') {
            const fullPath = fieldPath + '.' + prop;

            if (!readFieldsMap[fullPath]) {
              readFieldsMap[fullPath] = true;
              if (onUnusedData && !isCheckedOnce) {
                clearTimeout(readTimeout);
                readTimeout = setTimeout(checkFields, TIMEOUT_MS);
              }
            }
          }

          return target[prop];
        },
      });
    })
  );

  return checkFields;
}

function findOperationDefinition(query: DocumentNode) {
  return query.definitions.find(
    (def) => def.kind === 'OperationDefinition'
  ) as OperationDefinitionNode;
}

function convertQueryToResolveInfo(query: DocumentNode) {
  const operation = findOperationDefinition(query);

  const fragments = query.definitions
    .filter(({kind}) => kind === 'FragmentDefinition')
    .reduce((result, current) => {
      current = current as FragmentDefinitionNode;
      return {
        ...result,
        [current.name.value]: current,
      };
    }, {} as Record<string, FragmentDefinitionNode>);

  return {
    fieldNodes: operation?.selectionSet.selections as FieldNode[],
    fragments,
  };
}

/**
 * Extracts the selection fields from a query AST as a plain JS object.
 * @param selectionNodes - Selection nodes from the AST
 * @param fragments - Fragments from the AST
 * @param root - Internal pointer for recursion
 * @returns A plain JS object representing the selection fields
 */
function getSelectionFieldsFromAST(
  selectionNodes: SelectionNode | SelectionNode[],
  fragments: Record<string, FragmentDefinitionNode> = {},
  root: Record<string, any> = {}
) {
  const nodes = Array.isArray(selectionNodes)
    ? selectionNodes
    : [selectionNodes];

  return nodes.reduce(function (tree, value) {
    if (value.kind === 'Field') {
      const name =
        (value.alias && value.alias.value) || (value.name && value.name.value);

      if (value.selectionSet) {
        tree[name] ??= {};

        getSelectionFieldsFromAST(
          value.selectionSet.selections as SelectionNode[], // readonly type?
          fragments,
          tree[name]
        );
      } else {
        tree[name] = true;
      }
    } else if (value.kind === 'FragmentSpread') {
      const name = value.name.value;
      const fragment = fragments[name];
      if (!fragment) {
        throw new Error('Unknown fragment "' + name + '"');
      }

      getSelectionFieldsFromAST(
        fragment.selectionSet.selections as SelectionNode[],
        fragments,
        tree
      );
    } else if (value.kind === 'InlineFragment') {
      getSelectionFieldsFromAST(
        value.selectionSet.selections as SelectionNode[],
        fragments,
        tree
      );
    }

    return tree;
  }, root);
}

/**
 * Generates a new object with only one level depth where all the
 * original nested properties are concatenated with dots.
 * @param input - Object to flatten
 * @param key - Internal pointer for recursion
 * @param output - Internal pointer for recursion
 * @returns
 */
function flattenObject(input: any, key = '', output: Record<string, any> = {}) {
  if (input === null || typeof input !== 'object') {
    // This is a leaf, stop here
    output[key] = input;
  } else {
    // Array or object, continue recursively for each child
    const prefix = key ? key + '.' : key;
    for (const nextKey of Object.keys(input)) {
      flattenObject(input[nextKey], prefix + nextKey, output);
    }
  }

  return output;
}

/**
 * Transform a nested property in a given object (in place).
 * @param input - Object to transform
 * @param path - Dot-separated path to the nested property
 * @param valueTransform - Transformer function
 */
function deepTransform(
  input: any,
  path: string | string[],
  valueTransform: (v: any) => any
) {
  const keys = Array.isArray(path) ? path : path.split('.');
  let obj = input;
  let key;

  for (let index = 0; !!obj && index < keys.length; index++) {
    key = keys[index];

    if (index === keys.length - 1) {
      // Last property, transform value
      obj[key] = valueTransform(obj[key]);
    } else if (Array.isArray(obj[key])) {
      // We've found an array in the middle, run this recursively
      const subKeys = keys.slice(index + 1);
      obj[key].forEach((v: any) => deepTransform(v, subKeys, valueTransform));
    }

    obj = obj[key];
  }
}
