
import { toast } from "react-toastify";
import { toastOptions } from "@/config/toast";
import { axios } from "@/utils/axios";

type RSOption = { label: string; value: string | number };

export async function changeRolePermissionsMulti(
  role: { id: number } | null,
  selected: RSOption[],
  setState: any
) {
  if (!role?.id) {
    toast.error("Seleccioná un rol", toastOptions);
    return null;
  }

  const permission_ids = (selected ?? [])
    .map((p) => Number(p.value))
    .filter((n) => Number.isFinite(n) && n > 0);

  setState((s: any) => ({ ...s, loading: true }));

  try {
    const res = await axios().post(`admin/roles/${role.id}/sync-permissions`, {
      permission_ids,
    });

    const payload = res.data ?? {};
    if (payload?.error) throw new Error(payload.error);

    toast.success("Permisos del rol guardados", toastOptions);

    return payload?.data ?? null;
  } catch (e: any) {
    const msg = e?.response?.data?.error ?? e?.message ?? "Error guardando permisos del rol";
    toast.error(msg, toastOptions);
    return null;
  } finally {
    setState((s: any) => ({ ...s, loading: false }));
  }
}