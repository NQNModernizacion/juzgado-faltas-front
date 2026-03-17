

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

//*---------------------------------------------------------------------------

// import { scopedKey } from "./storageScope";

// export const KEY = scopedKey("store");

// export const getSession = () => {
//   const raw = sessionStorage.getItem(KEY);
//   return raw ? JSON.parse(raw) : null;
// };

// export const setStorage = (data) => {
//   sessionStorage.setItem(KEY, JSON.stringify(data));
// };

// export const removeStore = () => {
//   sessionStorage.removeItem(KEY);
// };

  
// export const getToken = () => getSession()?.token ?? null;


// export const logout = async () => {
//   try {
//     await axios().post("logout"); 
//   } finally {
//     sessionStorage.removeItem(KEY); 
//     window.location.href = WEBLOGIN_URL;
//   }
// };

//---------------------------------------------------------------------------------
// import { WEBLOGIN_URL } from "../config";
// import { axios } from "./axios";

// export const KEY = new URL(WEBLOGIN_URL).origin;

// export const getStorage = <T = any>() => {
//   const raw = localStorage.getItem(KEY);
//   return raw ? (JSON.parse(raw) as T) : null;
// };

// export const setStorage = (data: any) => {
//   localStorage.setItem(KEY, JSON.stringify(data));
// };

// export const removeUser = () => {
//   localStorage.removeItem(KEY);
// };

// export const getToken = () => getStorage<any>()?.token ?? null;

// export const viewSession = () => console.info(getStorage());

// export const logout = async () => {
//   try {
//     await axios().post("logout");
//   } finally {
//     localStorage.removeItem(KEY);
//     window.location.href = WEBLOGIN_URL;
//   }
// };
//---------------------------------------------------------------------------------
// src/utils/localStorage.ts
// import { WEBLOGIN_URL } from "../config";
// import { axios } from "./axios";
// import { scopedGlobalKey } from "./storageScope";

// // Key única para MuniExpress en LocalStorage
// export const GLOBAL_KEY = scopedGlobalKey("auth");

// export const getGlobalStorage = <T = any>() => {
//   const raw = localStorage.getItem(GLOBAL_KEY);
//   return raw ? (JSON.parse(raw) as T) : null;
// };

// export const setGlobalStorage = (data: any) => {
//   localStorage.setItem(GLOBAL_KEY, JSON.stringify(data));
// };

// // export const logout = async () => {
// //   try {
// //     await axios().post("logout");
// //   } finally {
// //     // Limpiamos ambos para seguridad
// //     localStorage.removeItem(GLOBAL_KEY);
// //     sessionStorage.clear(); // Limpia la sesión de la app actual
// //     window.location.href = WEBLOGIN_URL;
// //   }
// // };
// export const logoutAppOnly = () => {
//   // Limpiamos el sessionStorage de la app (donde ahora vive Zustand)
//   sessionStorage.clear(); 
  
//   // Redirigimos a la URL de MuniExpress (sin desloguear globalmente)
//   window.location.href = WEBLOGIN_URL; 
// };

// /**
//  * Cierre de sesión TOTAL (MuniExpress + App)
//  * Este solo se usaría si realmente quieres que el usuario salga de todo el sistema.
//  */
// export const logoutGlobal = async () => {
//   try {
//     await axios().post("logout");
//   } finally {
//     localStorage.removeItem(GLOBAL_KEY);
//     sessionStorage.clear();
//     window.location.href = WEBLOGIN_URL;
//   }
// };

// src/utils/localStorage.ts
import { WEBLOGIN_URL } from "../config";
import { axios } from "./axios";
import { scopedGlobalKey } from "./storageScope";

// Key única para MuniExpress en LocalStorage
// Esto evita que las apps se pisen porque ya no usa solo el origin plano
export const GLOBAL_KEY = scopedGlobalKey("auth");

/** Renombramos a getStorage para mantener compatibilidad con el resto de la app */
export const getStorage = <T = any>() => {
  const raw = localStorage.getItem(GLOBAL_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
};

/** Renombramos a setStorage para mantener compatibilidad */
export const setStorage = (data: any) => {
  localStorage.setItem(GLOBAL_KEY, JSON.stringify(data));
};

/** Limpia solo la app actual y vuelve al portal (MuniExpress sigue vivo) */
export const logoutAppOnly = () => {
  sessionStorage.clear(); // Limpia Zustand (sesión de pestaña)
  window.location.href = WEBLOGIN_URL; 
};

/** Cierre de sesión TOTAL */
export const logoutGlobal = async () => {
  try {
    await axios().post("logout");
  } finally {
    localStorage.removeItem(GLOBAL_KEY); // Mata MuniExpress
    sessionStorage.clear();             // Mata la App
    window.location.href = WEBLOGIN_URL;
  }
};

// Helpers adicionales que podrías necesitar
export const getToken = () => getStorage<any>()?.token ?? null;
export const removeUser = () => localStorage.removeItem(GLOBAL_KEY);



