export const readJSON = <T = any>(storage: Storage, key: string): T | null => {
  const raw = storage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
};

export const writeJSON = (storage: Storage, key: string, value: any) => {
  storage.setItem(key, JSON.stringify(value));
};

export const removeKey = (storage: Storage, key: string) => {
  storage.removeItem(key);
};
  