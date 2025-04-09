import { useState, useCallback } from "react";

function usePersistedState<T>(key: string, initialState: T) {
  const readValue = useCallback(() => {
    if (typeof window === "undefined") {
      // Server-side rendering
      return initialState;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialState;
    }
  }, [key, initialState]);

  const [state, setStateInternal] = useState<T>(readValue());

  const setState = useCallback(
    (value: T) => {
      try {
        setStateInternal(value);

        if (typeof window !== "undefined") {
          if (
            value === initialState ||
            (typeof value === "object" &&
              value !== null &&
              Object.values(value).every((v) => v === ""))
          ) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(value));
          }
        }
      } catch (error) {
        console.warn(`Error updating localStorage key "${key}":`, error);
      }
    },
    [key, initialState]
  );

  return { state, setState, readValue };
}

export default usePersistedState;
