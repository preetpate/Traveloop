import { useState, useCallback } from 'react';

/**
 * A useState-like hook backed by localStorage.
 * Reads the initial value from localStorage on first render,
 * and keeps localStorage in sync on every update.
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Fallback value when the key is not set
 * @returns {[*, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (valueToStore === undefined || valueToStore === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`useLocalStorage: failed to set key "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
