import { Option } from '@/interfaces/commons'
import { Control, useController } from 'react-hook-form'
import ErrorText from '../ErrorText'
import Label from '../Label'
import SmallText from '../SmallText'

type SelectProps = {
  label: string
  name: string
  options: Option[]
  control: Control<any>
  smallText?: string
  hideErrors?: boolean
}

const Select = ({ label, name, options, control, smallText, hideErrors = false }: SelectProps) => {
  const {
    formState: { errors },
  } = useController({ name, control })

  return (
    <div>
      <Label label={label} name={name} />

      <select
        id={`input-${name}`}
        {...control.register(name)}
        className="block w-full rounded-xl bg-surface px-3 py-2 text-text border border-border shadow-sm outline-none transition focus:ring-2 focus:ring-primary-600/25 focus:border-primary-600"

      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <SmallText>{smallText}</SmallText>
      <ErrorText hideErrors={hideErrors} error={errors[name]} />
    </div>
  )
}

export default Select
