// Lightweight IndexedDB helper to store large uploaded files (videos, audio, photos)
// avoiding browser LocalStorage 5MB quota limitations.

const DB_NAME = 'BirthdayMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'mediaFiles';

export const openMediaDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB failed to open:', event.target.error);
      resolve(null);
    };
  });
};

export const saveMediaToDB = async (key, dataUrlOrBlob) => {
  try {
    const db = await openMediaDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(dataUrlOrBlob, key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn(`Failed to save ${key} to IndexedDB:`, err);
    return false;
  }
};

export const getMediaFromDB = async (key) => {
  try {
    const db = await openMediaDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = (event) => {
        resolve(event.target.result || null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn(`Failed to get ${key} from IndexedDB:`, err);
    return null;
  }
};

export const deleteMediaFromDB = async (key) => {
  try {
    const db = await openMediaDB();
    if (!db) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn(`Failed to delete ${key} from IndexedDB:`, err);
  }
};

export const clearAllMediaFromDB = async () => {
  try {
    const db = await openMediaDB();
    if (!db) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Failed to clear IndexedDB:', err);
  }
};
