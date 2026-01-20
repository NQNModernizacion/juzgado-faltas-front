// import React from 'react'
// interface InputAdminProps {
//   id: string
//   label: string
//   value: string
//   disabled: boolean
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
// }

// const InputAdmin: React.FC<InputAdminProps> = ({
//   id,
//   label,
//   value,
//   disabled,
//   onChange,
// }) => {
//   return (
//     <div className="flex flex-col gap-2">
//       <label htmlFor={id} className="font-semibold text-sm text-gray-700">
//         {label}
//       </label>
//       <input
//         id={id}
//         type="text"
//         value={value}
//         disabled={disabled}
//         onChange={onChange}
//         className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   )
// }

// export default InputAdmin

import Label from '@/components/Inputs/Label'
import React from 'react'
//import Label from '@/components/Label'

interface InputAdminProps {
  id: string
  label: string
  value: string
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputAdmin: React.FC<InputAdminProps> = ({
  id,
  label,
  value,
  disabled,
  onChange,
}) => {
  return (
    <div className="space-y-1">
      {/* ✅ usa el mismo Label centralizado */}
      <Label label={label} name={id} />

      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={[
          'block w-full rounded-xl px-3 py-2',
          'bg-surface text-text placeholder:text-muted',
          'border border-border',
          'outline-none transition',
          // ✅ focus coral unificado
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-400/25',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        ].join(' ')}
      />
    </div>
  )
}

export default InputAdmin
