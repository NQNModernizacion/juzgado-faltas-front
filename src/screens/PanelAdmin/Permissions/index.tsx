import { useEffect, useState, useCallback, useMemo } from 'react'

import Container from '@/components/Container'
import { initialDataState, initialState, screen_dic, unMount } from './handlers'
import UserRoleForm from './UserRoleForm'
import UserPermissionForm from './UserPermissionForm'
import RolesPermissionForm from './RolesPermissionForm'

interface State {
  screen: keyof typeof screen_dic
  loading: boolean
  role: any | null
  user: any | null
}

interface Data {
  users: any[]
  roles: any[]
  permissions: any[]
}

const Permissions: React.FC = () => {
  const [state, setState] = useState<State>({ ...initialState })
  const [data, setData] = useState<Data>({ ...initialDataState })

  useEffect(() => {
    unMount(setData, setState)
  }, [])

  const handleScreenChange = useCallback((key: keyof typeof screen_dic) => {
    setState((prevState) => ({
      ...prevState,
      screen: key,
      role: null,
      user: null,
    }))
  }, [])

  const navigationButtons = useMemo(
    () =>
      Object.keys(screen_dic).map((key) => (
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            key === state.screen || state.loading
              ? 'cursor-not-allowed bg-secondary-500 text-gray-100'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          key={key}
          disabled={key === state.screen || state.loading}
          onClick={() => handleScreenChange(key as keyof typeof screen_dic)}
        >
          {screen_dic[key as keyof typeof screen_dic]}
        </button>
      )),
    [state.screen, state.loading, handleScreenChange]
  )

  return (
    <Container
      title="Panel Admin"
      subtitle={`Configuración de roles y permisos - ${screen_dic[state.screen]}`}
      linkBack="/"
    >
      <div className="flex justify-center gap-3">{navigationButtons}</div>

      <hr className="my-4 border-gray-300" />

      <UserRoleForm
        stateContext={{ state, setState }}
        dataContext={{ data, setData }}
        show={state.screen === 'user_roles'}
      />

      <UserPermissionForm
        stateContext={{ state, setState }}
        dataContext={{ data, setData }}
        show={state.screen === 'user_permissions'}
      />

      <RolesPermissionForm
        stateContext={{ state, setState }}
        dataContext={{ data, setData }}
        show={state.screen === 'roles_permissions'}
      />
    </Container>
  )
}

export default Permissions
