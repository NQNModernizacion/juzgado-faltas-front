// import { default as a } from 'axios'

// import { URL_BACK, WEBLOGIN_URL } from '../config'
// import { getToken, logout } from './localStorage'

// export const axios = (token = getToken()) => {
//   a.defaults.baseURL = URL_BACK
//   a.defaults.headers.common['Authorization'] = 'Bearer ' + token
//   a.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
//   a.defaults.headers.post['Accept'] = 'application/json'
//   a.defaults.validateStatus = (status) => {
//     __DEV__ && console.info('Codigo: ' + status)

//     switch (status) {
//       case 450:
//         window.location.href = WEBLOGIN_URL
//         break
//       case 403:
//         // No tiene permiso
//         window.location.href = '/#/'
//         break
//       case 503:
//         logout()
//         break
//       default:
//         break
//     }

//     return true
//   }

//   if (__DEV__) {
//     a.interceptors.request.use(
//       (config) => {
//         console.info(
//           `Iniciando petición a: ${config.baseURL} con método: ${config.method}`
//         )
//         return config
//       },
//       (error) => {
//         console.error('Error al iniciar la petición:', error)
//       }
//     )
//   }

//   return a
// }
// import axiosLib from 'axios'
import axiosLib from "axios";
import { URL_BACK, WEBLOGIN_URL } from "../config";
import { getToken, logout } from "./localStorage";
import { log } from "./logger";

function ensureLeadingSlash(p?: string) {
  if (!p) return p;
  return p.startsWith("/") ? p : `/${p}`;
}

// instancia única
const api = axiosLib.create({
  baseURL: URL_BACK, // ej: "/api" en dev con proxy, o "https://dominio/api" en prod
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  validateStatus: (status) => {
    // ojo: validateStatus corre en TODOS los requests (incluye errores)
    log.info("Código:", status);

    switch (status) {
      case 450:
        window.location.href = WEBLOGIN_URL;
        break;
      case 403:
        window.location.href = "/#/";
        break;
      case 503:
        logout();
        break;
      default:
        break;
    }
    return true;
  },
});

// interceptor request (solo 1 vez)
if ((import.meta as any).env?.DEV) {
  api.interceptors.request.use(
    (config) => {
      // normalizamos url para evitar /apime
      config.url = ensureLeadingSlash(config.url);

      const method = config.method?.toUpperCase() ?? "GET";
      log.info(`Request: ${method} ${config.baseURL ?? ""}${config.url ?? ""}`);

      return config;
    },
    (error) => {
      log.error("Error iniciando request:", error);
      return Promise.reject(error);
    }
  );
}

// helper para setear token por request (sin mutar defaults globales)
export const axios = (token = getToken()) => {
  api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  return api;
};

