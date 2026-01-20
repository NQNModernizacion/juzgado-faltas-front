// import React from 'react'
// import Tooltip from '../../components/Tooltip'

// type Role = {
//   id: number
//   description: string
// }

// type Permission = {
//   id: number
//   description: string
//   checked: boolean
//   disabled?: boolean
//   roles?: Role[]
// }

// type PermissionsGroup = {
//   [key: string]: Permission[]
// }

// type CardAdminProps = {
//   grupos: string[]
//   permissions_groups: PermissionsGroup
//   role?: boolean
//   loading: boolean
//   changeCheckPermission: (
//     e: Permission,
//     permissionsForm: any,
//     setPermissionsForm: React.Dispatch<React.SetStateAction<any>>
//   ) => void
//   permissionsForm: any
//   setPermissionsForm: React.Dispatch<React.SetStateAction<any>>
// }

// const CardAdmin: React.FC<CardAdminProps> = ({
//   grupos,
//   permissions_groups,
//   role = true,
//   loading,
//   changeCheckPermission,
//   permissionsForm,
//   setPermissionsForm,
// }) => {
//   return (
//     <div className='container mx-auto'>
//       <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
//         {grupos?.map((g, index) => (
//           <div
//             key={`${g}_${index}`}
//             className='overflow-hidden rounded-lg bg-white shadow-md'
//           >
//             <div className='bg-primary-600 p-3 text-lg font-semibold text-white'>
//               {g}
//             </div>
//             <div className='p-4'>
//               {permissions_groups &&
//                 permissions_groups[g]?.map((e, key) => (
//                   <div className='flex items-center space-x-2' key={key}>
//                     <input
//                       className='rounded border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
//                       type='checkbox'
//                       id={e.id.toString()}
//                       checked={e.checked}
//                       disabled={!role || e.disabled || loading}
//                       onChange={() =>
//                         changeCheckPermission(
//                           e,
//                           permissionsForm,
//                           setPermissionsForm
//                         )
//                       }
//                     />

//                     {e.roles?.length ? (
//                       <Tooltip
//                         disabled={!role || e.disabled || loading}
//                         text={
//                           <div>
//                             <h6 className='font-semibold'>
//                               Incluido en los roles:
//                             </h6>
//                             <ul className='list-disc pl-4'>
//                               {e.roles.map((role) => (
//                                 <li key={role.id}>{role.description}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         }
//                       >
//                         <label
//                           role='button'
//                           className={`cursor-pointer font-medium text-gray-700 ${!role || e.disabled || loading ? 'cursor-not-allowed opacity-50' : ''}`}
//                           htmlFor={e.id.toString()}
//                         >
//                           {e.description}
//                         </label>
//                       </Tooltip>
//                     ) : (
//                       <label
//                         className={`font-medium text-gray-700 ${!role || e.disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
//                         htmlFor={e.id.toString()}
//                       >
//                         {e.description}
//                       </label>
//                     )}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default CardAdmin
import React from 'react'
import Tooltip from '../../components/Tooltip'

type Role = {
  id: number
  description: string
}

type Permission = {
  id: number
  description: string
  checked: boolean
  disabled?: boolean
  roles?: Role[]
}

type PermissionsGroup = {
  [key: string]: Permission[]
}

type CardAdminProps = {
  grupos: string[]
  permissions_groups: PermissionsGroup
  role?: boolean
  loading: boolean
  changeCheckPermission: (
    e: Permission,
    permissionsForm: any,
    setPermissionsForm: React.Dispatch<React.SetStateAction<any>>
  ) => void
  permissionsForm: any
  setPermissionsForm: React.Dispatch<React.SetStateAction<any>>
}

const CardAdmin: React.FC<CardAdminProps> = ({
  grupos,
  permissions_groups,
  role = true,
  loading,
  changeCheckPermission,
  permissionsForm,
  setPermissionsForm,
}) => {
  return (
    <div className="mx-auto w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grupos?.map((g, index) => (
          <div
            key={`${g}_${index}`}
            className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
          >
            {/* Header: más “MuniExpress” (coral suave, no azul) */}
            <div className="flex items-center justify-between gap-2 border-b border-border bg-primary/10 px-4 py-3">
              <div className="text-base font-semibold text-primary-800">
                {g}
              </div>

              {/* Mini badge opcional para dar vida visual */}
              <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-xs font-semibold text-primary-900">
                {permissions_groups?.[g]?.length ?? 0}
              </span>
            </div>

            <div className="p-4">
              <div className="flex flex-col gap-3">
                {permissions_groups &&
                  permissions_groups[g]?.map((e, key) => {
                    const disabled = !role || e.disabled || loading

                    return (
                      <div
                        key={key}
                        className={`flex items-start gap-3 rounded-md px-2 py-1.5 transition-colors ${
                          disabled ? 'opacity-60' : 'hover:bg-primary/5'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={e.id.toString()}
                          checked={e.checked}
                          disabled={disabled}
                          onChange={() =>
                            changeCheckPermission(
                              e,
                              permissionsForm,
                              setPermissionsForm
                            )
                          }
                          className={[
                            'mt-0.5 size-4 rounded border border-border',
                            'bg-surface',
                            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-surface',
                            'disabled:cursor-not-allowed',
                            // si está check, que se note con coral
                            e.checked ? 'accent-primary' : '',
                          ].join(' ')}
                        />

                        {e.roles?.length ? (
                          <Tooltip
                            disabled={disabled}
                            text={
                              <div>
                                <h6 className="font-semibold text-text">
                                  Incluido en los roles:
                                </h6>
                                <ul className="list-disc pl-4 text-sm text-text">
                                  {e.roles.map((role) => (
                                    <li key={role.id}>{role.description}</li>
                                  ))}
                                </ul>
                              </div>
                            }
                          >
                            <label
                              role="button"
                              htmlFor={e.id.toString()}
                              className={[
                                'select-none text-sm font-medium',
                                disabled
                                  ? 'cursor-not-allowed text-muted'
                                  : 'cursor-pointer text-text hover:text-primary-800',
                              ].join(' ')}
                            >
                              {e.description}
                            </label>
                          </Tooltip>
                        ) : (
                          <label
                            htmlFor={e.id.toString()}
                            className={[
                              'select-none text-sm font-medium',
                              disabled
                                ? 'cursor-not-allowed text-muted'
                                : 'cursor-pointer text-text hover:text-primary-800',
                            ].join(' ')}
                          >
                            {e.description}
                          </label>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardAdmin

