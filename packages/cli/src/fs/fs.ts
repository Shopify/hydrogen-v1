import {resolve, join, isAbsolute, dirname, relative} from 'path';
import {readFile, writeFile, mkdirp, pathExists, emptyDir} from 'fs-extra';

import {formatFile} from '../utilities';

export interface FileResult {
  path: string;
  overwritten: boolean;
}

export class Fs {
  root: string;
  files = new Map<string, string>();
  readCache = new Map<string, string>();

  constructor(root: string) {
    this.root = resolve(root);
  }

  join(...segments: string[]) {
    return join(...segments);
  }

  async read(path: string) {
    const fullPath = this.fullPath(path);

    if (this.files.has(fullPath)) {
      return this.files.get(fullPath)!;
    }

    if (this.readCache.has(fullPath)) {
      return this.readCache.get(fullPath)!;
    }

    const contents = await readFile(fullPath, 'utf8');
    this.readCache.set(fullPath, contents);

    return contents;
  }

  async exists(path: string) {
    return await pathExists(this.fullPath(path));
  }

  async *commit(): AsyncIterableIterator<FileResult> {
    for (const [path, contents] of this.files.entries()) {
      const exists = await this.exists(path);

      if (!exists) {
        await mkdirp(dirname(path));
      }

      await writeFile(path, formatFile(contents));
      yield {path: this.relativePath(path), overwritten: exists};
    }
  }

  write(path: string, contents: string) {
    this.files.set(this.fullPath(path), contents);
  }

  fullPath(path: string) {
    return isAbsolute(path) ? path : this.join(this.root, path);
  }

  relativePath(path: string) {
    return isAbsolute(path) ? relative(this.root, path) : path;
  }

  async empty(dir: string) {
    await emptyDir(dir);
  }
}
