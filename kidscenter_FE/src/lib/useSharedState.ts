import { useState, useEffect } from 'react';

export function useSharedState<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  // Setup initial state (use initialValue for SSR and first client render to avoid hydration mismatch)
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  // Listen to storage events to keep tabs in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (error) {
          console.error(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  const setSharedState = (value: T | ((prev: T) => T)) => {
    try {
      setState(prev => {
        const newValue = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        // Dispatch custom event for same-window updates
        window.dispatchEvent(new CustomEvent("local-storage-sync", { detail: { key } }));
        return newValue;
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Add event listener for same-window syncing
  useEffect(() => {
    const handleLocalSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key !== key) return;

      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setState(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    window.addEventListener("local-storage-sync", handleLocalSync);
    return () => {
      window.removeEventListener("local-storage-sync", handleLocalSync);
    };
  }, [key]);

  return [state, setSharedState];
}
