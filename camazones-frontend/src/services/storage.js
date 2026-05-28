const memoryStorage = {};

let nativeStorage = null;

try {
  nativeStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  nativeStorage = null;
}

export const storage = {
  getItem: async (key) => {
    try {
      if (nativeStorage) {
        return await nativeStorage.getItem(key);
      }
    } catch (error) {
      return memoryStorage[key] ?? null;
    }

    return memoryStorage[key] ?? null;
  },
  setItem: async (key, value) => {
    memoryStorage[key] = value;

    try {
      if (nativeStorage) {
        await nativeStorage.setItem(key, value);
      }
    } catch (error) {
      return;
    }
  },
  removeItem: async (key) => {
    delete memoryStorage[key];

    try {
      if (nativeStorage) {
        await nativeStorage.removeItem(key);
      }
    } catch (error) {
      return;
    }
  },
};
