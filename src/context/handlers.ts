import { Permission, Role, Store } from '../interfaces'

export const getSession = () =>
  JSON.parse(localStorage.getItem(window.location.origin) as string)

export const initialState: Store = {
  ...getSession(),
}

export type SetStore = React.Dispatch<React.SetStateAction<Store>>

/** Roles y permisos */
export const hasRole = (role: string, store: Store | null) => {
  if (!role) return false
  if (!store) return false

  return !!store.user?.roles?.some((r) => r.name === role)
}

export const hasPermission = (permission: string, store: Store | null) => {
  if (!permission) return false
  if (!store) return false

  if (store.user?.permissions?.some((p) => p.name === permission)) {
    return true
  }

  /* Generamos un arreglo nuevo de permisos de esos roles */
  const permissionsRoles = store.user?.roles?.reduce((prev: Permission[], curr: Role) => {
    if (curr.permissions) {
      prev.push(...curr.permissions)
    }
    return prev
  }, [])

  return !!permissionsRoles?.some((p) => p.name === permission)
}

export const hasDirectPermission = (permission: string, store: Store) => {
  if (!permission) return false
  if (!store) return false

  return !!store.user?.permissions?.some((p) => p.name === permission)
}
