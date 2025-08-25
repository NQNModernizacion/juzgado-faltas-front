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
    <div className='container mx-auto'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {grupos?.map((g, index) => (
          <div
            key={`${g}_${index}`}
            className='overflow-hidden rounded-lg bg-white shadow-md'
          >
            <div className='bg-primary-600 p-3 text-lg font-semibold text-white'>
              {g}
            </div>
            <div className='p-4'>
              {permissions_groups &&
                permissions_groups[g]?.map((e, key) => (
                  <div className='flex items-center space-x-2' key={key}>
                    <input
                      className='rounded border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
                      type='checkbox'
                      id={e.id.toString()}
                      checked={e.checked}
                      disabled={!role || e.disabled || loading}
                      onChange={() =>
                        changeCheckPermission(
                          e,
                          permissionsForm,
                          setPermissionsForm
                        )
                      }
                    />

                    {e.roles?.length ? (
                      <Tooltip
                        disabled={!role || e.disabled || loading}
                        text={
                          <div>
                            <h6 className='font-semibold'>
                              Incluido en los roles:
                            </h6>
                            <ul className='list-disc pl-4'>
                              {e.roles.map((role) => (
                                <li key={role.id}>{role.description}</li>
                              ))}
                            </ul>
                          </div>
                        }
                      >
                        <label
                          role='button'
                          className={`cursor-pointer font-medium text-gray-700 ${!role || e.disabled || loading ? 'cursor-not-allowed opacity-50' : ''}`}
                          htmlFor={e.id.toString()}
                        >
                          {e.description}
                        </label>
                      </Tooltip>
                    ) : (
                      <label
                        className={`font-medium text-gray-700 ${!role || e.disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        htmlFor={e.id.toString()}
                      >
                        {e.description}
                      </label>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardAdmin
