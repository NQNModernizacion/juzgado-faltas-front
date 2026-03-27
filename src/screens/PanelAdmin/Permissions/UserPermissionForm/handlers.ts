import { axios } from "@/utils/axios";

import { toast } from "react-toastify";
import { toastOptions } from "@/config/toast";
type RSOption = { label: string; value: string | number };

/** Completa el tipo de dato PermissionForm */
export const getPermissionsForm = (permissions, user) => {
  if (!permissions) {
    return null;
  }


  const permissions_form = permissions.map((p) => ({
    ...p,
    checked: false,
    disabled: !user,
    roles: [],
  }));

  if (user) {
    /* Por cada permiso dentro del usuaro seteamos dentro de permissions_form que existe */
    user.permissions?.forEach((p) => {
      const index = permissions_form.findIndex((pf) => pf.id === p.id);
      permissions_form[index].checked = true;
    });

    /* Por cada permiso de cada uno de los roles del usuario verificamos si lo contiene */
    user.roles?.forEach((user_role) =>
      user_role.permissions?.forEach((role_permission) => {
        const index = permissions_form.findIndex((pf) => pf.id === role_permission.id);

        permissions_form[index].disabled = true;
        permissions_form[index].roles.push(user_role);
      })
    );
  }

  return permissions_form;
};

export const changeCheckPermission = (pf, permissionsForm, setPermissionsForm) => {
  if (permissionsForm) {
    const permissions_form = [...permissionsForm];
    const index = permissionsForm.findIndex((_pf) => _pf.id === pf.id);
    permissions_form[index].checked = !permissions_form[index].checked;

    setPermissionsForm([...permissionsForm]);
  }
};

export const changeUserPermissions = async (user, permissionsForm, setState, setData) => {
  if (user && permissionsForm) {
    setState((state) => ({ ...state, loading: true }));

    const data = await axios().post(`permissions/change_user_permissions`, {
      user_id: user.id,
      permissions: [...permissionsForm],
    });

    if (data) {
      const user = data.data.data;

      setData(data.data.data);
      setState((state) => ({
        ...state,
        loading: false,
        user: user,
      }));
    } else {
      setState((state) => ({ ...state, loading: false }));
    }
  }
};


export async function changeUserPermissionsMulti(
  user: { id: number } | null,
  selected: RSOption[],
  setState: any
) {
  if (!user?.id) {
    toast.error("Seleccioná un usuario", toastOptions);
    return;
  }

  const permissionIds = (selected ?? [])
    .map((p) => Number(p.value))
    .filter((n) => Number.isFinite(n) && n > 0);

  setState((s: any) => ({ ...s, loading: true }));

  try {
    const res = await axios().post(`/admin/users/${user.id}/sync-permissions`, {
      permission_ids: permissionIds,
    });

    const { data, error } = res.data ?? {};
    if (error) throw new Error(error);

    toast.success("Permisos guardados", toastOptions);

  } catch (e: any) {
    const msg = e?.response?.data?.error ?? e?.message ?? "Error guardando permisos";
    toast.error(msg, toastOptions);
  } finally {
    setState((s: any) => ({ ...s, loading: false }));
  }
}