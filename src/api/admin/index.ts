import { apiGet, apiPost } from "@/api/client";
import type {
  AdminBootstrapDto,
  UserByDniDto,
  SyncUserRolesDto,
  SyncUserPermissionsDto,
} from "./types";

export function fetchAdminBootstrap() {
  return apiGet<AdminBootstrapDto>("admin/bootstrap");
}

// ✅ buscar por dni
export function fetchUserByDni(dni: string | number) {
  const clean = String(dni).replace(/\D/g, "");
  return apiGet<UserByDniDto>(`admin/user-by-dni/${clean}`);
}

// bodies
export type SyncUserRolesBody = { roles: string[] };            // names
export type SyncUserPermsBody = { permission_ids: number[] };   // ids
export type SyncRolePermsBody = { permission_ids: number[] };   // ids

// ✅ sync roles (devuelve roles/permisos como NAMES)
export function syncUserRoles(userId: number, body: SyncUserRolesBody) {
  return apiPost<SyncUserRolesDto>(`admin/users/${userId}/sync-roles`, body);
}

// ✅ sync perms (devuelve permissions como NAMES)
export function syncUserPermissions(userId: number, body: SyncUserPermsBody) {
  return apiPost<SyncUserPermissionsDto>(`admin/users/${userId}/sync-permissions`, body);
}

export function syncRolePermissions(roleId: number, body: SyncRolePermsBody) {
  return apiPost(`admin/roles/${roleId}/sync-permissions`, body);
}