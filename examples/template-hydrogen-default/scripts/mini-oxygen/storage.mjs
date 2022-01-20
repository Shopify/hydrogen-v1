export class StorageFactory {
  constructor() {
    this.storages = new Map();
  }

  storage(namespace) {
    let storage = this.storages.get(namespace);
    if (storage) return storage;
    this.storages.set(namespace, (storage = new Map()));
    return storage;
  }
}
