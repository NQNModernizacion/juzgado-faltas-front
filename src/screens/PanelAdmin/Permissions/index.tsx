// import { useEffect, useState, useCallback, useMemo } from 'react'

// import Container from '@/components/Container'
// import { initialDataState, initialState, screen_dic, unMount } from './handlers'
// import UserRoleForm from './UserRoleForm'
// import UserPermissionForm from './UserPermissionForm'
// import RolesPermissionForm from './RolesPermissionForm'

// interface State {
//   screen: keyof typeof screen_dic
//   loading: boolean
//   role: any | null
//   user: any | null
// }

// interface Data {
//   users: any[]
//   roles: any[]
//   permissions: any[]
// }

// const Permissions: React.FC = () => {
//   const [state, setState] = useState<State>({ ...initialState })
//   const [data, setData] = useState<Data>({ ...initialDataState })

//   useEffect(() => {
//     unMount(setData, setState)
//   }, [])

//   const handleScreenChange = useCallback((key: keyof typeof screen_dic) => {
//     setState((prevState) => ({
//       ...prevState,
//       screen: key,
//       role: null,
//       user: null,
//     }))
//   }, [])

//   const navigationButtons = useMemo(
//     () =>
//       Object.keys(screen_dic).map((key) => (
//         <button
//           className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
//             key === state.screen || state.loading
//               ? 'cursor-not-allowed bg-secondary-500 text-gray-100'
//               : 'bg-primary-600 text-white hover:bg-primary-700'
//           }`}
//           key={key}
//           disabled={key === state.screen || state.loading}
//           onClick={() => handleScreenChange(key as keyof typeof screen_dic)}
//         >
//           {screen_dic[key as keyof typeof screen_dic]}
//         </button>
//       )),
//     [state.screen, state.loading, handleScreenChange]
//   )

//   return (
//     <Container
//       title="Panel Admin"
//       subtitle={`Configuración de roles y permisos - ${screen_dic[state.screen]}`}
//       linkBack="/"
//     >
//       <div className="flex justify-center gap-3">{navigationButtons}</div>

//       <hr className="my-4 border-gray-300" />

//       <UserRoleForm
//         stateContext={{ state, setState }}
//         dataContext={{ data, setData }}
//         show={state.screen === 'user_roles'}
//       />

//       <UserPermissionForm
//         stateContext={{ state, setState }}
//         dataContext={{ data, setData }}
//         show={state.screen === 'user_permissions'}
//       />

//       <RolesPermissionForm
//         stateContext={{ state, setState }}
//         dataContext={{ data, setData }}
//         show={state.screen === 'roles_permissions'}
//       />
//     </Container>
//   )
// }

// export default Permissions
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

  const navigationButtons = useMemo(() => {
    return Object.keys(screen_dic).map((key) => {
      const isActive = key === state.screen
      const isDisabled = state.loading || isActive

     // base: más redondeado + padding tipo "pill"
     const base =
     'rounded-full px-6 py-2 text-sm font-semibold transition-colors border shadow-sm'

   // ACTIVO (amarillo + texto coral)
   const activeCls =
     'bg-secondary-500 text-primary-600 border-secondary-500 hover:bg-secondary-600'

   // INACTIVO (amarillo más suave + texto coral, para que los 3 sean "amarillos")
   // Si querés que el activo se note más, esto queda más clarito.
   const inactiveCls =
     'bg-secondary-100 text-primary-600 border-secondary-200 hover:bg-secondary-200'

   const disabledCls = isDisabled ? 'cursor-not-allowed opacity-90' : ''


      return (
        <button
        key={key}
        className={[base, isActive ? activeCls : inactiveCls, disabledCls]
          .filter(Boolean)
          .join(' ')}
        disabled={isDisabled}
        onClick={() => handleScreenChange(key as keyof typeof screen_dic)}
      >
          {screen_dic[key as keyof typeof screen_dic]}
        </button>
      )
    })
  }, [state.screen, state.loading, handleScreenChange])

  return (
    <Container
      title="Panel Admin"
      subtitle={`Configuración de roles y permisos - ${screen_dic[state.screen]}`}
      linkBack="/"
    >
      <div className="flex justify-center flex-wrap gap-3">
        {navigationButtons}
      </div>

      <hr className="my-4 border-border" />

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
