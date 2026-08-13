/**
 * IndexedDB Storage Engine for permanent local browser persistence.
 * IndexedDB supports large files (video Base64/Blobs, high-res photos)
 * up to hundreds of Megabytes / Gigabytes, far exceeding LocalStorage's 5MB limit.
 */

const DB_NAME = 'YayasanDaarulHabibahDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_persistent_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save data permanently in browser IndexedDB
 */
export async function setIDBItem(key: string, value: any): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = (err) => {
        console.error(`[IndexedDB] Error setting key "${key}":`, err);
        resolve(false);
      };
    });
  } catch (err) {
    console.error(`[IndexedDB] Open DB failed for set "${key}":`, err);
    return false;
  }
}

/**
 * Retrieve data from browser IndexedDB
 */
export async function getIDBItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result !== undefined && req.result !== null) {
          resolve(req.result as T);
        } else {
          resolve(fallback);
        }
      };
      req.onerror = () => resolve(fallback);
    });
  } catch (err) {
    return fallback;
  }
}

/**
 * Remove data from browser IndexedDB
 */
export async function removeIDBItem(key: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}
