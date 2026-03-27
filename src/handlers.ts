import { toast } from "react-toastify";
import { axios } from "./utils/axios";
import { getParams, removeURLParameter } from "./utils/common";
import { setStorage } from "./utils/localStorage";
import { toastOptions } from "./config/toast";


type InitActions = {
  // setStore es lo que definió tu UserWrapper para mapear a Zustand
  setStore: (data: any) => void;
  setLoading: (value: boolean) => void;
};

export const initApp = async (ua: InitActions) => {
  const token = getParams().token;

  if (token) {
    ua.setLoading(true); // Usamos la acción del context para el loading
    showSpinner(true);

    try {
      const response = await axios(token).post("auth", { type: "app_login" });
      showSpinner(false);

      const { data, error } = response.data ?? {};

      if (data) {
        // 1. Persistimos en LocalStorage Global (para el portal MuniExpress)
        setStorage(data); 
        
        // 2. Actualizamos Zustand a través del wrapper
        // Esto automáticamente disparará el sessionStorage de la app
        ua.setStore(data);
      }

      if (error) {
        toast.error(error, toastOptions);
        ua.setLoading(false);
        return;
      }

      // Limpieza de URL
      let url = removeURLParameter(window.location.href, "token");
      window.location.href = url + "#/";
      
    } catch (err) {
      showSpinner(false);
      ua.setLoading(false);
      console.error("Error en initApp:", err);
    }
  } else {
    ua.setLoading(false);
  }
};

/** Spinner global del index.html */
export const showSpinner = (loading: boolean) => {
  if (loading) {
    // @ts-expect-error
    window.cargarSpinner?.();
  } else {
    // @ts-expect-error
    window.eliminarSpinner?.();
  }
};