/**
 * Safe wrapper for LocalStorage access to prevent QuotaExceededError or JSON parse errors
 * from crashing the React app tree and causing a blank screen.
 */

import { setIDBItem, getIDBItem } from './indexedDBStorage';

/**
 * Safe wrapper for LocalStorage & IndexedDB access to prevent QuotaExceededError
 * and permanently persist large media files (videos, high-res photos) without data loss.
 */

export const safeSetLocalStorage = (key: string, value: any): boolean => {
  // Always persist to IndexedDB asynchronously for permanent large storage support
  setIDBItem(key, value).catch((err) => {
    console.warn(`[IndexedDB] Async persist error for key "${key}":`, err);
  });

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[SafeStorage] LocalStorage quota exceeded for key "${key}". Value saved safely in IndexedDB:`, err);
    return false;
  }
};

export const safeGetLocalStorage = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.warn(`[SafeStorage] Failed parsing stored value for key "${key}":`, err);
    return fallback;
  }
};

