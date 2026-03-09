import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { scopedKey } from "@/utils/storageScope";
import { readJSON, writeJSON, removeKey } from "@/utils/storage";

export type SessionUser = {
  id: number;
  email: string;
  roles?: string[];
  permissions?: string[];
  persona?: any;
};

type SessionState = {
  token: string | null;
  tokenType: "Bearer" | null;
  expiresAt: string | null;
  user: SessionUser | null;
  hydrated: boolean;

  setHydrated: (value: boolean) => void;

  setSession: (data: {
    token: string;
    tokenType?: "Bearer";
    expiresAt?: string | null;
    user?: SessionUser | null;
  }) => void;

  setUser: (user: SessionUser | null) => void;
  clearAppSession: () => void;

  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
};

const APP_SESSION_KEY = scopedKey("session");
const MUNIEXPRESS_SESSION_KEY = "mx:muniexpress:sso";

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      tokenType: null,
      expiresAt: null,
      user: null,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      setSession: ({
        token,
        tokenType = "Bearer",
        expiresAt = null,
        user = null,
      }) =>
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

        removeKey(sessionStorage, APP_SESSION_KEY);
      },

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
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

/**
 * Helpers para la sesión global de MuniExpress.
 * Esta NO se borra cuando cerrás una app.
 */
export const getMuniExpressSession = <T = any>() =>
  readJSON<T>(localStorage, MUNIEXPRESS_SESSION_KEY);

export const setMuniExpressSession = (data: any) =>
  writeJSON(localStorage, MUNIEXPRESS_SESSION_KEY, data);

export const removeMuniExpressSession = () =>
  removeKey(localStorage, MUNIEXPRESS_SESSION_KEY);