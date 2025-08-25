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
        className="block w-full px-1.5 py-[4px] border border-primary rounded-md shadow-sm outline-none focus:ring-primary focus:border-primary"
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
