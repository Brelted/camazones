const memoryStorage = {};
const STORAGE_TIMEOUT_MS = 1200;

let nativeStorage = null;

try {
  nativeStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  nativeStorage = null;
}

const withTimeout = async (operation) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Storage timeout')), STORAGE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    clearTimeout(timer);
  }
};

export const storage = {
  getItem: async (key) => {
    try {
      if (nativeStorage) {
        return await withTimeout(nativeStorage.getItem(key));
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
        await withTimeout(nativeStorage.setItem(key, value));
      }
    } catch (error) {
      return;
    }
  },
  removeItem: async (key) => {
    delete memoryStorage[key];

    try {
      if (nativeStorage) {
        await withTimeout(nativeStorage.removeItem(key));
      }
    } catch (error) {
      return;
    }
  },
};
