// /* eslint-disable react-refresh/only-export-components */
// import React, { useState } from 'react'

// import { Actions, Store } from '../interfaces'

// import * as h from './handlers'
// import TokenRefresher from '@/components/TokenRefresher'

// type UserContextType = { store: Store; actions: Actions; loading: boolean }
// export const UserContext = React.createContext<UserContextType>({
//   store: { ...h.initialState },
//   loading: false,
//   actions: {} as Actions,
// })

// export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
//   const [store, setStore] = useState<Store>({ ...h.initialState })
//   const [loading, setLoding] = useState(false)

//   const actions: Actions = {
//     /** Datos del usuario */
//     setStore: (data: Store) => setStore(data),
//     setUser: (user) => setStore((store) => ({ ...store, user })),
//     setLoading: (loading: boolean) => setLoding(loading),

//     user: () => store.user,
//     persona: () => (store.user ? store.user.persona : null),
//     appData: () => store.app_data,
//     frontType: () => store.front_types[0],
//     token: () => store.token,
//     /* Roles y permisos */
//     hasRole: (role) => h.hasRole(role, store),
//     hasPermission: (permission) => h.hasPermission(permission, store),
//   }

//   return (
//     <UserContext.Provider value={{ store, actions, loading }}>
//       <TokenRefresher />
//       {children}
//     </UserContext.Provider>
//   )
// }

/* eslint-disable react-refresh/only-export-components */
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

  const token = useSessionStore((s) => s.token);
  const user = useSessionStore((s) => s.user);
  const setSession = useSessionStore((s) => s.setSession);
  const setUser = useSessionStore((s) => s.setUser);
  const clearAppSession = useSessionStore((s) => s.clearAppSession);
  const hasRole = useSessionStore((s) => s.hasRole);
  const hasPermission = useSessionStore((s) => s.hasPermission);

  const store: Store = useMemo(
    () => ({
      ...h.initialState,
      token: token ?? null,
      user: user ?? null,
    }),
    [token, user]
  );

  const actions: Actions = {
    setStore: (data: Store) => {
      setSession({
        token: data.token,
        user: data.user,
      });
    },

    setUser: (nextUser) => setUser(nextUser),
    setLoading: (nextLoading: boolean) => setLoading(nextLoading),

    user: () => user,
    persona: () => (user ? user.persona : null),
    appData: () => null,
    frontType: () => null,
    token: () => token,

    hasRole: (role) => hasRole(role),
    hasPermission: (permission) => hasPermission(permission),
  };

  return (
    <UserContext.Provider value={{ store, actions, loading }}>
      <TokenRefresher />
      {children}
    </UserContext.Provider>
  );
};