import { axios } from "@/utils/axios";
import { toast } from "react-toastify";
import { toastOptions } from "@/config/toast";

export type RSOption = { label: string; value: string | number };

/** ✅ Checklist de permisos para un rol */
export const getPermissionsForm = (
  permissions: any[] | null,
  role: any | null
) => {
  if (!permissions) return null;

  const permissions_form = permissions.map((p) => ({ ...p, checked: false }));

  if (role?.permissions?.length) {
    role.permissions.forEach((p: any) => {
      const idx = permissions_form.findIndex((pf) => pf.id === p.id);
      if (idx >= 0) permissions_form[idx].checked = true;
    });
  }

  return permissions_form;
};

/**
 * ✅ Suma roles al usuario (no pisa los existentes)
 * Requiere backend: POST admin/users/{user}/sync-roles
 * payload: { roles: ["admin","admin.app"] }
 * response recomendado: { data: { added:[], already:[], roles:[], permissions:[] }, error:null }
 */
export const addUserRoles = async (user: any, rolesSelected: RSOption[], setState: any) => {
  if (!user?.id) return;

  const roleIds = (rolesSelected ?? [])
    .map((r) => Number(r.value))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!roleIds.length) {
    toast.error("Seleccioná al menos un rol", toastOptions);
    return;
  }

  setState((s: any) => ({ ...s, loading: true }));

  try {
    // 👇 SIN "/" adelante
    const res = await axios().post(`admin/users/${user.id}/sync-roles`, {
      role_ids: roleIds,
    });

    const payload = res.data ?? {};
    if (payload?.error) throw new Error(payload.error);

    const roleNames: string[] = payload?.data?.roles ?? [];
    toast.success("Roles actualizados", toastOptions);

    setState((s: any) => ({
      ...s,
      loading: false,
      user: {
        ...s.user,
        role_names: roleNames,
        roles: roleNames.map((name: string) => ({ id: -1, name, description: name })),
      },
    }));
  } catch (e: any) {
    toast.error(
      e?.response?.data?.error ?? e?.message ?? "Error asignando roles",
      toastOptions
    );
    setState((s: any) => ({ ...s, loading: false }));
  }
};

/**
 * ✅ Reemplaza roles del usuario (modo “sync” estricto)
 * Útil si tenés un botón GUARDAR que “deja exactamente lo seleccionado”.
 * Usa el mismo endpoint: POST admin/users/{id}/sync-roles
 * payload: { roles: [...] }
 */
export async function changeUserRoles(
  user: any,
  rolesSelected: RSOption[],
  setState: any
) {
  if (!user?.id) {
    toast.error("Seleccioná un usuario válido", toastOptions);
    return;
  }

  const roleNames = (rolesSelected ?? [])
    .map((r) => String(r.label))
    .filter(Boolean);

  if (!roleNames.length) {
    toast.error("Seleccioná al menos un rol", toastOptions);
    return;
  }

  setState((s: any) => ({ ...s, loading: true }));
  try {
    const res = await axios().post(`admin/users/${user.id}/sync-roles`, {
      roles: roleNames,
    });

    if (!res || res.status < 200 || res.status >= 300) {
      throw new Error(`HTTP ${res?.status ?? "??"}`);
    }

    const { data, error } = res.data ?? {};
    if (error) throw new Error(error);

    const newRoles: string[] = data?.roles ?? roleNames;
    const newPerms: string[] = data?.permissions ?? user?.permission_names ?? [];

    toast.success("Roles guardados", toastOptions);

    setState((s: any) => ({
      ...s,
      loading: false,
      user: {
        ...s.user,
        id: user.id,
        role_names: newRoles,
        permission_names: newPerms,
        roles: newRoles.map((name: string) => ({ id: -1, name, description: name })),
        permissions: newPerms.map((name: string) => ({ id: -1, name })),
      },
    }));
  } catch (e: any) {
    const status = e?.response?.status;
    const msg =
      e?.response?.data?.error ??
      (status ? `HTTP ${status}` : null) ??
      e?.message ??
      "Error guardando roles";

    toast.error(msg, toastOptions);
    setState((s: any) => ({ ...s, loading: false }));
  }
}