
import axiosLib from "axios";
import { URL_BACK, WEBLOGIN_URL } from "../config";
import { log } from "./logger";
import { useSessionStore } from "@/store/sessionStore";

function ensureLeadingSlash(p?: string) {
  if (!p) return p;
  return p.startsWith("/") ? p : `/${p}`;
}

const api = axiosLib.create({
  baseURL: URL_BACK,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    config.url = ensureLeadingSlash(config.url);

    if ((import.meta as any).env?.DEV) {
      const method = config.method?.toUpperCase() ?? "GET";
      log.info(`Request: ${method} ${config.baseURL ?? ""}${config.url ?? ""}`);
    }

    return config;
  },
  (error) => {
    log.error("Error iniciando request:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if ((import.meta as any).env?.DEV) {
      log.info("Código:", response.status);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if ((import.meta as any).env?.DEV && status) {
      log.info("Código:", status);
    }

    switch (status) {
      case 401:
        useSessionStore.getState().clearAppSession();
        window.location.href = WEBLOGIN_URL;
        break;
      case 450:
        window.location.href = WEBLOGIN_URL;
        break;
      case 503:
        useSessionStore.getState().clearAppSession();
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

export const axios = (overrideToken?: string | null) => {
  const token = overrideToken ?? useSessionStore.getState().token;

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
  return api;
};