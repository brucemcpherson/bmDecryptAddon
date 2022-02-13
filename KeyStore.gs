class KeyStore {
  constructor() {
    this.clear();
  }

  clear() {
    this._storeMap = new Map();
    this._startedAt = new Date().getTime();
  }

  getStore(key, seed) {
    if (seed === null && !this.hasStore(key))
      throw "store key not found " + key;
    return this.hasStore(key)
      ? this.storeMap.get(key)
      : this.setStore(key, typeof seed === "function" ? seed(key) : seed);
  }

  hasStore(key) {
    return this.storeMap.has(key);
  }

  setStore(key, value) {
    this.storeMap.set(key, value);
    return this.getStore(key);
  }

  get keys() {
    return Array.from(this.storeMap.keys());
  }

  get size() {
    return this.storeMap.size;
  }

  get storeMap() {
    return this._storeMap;
  }
}
