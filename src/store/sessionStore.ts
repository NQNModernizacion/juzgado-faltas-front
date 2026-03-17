// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { WEBLOGIN_URL } from "@/config";

// export type SessionUser = {
//   id: number;
//   email: string;
//   roles?: string[];
//   permissions?: string[];
//   persona?: any | null;
//   token_weblogin?: string | null;
// };

// type SessionState = {
//   token: string | null;
//   tokenType: string | null;
//   expiresAt: string | null;
//   user: SessionUser | null;
//   hydrated: boolean;

//   setHydrated: (value: boolean) => void;
//   setSession: (data: {
//     token: string;
//     tokenType?: string | null;
//     expiresAt?: string | null;
//     user?: SessionUser | null;
//   }) => void;
//   setUser: (user: SessionUser | null) => void;
//   clearAppSession: () => void;

//   hasRole: (role: string) => boolean;
//   hasPermission: (permission: string) => boolean;
// };

// const WEBLOGIN_ORIGIN = new URL(WEBLOGIN_URL).origin;

// const base = import.meta.env.BASE_URL || "/";
// const basePath = base !== "/" && base.endsWith("/") ? base.slice(0, -1) : base;

// /**
//  * Key propia de la app.
//  * Vive en localStorage, pero no pisa la del portal.
//  */
// export const APP_SESSION_KEY = `mx:${WEBLOGIN_ORIGIN}${basePath}:session`;

// export const useSessionStore = create<SessionState>()(
//   persist(
//     (set, get) => ({
//       token: null,
//       tokenType: null,
//       expiresAt: null,
//       user: null,
//       hydrated: false,

//       setHydrated: (value) => set({ hydrated: value }),

//       setSession: ({
//         token,
//         tokenType = "Bearer",
//         expiresAt = null,
//         user = null,
//       }) =>
//         set({
//           token,
//           tokenType,
//           expiresAt,
//           user,
//         }),

//       setUser: (user) => set({ user }),

//       clearAppSession: () => {
//         set({
//           token: null,
//           tokenType: null,
//           expiresAt: null,
//           user: null,
//         });

//         localStorage.removeItem(APP_SESSION_KEY);
//       },

//       hasRole: (role) => {
//         const roles = get().user?.roles ?? [];
//         return roles.includes(role);
//       },

//       hasPermission: (permission) => {
//         const permissions = get().user?.permissions ?? [];
//         return permissions.includes(permission);
//       },
//     }),
//     {
//       name: APP_SESSION_KEY,
//       storage: createJSONStorage(() => localStorage),
//       version: 1,
//       partialize: (state) => ({
//         token: state.token,
//         tokenType: state.tokenType,
//         expiresAt: state.expiresAt,
//         user: state.user,
//       }),
//       onRehydrateStorage: () => (state) => {
//         state?.setHydrated(true);
//       },
//     }
//   )
// );

//------------------------------------------------------------------------------
// src/store/sessionStore.ts
// src/store/sessionStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { scopedAppKey } from "@/utils/storageScope";

export type SessionUser = {
  id: number;
  email: string;
  roles?: string[];
  permissions?: string[];
  persona?: any | null;
  token_weblogin?: string | null;
};

type SessionState = {
  token: string | null;
  tokenType: string | null;
  expiresAt: string | null;
  user: SessionUser | null;
  hydrated: boolean;

  setHydrated: (value: boolean) => void;
  setSession: (data: {
    token: string;
    tokenType?: string | null;
    expiresAt?: string | null;
    user?: SessionUser | null;
  }) => void;
  setUser: (user: SessionUser | null) => void;
  clearAppSession: () => void;

  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
};

/** * Key única por aplicación basada en el Pathname.
 * Esto evita que las apps en el mismo dominio pisen sus datos.
 */
export const APP_SESSION_KEY = scopedAppKey("session");

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      token: null,
      tokenType: null,
      expiresAt: null,
      user: null,
      hydrated: false,

      // --- Acciones ---
      setHydrated: (value) => set({ hydrated: value }),

      setSession: ({ token, tokenType = "Bearer", expiresAt = null, user = null }) =>
        set({
          token,
          tokenType,
          expiresAt,
          user,
        }),

      setUser: (user) => set({ user }),

      clearAppSession: () => {
        set({
          token: null,
          tokenType: null,
          expiresAt: null,
          user: null,
        });
        // Al usar persist con sessionStorage, esto limpia la entrada específica
        sessionStorage.removeItem(APP_SESSION_KEY);
      },

      // --- Helpers de Autorización ---
      hasRole: (role) => {
        const roles = get().user?.roles ?? [];
        return roles.includes(role);
      },

      hasPermission: (permission) => {
        const permissions = get().user?.permissions ?? [];
        return permissions.includes(permission);
      },
    }),
    {
      name: APP_SESSION_KEY,
      /** * REQUISITO: SessionStorage para la sesión interna de la app.
       * Esto hace que si el usuario cierra la pestaña, la sesión de la app expire,
       * pero la de MuniExpress (en LocalStorage) pueda permanecer.
       */
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      // Solo persistimos lo necesario
      partialize: (state) => ({
        token: state.token,
        tokenType: state.tokenType,
        expiresAt: state.expiresAt,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);