import { scopedKey } from "./storageScope";
import { readJSON, writeJSON, removeKey } from "./storage";

export const APP_KEY = scopedKey("store");

export const getAppSession = () => readJSON(sessionStorage, APP_KEY);

export const setAppSession = (data: any) => writeJSON(sessionStorage, APP_KEY, data);

export const removeAppSession = () => {
  removeKey(sessionStorage, APP_KEY);
};

// export const removeUser = () => {
//   sessionStorage.removeItem(APP_KEY)
// }
