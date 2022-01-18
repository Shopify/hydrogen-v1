import {join} from 'path';

import {statSync, existsSync, mkdirpSync} from 'fs-extra';
import * as glob from 'glob-promise';

interface Options {
  recursive?: boolean;
}

export async function tree(path: string, options: Options = {}) {
  if (!existsSync(path)) {
    mkdirpSync(path);
  }

  const result = await walk(path, options.recursive);

  return result;
}

async function walk(
  path: string,
  recursive = false
): Promise<{files: string[]; directories: string[]}> {
  if (!existsSync(path)) {
    return {files: [], directories: []};
  }

  const pattern = recursive ? '*/**' : '*';
  const items = await glob.promise(pattern, {
    cwd: path,
    root: path,
    dot: false,
    ignore: '**/*.d.ts',
  });

  if (items.length <= 0) {
    return {files: [], directories: []};
  }

  const files: string[] = [];
  const directories: string[] = [];

  for (const item of items) {
    const fullPath = join(path, item);
    if ((await statSync(fullPath)).isDirectory()) {
      directories.push(fullPath);
    } else {
      files.push(fullPath);
    }
  }

  return {files: uniq(files), directories: uniq(directories)};
}

export function uniq<T>(array: T[]) {
  return [...new Set(array)];
}
