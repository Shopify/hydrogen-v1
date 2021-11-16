import {resolve, join, isAbsolute, dirname, relative} from 'path';
import {readFile, writeFile, mkdirp, pathExists, emptyDir} from 'fs-extra';
import {RunError} from '../utilities/error';

import {formatFile} from '../utilities';

export interface FileResult {
  path: string;
  overwritten: boolean;
  diff: boolean;
}

export class Fs {
  root: string;
  files = new Map<string, string>();
  // TODO: Implement dry-run behaviour by keeping track of original sources
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

    const exists = await this.exists(path);

    if (!exists) {
      throw new RunError(
        `Tried to operate on file at ${path}, but it does not exist.`
      );
    }

    const contents = await readFile(fullPath, 'utf8');

    if (!this.readCache.has(fullPath)) {
      this.readCache.set(fullPath, contents);
    }

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

      const oldFile = this.readCache.get(path);
      const formattedFile = formatFile(contents);
      const diff = oldFile ? formatFile(oldFile) !== formattedFile : false;

      await writeFile(path, formatFile(formattedFile));
      yield {path: this.relativePath(path), overwritten: exists, diff: diff};
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
