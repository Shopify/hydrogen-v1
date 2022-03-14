import type {ASTNode} from 'graphql';
import type {Logger} from './log';

export const TIMEOUT_MS = 2000;

type TrackerParams = {
  query: ASTNode;
  log: Logger;
  data: {data: unknown};
};

function checkReadValues(
  map: Record<string, string>,
  query: TrackerParams['query'],
  log: TrackerParams['log']
) {
  // Track all the selections that were fetched
  const selections: string[] = [];

  // TODO: Fields that match this regex should be ignored.
  // Improve to look for Fragment at the end of the name.
  const regex = /(Fragment|__typename|edges|node)/;

  // Loop through the read fields map and add the
  // selections to the selections array
  JSON.parse(JSON.stringify(query), (key, value) => {
    if (value && typeof value === 'object' && value.kind === 'SelectionSet') {
      const selection = value.selections.map((sel: any) => {
        if (!sel.name || regex.test(sel.name?.value)) {
          return;
        }

        return sel.name?.value;
      });

      selections.push(selection.filter(Boolean));
    }

    return value;
  });

  const flattenedSelections = [...new Set(selections.flat())];

  // Check if any of the selections were not read
  const unusedGraphQLFields = flattenedSelections.filter((prop) => !map[prop]);

  if (unusedGraphQLFields) {
    // TODO support aliased fields
    const defs = (query as any)?.definitions;
    const queryName = defs && defs[0].name?.value;

    log.warn(
      `
Potentially overfetching fields in GraphQL query: \`${queryName}\`.
• ${unusedGraphQLFields.join(`\n• `)}
Examine the list of fields above to confirm that they are being used.
`
    );
  }
}

export function wrapInGraphQLTracker<T>({query, data, log}: TrackerParams) {
  let readTimeout: ReturnType<typeof setTimeout>;
  // Create a map of read fields
  const readFieldsMap: Record<string | symbol, any> = {};

  // Create a proxy object that allows us to inspect the fields that were fetched
  const dataProxy = JSON.parse(JSON.stringify(data), (_, value) => {
    if (typeof value === 'object' && value && !Array.isArray(value)) {
      return new Proxy(value, {
        get(target, prop: any) {
          if (!readFieldsMap[prop]) {
            clearTimeout(readTimeout);
            readTimeout = setTimeout(
              () => checkReadValues(readFieldsMap, query, log),
              TIMEOUT_MS
            );
          }

          readFieldsMap[prop] = true;

          return target[prop];
        },
      });
    }

    return value;
  });

  return dataProxy as T;
}
