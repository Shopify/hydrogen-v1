import importClientComponent from './client-imports';
import type {ModuleReference, ModuleMetaData} from './rsc-server-config';

export type UninitializedModel = string;
export type StringDecoder = unknown;

export type JSONValue =
  | number
  | null
  | boolean
  | string
  | {[key: string]: JSONValue}
  | ReadonlyArray<JSONValue>;

type PendingChunk = {
  _status: 0;
  _value: null | Array<() => unknown>;
  _response: FlightResponse;
  then(resolve: () => unknown): void;
};
type ResolvedModelChunk = {
  _status: 1;
  _value: UninitializedModel;
  _response: FlightResponse;
  then(resolve: () => unknown): void;
};
type ResolvedModuleChunk<T> = {
  _status: 2;
  _value: ModuleReference<T>;
  _response: FlightResponse;
  then(resolve: () => unknown): void;
};
type InitializedChunk<T> = {
  _status: 3;
  _value: T;
  _response: FlightResponse;
  then(resolve: () => unknown): void;
};
type ErroredChunk = {
  _status: 4;
  _value: Error;
  _response: FlightResponse;
  then(resolve: () => unknown): void;
};

type SomeChunk<T> =
  | PendingChunk
  | ResolvedModelChunk
  | ResolvedModuleChunk<T>
  | InitializedChunk<T>
  | ErroredChunk;

type ResponseBase = {
  _chunks: Map<number, SomeChunk<any>>;
  readRoot<T>(): T;
};

export type FlightResponse = ResponseBase & {
  _partialRow: string;
  _fromJSON: (key: string, value: JSONValue) => any;
  _stringDecoder: StringDecoder;
};

const moduleCache = new Map();

export default {
  supportsBinaryStreams: typeof TextDecoder !== 'undefined',
  resolveModuleReference(idx: string) {
    return idx;
  },
  preloadModule({id}: ModuleMetaData) {
    if (moduleCache.has(id)) return;

    function cacheResult<T = Promise<unknown> | unknown>(mod: T) {
      moduleCache.set(id, mod);
      return mod;
    }

    // Store the original promise first, then override cache with its result.
    cacheResult(importClientComponent(id)).then(cacheResult, cacheResult);
  },
  requireModule({id, name, named}: ModuleMetaData) {
    if (moduleCache.has(id)) {
      const mod = moduleCache.get(id);

      if (mod instanceof Promise || mod instanceof Error) {
        // This module is being read but it's either still being
        // downloaded or it has errored out. Pass it to Suspense.
        throw mod;
      }

      return mod[named ? name : 'default'];
    }
  },
  parseModel(response: FlightResponse, json: string) {
    return JSON.parse(json, response._fromJSON);
  },
  createStringDecoder() {
    return new TextDecoder();
  },
  readPartialStringChunk(decoder: TextDecoder, buffer: Uint8Array) {
    return decoder.decode(buffer, {stream: true});
  },
  readFinalStringChunk(decoder: TextDecoder, buffer: Uint8Array) {
    return decoder.decode(buffer);
  },
};
