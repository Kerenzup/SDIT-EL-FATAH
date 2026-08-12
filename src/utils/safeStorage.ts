/**
 * Safe wrapper for LocalStorage access to prevent QuotaExceededError or JSON parse errors
 * from crashing the React app tree and causing a blank screen.
 */

export const safeSetLocalStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[SafeStorage] Storage full or disabled for key "${key}":`, err);
    // If quota exceeded, try clearing non-essential temporary items or warn
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
