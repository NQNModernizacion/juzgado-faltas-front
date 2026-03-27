
import React, { useMemo, useState } from "react";
import { Actions, Store } from "../interfaces";
import * as h from "./handlers";
import TokenRefresher from "@/components/TokenRefresher";
import { useSessionStore } from "@/store/sessionStore";

type UserContextType = {
  store: Store;
  actions: Actions;
  loading: boolean;
};

export const UserContext = React.createContext<UserContextType>({
  store: {} as Store,
  loading: false,
  actions: {} as Actions,
});

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  // Consumo de Zustand (Única fuente de verdad)
  const session = useSessionStore();
  const { token, user, setSession, setUser, hasRole, hasPermission } = session;

  /**
   * Mapeamos el store para mantener compatibilidad con la interfaz vieja.
   * Al usar useMemo y depender de session, se mantiene sincronizado con Zustand.
   */
  const store: Store = useMemo(
    () => ({
      ...h.initialState,
      token: token ?? null,
      user: user ?? null,
    }),
    [token, user]
  );

  /**
   * 
   * Cuando el código viejo llame a ua.setStore, en realidad estará actualizando Zustand.
   */
  const actions: Actions = useMemo(() => ({
    setStore: (data: any) => {
      setSession({
        token: data.token,
        tokenType: data.token_type ?? "Bearer",
        expiresAt: data.expires_at ?? null,
        user: data.user,
      });
    },

    setUser: (nextUser) => setUser(nextUser),
    setLoading: (nextLoading: boolean) => setLoading(nextLoading),

    // Helpers de acceso rápido
    user: () => user,
    persona: () => (user ? user.persona : null),
    appData: () => null,
    frontType: () => null,
    token: () => token,

    // Vinculación directa a la lógica de permisos de Zustand
    hasRole: (role: string) => hasRole(role),
    hasPermission: (permission: string) => hasPermission(permission),
  }), [token, user, setSession, setUser, hasRole, hasPermission]);

  return (
    <UserContext.Provider value={{ store, actions, loading }}>
      <TokenRefresher />
      {children}
    </UserContext.Provider>
  );
};