import { useEffect, useState } from 'react'

import { formatEstado, formatEstados } from '@/utils/estados'

import SelectSearch from '../../components/SelectSearch'
import ButtonAdmin from '../ButtonAdmin'
import CardAdmin from '../CardAdmin'

import {
  changeCheckPermission,
  changeRolePermissions,
  getPermissionsForm,
  initialState,
  onChange,
  saveElement,
} from './handlers'
import { changePermission, changeRole, groupedPermissions } from '../handlers'
import InputAdmin from '../../components/InputAdmin'

const RolesPermissionForm = ({ stateContext, dataContext, show }) => {
  if (!show) return null

  const { state, setState } = stateContext
  const { loading, role, permission } = state

  const { data, setData } = dataContext
  const { roles, permissions } = data
 
  const [permissionsForm, setPermissionsForm] = useState(null)

  const [permissionRolForm, setPermissionRolForm] = useState({
    ...initialState,
  })

  useEffect(() => {
    setPermissionsForm(getPermissionsForm(permissions, role))

    if (!role) {
      setPermissionRolForm((state) => ({
        ...state,
        role: { ...initialState.role },
      }))
    }

    if (!permission) {
      setPermissionRolForm((state) => ({
        ...state,
        permission: { ...initialState.permission },
      }))
    }
  }, [state, data])

  const permissions_groups = groupedPermissions(permissionsForm)
  const grupos = permissions_groups && Object.keys(permissions_groups)

  const selectElement = (rol, action) => {
    const callBack = (element, key) => {
      setPermissionRolForm((state) => ({
        ...state,
        [key]: {
          id: element.id,
          name: element.name,
          description: element.description,
          edit: true,
        },
      }))
    }

    if (action === 'role') {
      setPermissionRolForm({ ...initialState })
      changeRole(rol, roles, setState, callBack)
    }

    if (action === 'permission') {
      setPermissionRolForm({ ...initialState })
      changePermission(rol, permissions, setState, callBack)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-1/2 rounded border p-4">
          <h5 className="text-lg font-semibold">Configuración del Rol</h5>
          <div className="flex gap-2">
            <SelectSearch
              className={{ container: 'w-3/4' }}
              isClearable
              id="role"
              value={formatEstado(role)}
              onChange={(rol) => selectElement(rol, 'role')}
              disabled={loading}
              label="Seleccione un Rol"
              options={formatEstados(roles)}
            />
            <ButtonAdmin
              disabled={!role || loading}
              onClick={() =>
                changeRolePermissions(role, permissionsForm, setState, setData)
              }
              className="mt-6 rounded-md"
            >
              GUARDAR
            </ButtonAdmin>
          </div>

          <hr className="my-4" />

          <div className="flex flex-col gap-3">
            <InputAdmin
              id="role_name"
              label="Nombre"
              disabled={loading}
              value={permissionRolForm.role.name}
              onChange={(e) => onChange(e, setPermissionRolForm)}
            />
            <InputAdmin
              id="role_description"
              label="Descripción"
              disabled={loading}
              value={permissionRolForm.role.description}
              onChange={(e) => onChange(e, setPermissionRolForm)}
            />

            <ButtonAdmin
              disabled={
                !permissionRolForm.role.name ||
                !permissionRolForm.role.description ||
                loading
              }
              onClick={() =>
                saveElement(
                  permissionRolForm,
                  setData,
                  setState,
                  'role',
                  permissionRolForm.role.edit
                )
              }
            >
              {permissionRolForm.role.edit ? 'MODIFICAR' : 'AGREGAR'}
            </ButtonAdmin>
          </div>
        </div>

        <div className="w-1/2 rounded border p-4">
          <h5 className="text-lg font-semibold">Configuración del Permiso</h5>
          <div className="flex gap-2">
            <SelectSearch
              className={{ container: 'w-3/4' }}
              isSearchable
              isClearable
              id="permission"
              value={formatEstado(permission)}
              onChange={(permission) => selectElement(permission, 'permission')}
              disabled={loading}
              label="Seleccione un Permiso"
              options={formatEstados(permissions)}
            />
            <ButtonAdmin
              disabled={!role || loading}
              className="mt-6 rounded-md"
              onClick={() =>
                changeRolePermissions(role, permissionsForm, setState, setData)
              }
            >
              GUARDAR
            </ButtonAdmin>
          </div>

          <hr className="my-4" />

          <div className="flex flex-col gap-3">
            <InputAdmin
              id="permission_name"
              label="Nombre"
              disabled={loading}
              value={permissionRolForm.permission.name}
              onChange={(e) => onChange(e, setPermissionRolForm)}
            />
            <InputAdmin
              id="permission_description"
              label="Descripción"
              disabled={loading}
              value={permissionRolForm.permission.description}
              onChange={(e) => onChange(e, setPermissionRolForm)}
            />

            <ButtonAdmin
              disabled={
                !permissionRolForm.permission.name ||
                !permissionRolForm.permission.description ||
                loading
              }
              onClick={() =>
                saveElement(
                  permissionRolForm,
                  setData,
                  setState,
                  'permission',
                  permissionRolForm.permission.edit
                )
              }
            >
              {permissionRolForm.permission.edit ? 'MODIFICAR' : 'AGREGAR'}
            </ButtonAdmin>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <CardAdmin
        grupos={grupos}
        permissions_groups={permissions_groups}
        role={role}
        loading={loading}
        changeCheckPermission={changeCheckPermission}
        permissionsForm={permissionsForm}
        setPermissionsForm={setPermissionsForm}
      />
    </div>
  )
}

export default RolesPermissionForm
