const DEFAULT_ROUTE_PREFIX = /^\.(\/src)?\/routes/;

export function findRoutePrefix([first, ...rest]: string[]) {
  if (!first?.startsWith('./')) return '';

  let commonPrefix = '.';

  if (rest.length > 0) {
    const parts = first.split('/');
    parts.pop(); // Last part is always different and has extension

    for (const string of rest) {
      const tmp = string.split('/');
      const diffIndex = parts.findIndex((part, index) => part !== tmp[index]);
      diffIndex >= 0 && parts.splice(diffIndex);
    }

    commonPrefix = parts.join('/');
  }

  return commonPrefix === '.' ? DEFAULT_ROUTE_PREFIX : commonPrefix;
}
