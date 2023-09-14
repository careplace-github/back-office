import { useState, useEffect } from 'react';

// Custom hook for managing session storage
export default function useSessionStorage<ValueType>(
  key: string,
  defaultValue: ValueType | null = null
) {
  const isClient = typeof window !== 'undefined'; // Check if we're on the client side

  const [value, setValue] = useState(() => {
    if (isClient) {
      const storedValue = sessionStorage.getItem(key);
      try {
        return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
      } catch (error) {
        console.error(`Error parsing session storage value for key ${key}:`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          setValue(e.newValue !== null ? JSON.parse(e.newValue) : defaultValue);
        } catch (error) {
          console.error(`Error parsing session storage value for key ${key}:`, error);
          setValue(defaultValue);
        }
      }
    };

    if (isClient) {
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }

    return undefined;
  }, [key, defaultValue, isClient]);

  const setSessionStorageValue = (
    newValue: ValueType | ((prevValue: ValueType | null) => ValueType)
  ) => {
    if (isClient) {
      setValue(prevValue => {
        const updatedValue =
          typeof newValue === 'function'
            ? (newValue as (prevValue: ValueType | null) => ValueType)(prevValue)
            : newValue;

        try {
          sessionStorage.setItem(key, JSON.stringify(updatedValue));
        } catch (error) {
          console.error(`Error setting session storage value for key ${key}:`, error);
        }
        return updatedValue;
      });
    }
  };

  return [value, setSessionStorageValue];
}
