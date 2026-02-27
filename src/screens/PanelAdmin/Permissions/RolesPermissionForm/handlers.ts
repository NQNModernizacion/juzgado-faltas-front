// // import { postForm } from "@/api";



// // export const initialState = {
// //     role: {
// //         name: "",
// //         description: "",
// //     },
// //     permission: {
// //         name: "",
// //         description: "",
// //     },
// // }

// // /** Completa el tipo de dato PermissionForm, en funcion de los permisos que tiene cada uno de los roles*/
// // export const getPermissionsForm = (permissions, role) => {
// //   if (!permissions) {
// //     return null;
// //   }

// //   /* Primero asumimos que ningun permiso se encuentra en el rol, sirve para resetear el estado */
// //   const permissions_form = permissions.map((p) => ({ ...p, checked: false }));

// //   if (role) {
// //     /* Por cada permiso dentro del rol seteamos dentro de permissions_form que existe */
// //     role.permissions?.forEach((p) => {
// //       const index = permissions_form.findIndex((pf) => pf.id === p.id);
// //       permissions_form[index].checked = true;
// //     });
// //   }

// //   return permissions_form;
// // };

// // export const onChange = (e, setPermissionRolForm) => {
// //   const { id, value } = e.target;
  
// //   setPermissionRolForm((state) => {
// //     const updatedState = { ...state };
    
// //     if (id.startsWith("role_")) {
// //       updatedState.role = { ...updatedState.role, [id.replace("role_", "")]: value };
// //     } else if (id.startsWith("permission_")) {
// //       updatedState.permission = { ...updatedState.permission, [id.replace("permission_", "")]: value };
// //     }

// //     return updatedState;
// //   });
// // };


// // export const saveElement = async (permissionRolForm, setData, setState, model, edit) => {
// //   setState((state) => ({ ...state, loading: true }));

// //   const data = await postForm("permissions/save_element", {
// //     model,
// //     element: permissionRolForm[model],
// //     edit,
// //   });

// //   setState((state) => ({ ...state, loading: false }));

// //   if (data) {
// //     setData(data);
// //   }
// // };

// // export const changeCheckPermission = (pf, permissionsForm, setPermissionsForm) => {
// //   if (permissionsForm) {
// //     const permissions_form = [...permissionsForm];
// //     const index = permissionsForm.findIndex((_pf) => _pf.id === pf.id);
// //     permissions_form[index].checked = !permissions_form[index].checked;

// //     setPermissionsForm([...permissionsForm]);
// //   }
// // };

// // export const changeRolePermissions = async (role, permissionsForm, setState, setData) => {
// //   if (role && permissionsForm) {
// //     setState((state) => ({ ...state, loading: true }));

// //     const data = await postForm(`permissions/change_role_permission`, {
// //       role_id: role.id,
// //       permissions: [...permissionsForm],
// //     });

// //     if (data) {
// //       setData(data);
// //       const _role = data.roles?.find((r) => r.id === role.id);
// //       setState((state) => ({
// //         ...state,
// //         role: _role ? _role : null,
// //         loading: false,
// //       }));
// //     } else {
// //       setState((state) => ({ ...state, loading: false }));
// //     }
// //   }
// // };
// // export const changeUserRoles = async (user, rolesSelected, setState, setData) => {
// //   if (!user || !rolesSelected?.length) return;

// //   setState((s) => ({ ...s, loading: true }));

// //   const data = await postForm("permissions/change_user_role", {
// //     user_id: user.id,
// //     roles: rolesSelected.map((r) => r.value), // mandamos IDs
// //     action: "sync", // opcional
// //   });

// //   setState((s) => ({ ...s, loading: false }));

// //   if (data) {
// //     setData(data);

// //     // opcional: refrescar user desde response si viene actualizado
// //     const updatedUser = data.users?.find((u) => u.id === user.id);
// //     if (updatedUser) {
// //       setState((s) => ({ ...s, user: updatedUser }));
// //     }
// //   }
// // };
// import { axios } from "@/utils/axios";
// import { toast } from "react-toastify";
// import { toastOptions } from "@/config/toast";
// import { postForm } from "@/api";

// type RSOption = { label: string; value: string | number };

// export const initialState = {
//   role: { name: "", description: "" },
//   permission: { name: "", description: "" },
// };

// /** Permisos form (checklist) */
// export const getPermissionsForm = (permissions: any[] | null, role: any | null) => {
//   if (!permissions) return null;

//   const permissions_form = permissions.map((p) => ({ ...p, checked: false }));

//   if (role?.permissions?.length) {
//     role.permissions.forEach((p: any) => {
//       const idx = permissions_form.findIndex((pf) => pf.id === p.id);
//       if (idx >= 0) permissions_form[idx].checked = true;
//     });
//   }

//   return permissions_form;
// };

// export const onChange = (e: any, setPermissionRolForm: any) => {
//   const { id, value } = e.target;

//   setPermissionRolForm((state: any) => {
//     const updated = { ...state };

//     if (id.startsWith("role_")) {
//       updated.role = { ...updated.role, [id.replace("role_", "")]: value };
//     } else if (id.startsWith("permission_")) {
//       updated.permission = { ...updated.permission, [id.replace("permission_", "")]: value };
//     }

//     return updated;
//   });
// };

// export const saveElement = async (
//   permissionRolForm: any,
//   setData: any,
//   setState: any,
//   model: "role" | "permission",
//   edit: boolean
// ) => {
//   setState((s: any) => ({ ...s, loading: true }));
//   try {
//     const res = await postForm("permissions/save_element", {
//       model,
//       element: permissionRolForm[model],
//       edit,
//     });

//     if (res?.error) {
//       toast.error(res.error, toastOptions);
//       return;
//     }

//     if (res?.data) setData(res.data);
//   } catch (e: any) {
//     toast.error("Error guardando elemento", toastOptions);
//   } finally {
//     setState((s: any) => ({ ...s, loading: false }));
//   }
// };

// export const changeCheckPermission = (pf: any, permissionsForm: any[], setPermissionsForm: any) => {
//   if (!permissionsForm) return;
//   const next = [...permissionsForm];
//   const idx = next.findIndex((_pf) => _pf.id === pf.id);
//   if (idx >= 0) next[idx].checked = !next[idx].checked;
//   setPermissionsForm(next);
// };

// export const changeRolePermissions = async (role: any, permissionsForm: any[], setState: any, setData: any) => {
//   if (!role || !permissionsForm) return;

//   setState((s: any) => ({ ...s, loading: true }));
//   try {
//     const res = await postForm("permissions/change_role_permission", {
//       role_id: role.id,
//       permissions: [...permissionsForm],
//     });

//     if (res?.error) {
//       toast.error(res.error, toastOptions);
//       return;
//     }

//     // ⚠️ acá asumimos que el backend devuelve data con roles/perms actualizados
//     if (res?.data) setData(res.data);

//     // si tu backend devuelve roles en res.data.roles:
//     const updatedRole = res?.data?.roles?.find((r: any) => r.id === role.id) ?? null;
//     setState((s: any) => ({ ...s, role: updatedRole ?? s.role }));
//   } catch (e: any) {
//     toast.error("Error actualizando permisos del rol", toastOptions);
//   } finally {
//     setState((s: any) => ({ ...s, loading: false }));
//   }
// };

// /**
//  * ✅ ROLES MULTI DEL USUARIO
//  * Usa endpoint: POST /admin/users/{id}/sync-roles
//  * payload recomendado: { roles: ["admin", "admin.app"] }
//  *
//  * Si tu backend recibe IDs, cambiá roleNames por roleIds y payload por { role_ids: [...] }
//  */
// export const changeUserRoles = async (
//   user: { id: number } | null,
//   rolesSelected: RSOption[],
//   setState: any,
//   setData: any
// ) => {
//   if (!user?.id) return;

//   // ✅ por NOMBRE (más compatible con Spatie)
//   const roleNames = rolesSelected.map((r) => String(r.label)).filter(Boolean);

//   if (!roleNames.length) {
//     toast.error("Seleccioná al menos un rol", toastOptions);
//     return;
//   }

//   setState((s: any) => ({ ...s, loading: true }));
//   try {
//     const res = await postForm(`/admin/users/${user.id}/sync-roles`, {
//       roles: roleNames,
//     });

//     if (res?.error) {
//       toast.error(res.error, toastOptions);
//       return;
//     }

//     // si backend devuelve user actualizado
//     const updatedUser = res?.data?.user ?? null;
//     if (updatedUser) setState((s: any) => ({ ...s, user: updatedUser }));

//     // si backend devuelve bootstrap parcial/total
//     if (res?.data) setData((prev: any) => ({ ...prev, ...res.data }));
//   } catch (e: any) {
//     toast.error("Error asignando roles", toastOptions);
//   } finally {
//     setState((s: any) => ({ ...s, loading: false }));
//   }
// };



// export async function changeRolePermissionsMulti(
//   role: { id: number } | null,
//   selected: RSOption[],
//   setState: any
// ) {
//   if (!role?.id) {
//     toast.error("Seleccioná un rol", toastOptions);
//     return;
//   }

//   const permissionIds = (selected ?? [])
//     .map((p) => Number(p.value))
//     .filter((n) => Number.isFinite(n) && n > 0);

//   setState((s: any) => ({ ...s, loading: true }));

//   try {
//     const res = await axios().post(`/admin/roles/${role.id}/sync-permissions`, {
//       permission_ids: permissionIds,
//     });

//     const { data, error } = res.data ?? {};
//     if (error) throw new Error(error);

//     toast.success("Permisos del rol guardados", toastOptions);
//   } catch (e: any) {
//     const msg = e?.response?.data?.error ?? e?.message ?? "Error guardando permisos del rol";
//     toast.error(msg, toastOptions);
//   } finally {
//     setState((s: any) => ({ ...s, loading: false }));
//   }
// }

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