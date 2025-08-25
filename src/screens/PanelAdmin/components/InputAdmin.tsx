import React from 'react'
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
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold text-sm text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default InputAdmin
