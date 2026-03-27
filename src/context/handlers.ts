
import type { Store } from "../interfaces";

const EMPTY_STORE: Store = {
  user: null,
  app_data: null,
  front_types: [],
  token: null,
};

export const initialState: Store = EMPTY_STORE;

/** Roles y permisos */
export const hasRole = (role: string, store: Store | null) => {
  if (!role || !store) return false;

  const roles = store.user?.roles ?? [];

  return roles.some((r: any) =>
    typeof r === "string" ? r === role : r?.name === role
  );
};

export const hasPermission = (permission: string, store: Store | null) => {
  if (!permission || !store) return false;

  const permissions = store.user?.permissions ?? [];

  return permissions.some((p: any) =>
    typeof p === "string" ? p === permission : p?.name === permission
  );
};

export const hasDirectPermission = (permission: string, store: Store | null) => {
  if (!permission || !store) return false;

  const permissions = store.user?.permissions ?? [];

  return permissions.some((p: any) =>
    typeof p === "string" ? p === permission : p?.name === permission
  );
};
