import { toastOptions } from '@/config/toast'
import { axios } from '@/utils/axios'
import { toast } from 'react-toastify'

export const screen_dic = {
  // add_users: 'Agregar usuario',
  user_roles: 'Usuarios y Roles',
  user_permissions: 'Usuarios y Permisos',
  roles_permissions: 'Roles y Permisos',
}

export const initialState = {
  user: null,
  role: null,
  permission: null,
  screen: 'roles_permissions',
  loading: false,
}

export const initialDataState = {
  permissions: null,
  roles: null,
  users: null,
}

export const unMount = async (setData, setState) => {
  setState((state) => ({ ...state, loading: true }))

  const response = await axios().get('permissions')

  const { data, error } = response.data

  if (error) {
    toast.error(error, toastOptions)
    return null
  }

  setState((state) => ({ ...state, loading: false }))

  if (data) {
    setData(data)
  }
}

export const changeUser = (user, users, setState) => {
  const _user = users?.find((u) => u.id === user?.value)
  if (_user) {
    setState((state) => ({ ...state, user: _user }))
  } else {
    setState((state) => ({ ...state, user: null }))
  }
}

export const changeRole = (role, roles, setState, callback = null) => {
  const _role = roles?.find((u) => u.id === role?.value)
  if (_role) {
    setState((state) => ({ ...state, role: _role }))
    callback && callback(_role, 'role')
  } else {
    setState((state) => ({ ...state, role: null }))
  }
}

export const changePermission = (
  permission,
  permissions,
  setState,
  callback = null
) => {
  const _permission = permissions?.find((u) => u.id === permission?.value)
  if (_permission) {
    setState((state) => ({ ...state, permission: _permission }))
    callback && callback(_permission, 'permission')
  } else {
    setState((state) => ({ ...state, permission: null }))
  }
}

/** Agrugamos los permisos segun el tipo */
export const groupedPermissions = (permissions = null) => {
  if (!permissions) {
    return null
  }

  return permissions.reduce((acc, permission) => {
    const group = permission.name.split('.')[0]
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push({ ...permission })
    return acc
  }, {})
}
