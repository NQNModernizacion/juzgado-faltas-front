import { useEffect, useState } from 'react'

import { formatModel, formatModels } from '@/utils/estados'

import SelectSearch from '../../components/SelectSearch'
import ButtonAdmin from '../ButtonAdmin'
import CardAdmin from '../CardAdmin'
import {
  changeCheckPermission,
  changeUserPermissions,
  getPermissionsForm,
} from './handlers'
import { changeUser, groupedPermissions } from '../handlers'
import Loader from '@/components/Loader'
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

interface Permission {
  id: number
  name: string
}

interface StateContext {
  state: {
    loading: boolean
    role: Role | null
    user: User | null
  }
  setState: React.Dispatch<React.SetStateAction<any>>
}

interface DataContext {
  data: {
    users: User[]
    permissions: Permission[]
  }
  setData: React.Dispatch<React.SetStateAction<any>>
}

interface Props {
  stateContext: StateContext
  dataContext: DataContext
  show: boolean
}

const UserPermissionForm: React.FC<Props> = ({
  stateContext,
  dataContext,
  show,
}) => {
  const { state, setState } = stateContext
  const { loading, role, user } = state

  const { data, setData } = dataContext
  const { users, permissions } = data

  const [permissionsForm, setPermissionsForm] = useState<Record<
    string,
    Permission[]
  > | null>(null)

  useEffect(() => {
    const aux = getPermissionsForm(permissions, user)
    setPermissionsForm(aux)
  }, [permissions, user])

  const permissions_groups = permissionsForm
    ? groupedPermissions(permissionsForm)
    : null
  const grupos = permissions_groups ? Object.keys(permissions_groups) : []
  const [showBuscar, setShowBuscar] = useState(false)
  const handleUserSelect = (selectedUser: User) => {
    setState((prev) => ({ ...prev, user: selectedUser }))
    setShowBuscar(false)
  }
  if (!show) return null

  return (
    <>
      {' '}
      <div>
        <Button onClick={() => setShowBuscar(true)}>
          Buscar persona por DNI{' '}
        </Button>
        <AddUsers show={showBuscar} onUserSelect={handleUserSelect} />
      </div>{' '}
      <hr className="mt-3" />
      <div className="row m-0">
        <SelectSearch
          className={{
            container: 'col-6 col-lg-10',
            label: `form-label`,
          }}
          isClearable
          id="user"
          value={formatModel(user)}
          onChange={(u) => changeUser(u, users, setState)}
          disabled={loading}
          label="Seleccione un Usuario *"
          options={formatModels(users)}
        />
        <div className="col-6 col-lg-2 d-flex flex-column m-auto">
          <label className={`form-label invisible`}>HIDDEN</label>
          {loading && <Loader />}

          {!user?.roles?.some((r) => r.id === role?.id) && (
            <ButtonAdmin
              hidden={loading}
              className="rounded-md bg-primary-600 px-4 py-1"
              disabled={!user}
              onClick={() =>
                changeUserPermissions(user, permissionsForm, setState, setData)
              }
            >
              GUARDAR
            </ButtonAdmin>
          )}
        </div>
        <hr className="my-3" />
      </div>
      {!!user?.roles?.length && (
        <>
          {user.roles.map((r) => (
            <span
              key={r.id}
              role="button"
              className={`badge me-2 rounded-md bg-success px-4 py-1`}
            >
              {r.description}
            </span>
          ))}
          <hr className="my-3" />
        </>
      )}
      <CardAdmin
        grupos={grupos}
        permissions_groups={permissions_groups}
        loading={loading}
        changeCheckPermission={changeCheckPermission}
        permissionsForm={permissionsForm}
        setPermissionsForm={setPermissionsForm}
      />
    </>
  )
}

export default UserPermissionForm
