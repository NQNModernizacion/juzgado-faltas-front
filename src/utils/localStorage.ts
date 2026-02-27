 import { WEBLOGIN_URL } from '../config'
// import { Store } from '../interfaces'
 import { axios } from './axios'

// const KEY = window.location.origin as string

// export const getStorage = () =>
//   JSON.parse(localStorage.getItem(KEY) as string) as Store | null

// export const getAppData = () => getStorage()?.app_data

// export const removeUser = () => {
//   localStorage.removeItem(KEY)
// }

// export const setStorage = (s: Store | null) =>
//   localStorage.setItem(KEY, JSON.stringify(s))

// export const getToken = () => getStorage()?.token

// export const viewSession = () => console.info(getStorage())


// utils/localStorage.ts (o .js)
import { scopedKey } from "./storageScope";

export const KEY = scopedKey("store");

export const getSession = () => {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setStorage = (data) => {
  sessionStorage.setItem(KEY, JSON.stringify(data));
};

export const removeStore = () => {
  sessionStorage.removeItem(KEY);
};

// export const removeUser = () => {
  //   sessionStorage.removeItem(KEY);
  // };
  
export const getToken = () => getSession()?.token ?? null;

// export const logout = () => {
//   sessionStorage.removeItem(KEY);
// };

export const logout = async () => {
  try {
    await axios().post("logout"); 
  } finally {
    sessionStorage.removeItem(KEY); 
    window.location.href = WEBLOGIN_URL;
  }
};









