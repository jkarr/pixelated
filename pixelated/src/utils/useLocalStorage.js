import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error setting to localStorage", error);
        }
    };

    const deleteKey = () => {
        window.localStorage.removeItem(key);
    };

    const keyExists = () => {
        return window.localStorage.getItem(key) !== null && window.localStorage.getItem(key) !== '';
    };

    return [storedValue, setValue, keyExists, deleteKey];
}