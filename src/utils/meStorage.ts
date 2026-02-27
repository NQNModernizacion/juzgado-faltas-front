import { readJSON, writeJSON, removeKey } from "./storage";

const ME_KEY = `mx:${window.location.origin}:/muniexpress:sso`;

export const getMeSession = () => readJSON(localStorage, ME_KEY);

export const setMeSession = (data: any) => writeJSON(localStorage, ME_KEY, data);

export const removeMeSession = () => {
  removeKey(localStorage, ME_KEY);
};

// export const removeUser = () => {
//   localStorage.removeItem(ME_KEY)
// }
