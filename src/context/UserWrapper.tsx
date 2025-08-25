/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react'

import { Actions, Store } from '../interfaces'

import * as h from './handlers'
import TokenRefresher from '@/components/TokenRefresher'

type UserContextType = { store: Store; actions: Actions; loading: boolean }
export const UserContext = React.createContext<UserContextType>({
  store: { ...h.initialState },
  loading: false,
  actions: {} as Actions,
})

export const UserWrapper = ({ children }: { children: React.ReactNode }) => {
  const [store, setStore] = useState<Store>({ ...h.initialState })
  const [loading, setLoding] = useState(false)

  const actions: Actions = {
    /** Datos del usuario */
    setStore: (data: Store) => setStore(data),
    setUser: (user) => setStore((store) => ({ ...store, user })),
    setLoading: (loading: boolean) => setLoding(loading),

    user: () => store.user,
    persona: () => (store.user ? store.user.persona : null),
    appData: () => store.app_data,
    frontType: () => store.front_types[0],
    token: () => store.token,
    /* Roles y permisos */
    hasRole: (role) => h.hasRole(role, store),
    hasPermission: (permission) => h.hasPermission(permission, store),
  }

  return (
    <UserContext.Provider value={{ store, actions, loading }}>
      <TokenRefresher />
      {children}
    </UserContext.Provider>
  )
}
