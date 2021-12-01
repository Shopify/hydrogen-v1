import type {Writable} from 'stream';
import type {ReactElement} from 'react';

const __WORKER__ = typeof process === 'undefined';
// declare global {
// // eslint-disable-next-line no-var
//     var __WORKER__: boolean;
// }

type MightBeFlushable = {
  flush?: () => void;
  [key: string]: any;
};

// ReadableStreamController in browser?
export type Destination = Writable & MightBeFlushable;

export type PrecomputedChunk = Uint8Array;
export type Chunk = string | Uint8Array;

type WebpackMap = {
  [filepath: string]: {
    [name: string]: ModuleMetaData;
  };
};

export type BundlerConfig = WebpackMap;

export type ReactModel =
  | ReactElement<any>
  | string
  | boolean
  | number
  | null
  | Iterable<ReactModel>
  | {[key: string]: ReactModel};

// eslint-disable-next-line no-unused-vars
export type ModuleReference<T> = {
  $$typeof: Symbol;
  filepath: string;
  name: string;
  named?: boolean;
};

export type ModuleMetaData = {
  id: string;
  chunks?: Array<string>;
  name: string;
  named?: boolean;
};

export type ModuleKey = string;

const MODULE_TAG = Symbol.for('react.module.reference');

const textEncoder = __WORKER__ ? new TextEncoder() : null;

const commonImplementation = {
  getModuleKey(reference: ModuleReference<any>): ModuleKey {
    return reference.filepath + '#' + reference.name;
  },
  isModuleReference(reference: Object): boolean {
    return (reference as any).$$typeof === MODULE_TAG;
  },
  resolveModuleMetaData<T>(
    config: BundlerConfig, // this is not used
    moduleReference: ModuleReference<T>
  ): ModuleMetaData {
    return {
      id: moduleReference.filepath,
      name: moduleReference.name,
      named: moduleReference.named,
    };
  },
};

const workerImplementation = {
  ...commonImplementation,
  close(destination: Destination) {
    destination.close();
  },
  closeWithError(destination: Destination, error?: Error) {
    if (typeof destination.error === 'function') {
      destination.error(error);
    } else {
      destination.close();
    }
  },
  scheduleWork(callback: () => void) {
    callback();
  },
  beginWriting(destination: Destination) {},
  writeChunk(
    destination: Destination,
    chunk: PrecomputedChunk | Chunk
  ): boolean {
    destination.enqueue(chunk);
    return destination.desiredSize > 0;
  },
  completeWriting(destination: Destination) {},
  flushBuffered(destination: Destination) {
    // WHATWG Streams do not yet have a way to flush the underlying
    // transform streams. https://github.com/whatwg/streams/issues/960
  },

  stringToChunk(content: string): Chunk {
    return textEncoder!.encode(content);
  },
  stringToPrecomputedChunk(content: string): PrecomputedChunk {
    return textEncoder!.encode(content);
  },
};

const nodeImplementation = {
  ...commonImplementation,
  close(destination: Destination) {
    destination.end();
  },
  closeWithError(destination: Destination, error?: Error) {
    destination.destroy(error);
  },
  scheduleWork(callback: () => void) {
    setImmediate(callback);
  },
  beginWriting(destination: Destination) {
    // Older Node streams like http.createServer don't have this.
    if (typeof destination.cork === 'function') {
      destination.cork();
    }
  },
  writeChunk(
    destination: Destination,
    chunk: Chunk | PrecomputedChunk
  ): boolean {
    const nodeBuffer = chunk as Buffer | string; // close enough
    return destination.write(nodeBuffer);
  },
  completeWriting(destination: Destination) {
    // Older Node streams like http.createServer don't have this.
    if (typeof destination.uncork === 'function') {
      destination.uncork();
    }
  },
  flushBuffered(destination: Destination) {
    // If we don't have any more data to send right now.
    // Flush whatever is in the buffer to the wire.
    if (typeof destination.flush === 'function') {
      // By convention the Zlib streams provide a flush function for this purpose.
      // For Express, compression middleware adds this method.
      destination.flush();
    }
  },
  stringToChunk(content: string): Chunk {
    return content;
  },
  stringToPrecomputedChunk(content: string): PrecomputedChunk {
    return Buffer.from(content, 'utf8');
  },
};

export default __WORKER__ ? workerImplementation : nodeImplementation;
