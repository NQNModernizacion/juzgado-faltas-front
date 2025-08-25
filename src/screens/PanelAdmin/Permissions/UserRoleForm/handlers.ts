import { postForm } from '@/api'

/** Completa el tipo de dato PermissionForm, en funcion de los permisos que tiene cada uno de los roles*/
export const getPermissionsForm = (permissions, role) => {
  if (!permissions) {
    return null
  }

  /* Primero asumimos que ningun permiso se encuentra en el rol, sirve para resetear el estado */
  const permissions_form = permissions.map((p) => ({ ...p, checked: false }))

  if (role) {
    /* Por cada permiso dentro del rol seteamos dentro de permissions_form que existe */
    role.permissions?.forEach((p) => {
      const index = permissions_form.findIndex((pf) => pf.id === p.id)
      permissions_form[index].checked = true
    })
  }

  return permissions_form
}

export const changeUserRole = async (user, role, setState, setData, action) => {
  if (user && role) {
    setState((state) => ({ ...state, loading: true }))

    const data = await postForm(`permissions/change_user_role`, {
      user_id: user.id,
      role_id: role.id,
      action,
    })

    if (data) {
      setData(data)
      setState((state) => ({
        ...state,
        loading: false,
        user: data, // al agregar o quitar un rol data es el user
        // user: data.users.find((u) => u.id === user.id),
      }))
    } else {
      setState((state) => ({ ...state, loading: false }))
    }
  }
}
