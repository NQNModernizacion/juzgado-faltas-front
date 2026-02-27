export const readJSON = (storage: Storage, key: string) => {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  };
  
  export const writeJSON = (storage: Storage, key: string, value: any) => {
    storage.setItem(key, JSON.stringify(value));
  };
  
  export const removeKey = (storage: Storage, key: string) => {
    storage.removeItem(key);
  };
  