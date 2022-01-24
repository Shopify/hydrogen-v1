import {MemoryStorage} from '@miniflare/storage-memory';

export class StorageFactory {
  storages: Map<string, any>;

  constructor() {
    this.storages = new Map();
  }

  storage(namespace: string) {
    let storage = this.storages.get(namespace);
    if (storage) return storage;
    this.storages.set(namespace, (storage = new MemoryStorage()));
    return storage;
  }
}
