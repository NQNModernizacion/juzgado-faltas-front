import { useEffect, useState } from 'react'
import SelectSearch from '../../components/SelectSearch'
import ButtonAdmin from '../ButtonAdmin'
import CardAdmin from '../CardAdmin'
import { changeUserRole, getPermissionsForm } from './handlers'
import { changeRole, changeUser, groupedPermissions } from '../handlers'
import Loader from '@/components/Loader'
import {
  formatEstado,
  formatEstados,
  formatModels,
  formatProvider,
} from '@/utils/estados'
import Button from '@/components/Button'
import AddUsers from '../AddUsers'

interface Role {
  id: number
  description: string
}

interface User {
  id: number
  roles: Role[]
}

interface State {
  loading: boolean
  role: Role | null
  user: User | null
}

interface DataContext {
  users: User[]
  roles: Role[]
  permissions: any[]
}

interface Props {
  stateContext: {
    state: State
    setState: React.Dispatch<React.SetStateAction<State>>
  }
  dataContext: {
    data: DataContext
    setData: React.Dispatch<React.SetStateAction<DataContext>>
  }
  show: boolean
}

const UserRoleForm: React.FC<Props> = ({ stateContext, dataContext, show }) => {
  const { state, setState } = stateContext
  const { loading, role, user } = state

  const { data, setData } = dataContext
  const { users, roles, permissions } = data
  const [showBuscar, setShowBuscar] = useState(false)
  const [permissionsForm, setPermissionsForm] = useState<any | null>(null)

  useEffect(() => {
    setPermissionsForm(getPermissionsForm(permissions, role))
  }, [state, data])

  const permissions_groups = groupedPermissions(permissionsForm)
  const grupos = permissions_groups ? Object.keys(permissions_groups) : []

  const handleUserSelect = (selectedUser: User) => {
    setState((prev) => ({ ...prev, user: selectedUser }))
    setShowBuscar(false)
  }

  if (!show) return null

  return (
    <>
      <div>
        <Button onClick={() => setShowBuscar(true)}>
          Buscar persona por DNI{' '}
        </Button>
        <AddUsers show={showBuscar} onUserSelect={handleUserSelect} />
      </div>
      <hr className="mt-3" />
      <div className="row m-0 space-y-3">
        <SelectSearch
          className={{ container: 'col-12 col-lg-5', label: 'form-label' }}
          isClearable
          id="user"
          value={formatProvider(user)}
          onChange={(u) => changeUser(u, users, setState)}
          disabled={loading}
          label="Seleccione un Usuario *"
          options={formatModels(data.users)}
        />
        <SelectSearch
          className={{
            container: 'col-12 col-lg-5',
            label: 'form-label',
          }}
          isSearchable
          isClearable
          id="role"
          value={formatEstado(role)}
          onChange={(u) => changeRole(u, roles, setState)}
          disabled={loading}
          label="Seleccione un Rol *"
          options={formatEstados(data.roles)}
        />
        <div className="col-12 col-lg-2 d-flex flex-column m-auto">
          <label className="form-label invisible">HIDDEN</label>
          {loading && <Loader />}
          {!user?.roles?.some((r) => r.id === role?.id) ? (
            <ButtonAdmin
              hidden={loading}
              className=""
              disabled={!user || !role}
              onClick={() =>
                changeUserRole(user!, role!, setState, setData, 'add_user_role')
              }
            >
              AGREGAR
            </ButtonAdmin>
          ) : (
            <ButtonAdmin
              hidden={loading}
              className="bg-red-500"
              disabled={!user || !role}
              onClick={() =>
                changeUserRole(
                  user!,
                  role!,
                  setState,
                  setData,
                  'remove_user_role'
                )
              }
            >
              RETIRAR
            </ButtonAdmin>
          )}{' '}
          <hr className="my-3" />
        </div>
      </div>
      {!!user?.roles?.length && (
        <>
          {user.roles.map((r) => (
            <span
              key={r.id}
              role="button"
              className={`badge me-2 rounded-md border-2 border-gray-200  px-4 py-1 ${
                r.id === role?.id ? 'disabled bg-primary-600 border-primary-600 text-white' : ''
              }`}
              onClick={() =>
                !loading && setState((prev) => ({ ...prev, role: r }))
              }
            >
              {r.description}
            </span>
          ))}
          <hr className="my-3" />
        </>
      )}
      {!!role && (
        <>
          <span>
            Configuración de <b>{role.description}</b>
          </span>
          <hr className='my-3'/>
        </>
      )}
      <CardAdmin
        grupos={grupos}
        permissions_groups={permissions_groups}
        role={role}
        loading={loading}
        changeCheckPermission={null}
        permissionsForm={permissionsForm}
        setPermissionsForm={setPermissionsForm}
      />
    </>
  )
}

export default UserRoleForm
