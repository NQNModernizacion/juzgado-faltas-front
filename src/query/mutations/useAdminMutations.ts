import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import {
  syncUserRoles,
  syncUserPermissions,
  syncRolePermissions,   // 👈 AGREGAR
} from "@/api/admin";

import { adminKeys, userKeys } from "../keys";

/* ===========================
   USER → ROLES
=========================== */
export function useSyncUserRoles(tokenKey: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roles }: { userId: number; roles: string[] }) =>
      syncUserRoles(userId, { roles }),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: adminKeys.bootstrap(tokenKey),
      });
    },
  });
}

/* ===========================
   USER → PERMISSIONS
=========================== */
export function useSyncUserPermissions(tokenKey: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      permissionIds,
    }: {
      userId: number;
      permissionIds: number[];
    }) =>
      syncUserPermissions(userId, {
        permission_ids: permissionIds,
      }),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: adminKeys.bootstrap(tokenKey),
      });
    },
  });
}

/* ===========================
   ROLE → PERMISSIONS   ✅ NUEVO
=========================== */
export function useSyncRolePermissions(tokenKey: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: number;
      permissionIds: number[];
    }) =>
      syncRolePermissions(roleId, {
        permission_ids: permissionIds,
      }),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: adminKeys.bootstrap(tokenKey),
      });
    },
  });
}

/* ===========================
   INVALIDATE USER BY DNI
=========================== */
export function invalidateUserByDni(
  qc: QueryClient,
  tokenKey: string | null,
  dni: string
) {
  const dniClean = String(dni).replace(/\D/g, "");

  qc.invalidateQueries({
    queryKey: userKeys.byDni(tokenKey, dniClean),
  });
}