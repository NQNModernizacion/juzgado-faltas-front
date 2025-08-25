import { Control, Controller, useController } from 'react-hook-form'
import Select, { GroupBase, OptionsOrGroups } from 'react-select'
import SmallText from '../SmallText'
import ErrorText from '../ErrorText'
import Label from '../Label'
import { Option } from '@/interfaces/commons'

interface SelectSearchProps {
  name: string
  label?: string
  control: Control<any>
  options: OptionsOrGroups<Option, GroupBase<Option>>
  isMulti?: boolean
  smallText?: string
  hideErrors?: boolean
}

const SelectSearch = ({
  name,
  label,
  smallText,
  hideErrors = false,
  control,
  options,
  ...props
}: SelectSearchProps) => {
  const {
    formState: { errors },
  } = useController({ name, control })

  return (
    <div>
      <Label label={label} name={name} />

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            options={options}
            isClearable
            onChange={(selectedValue) => {
              const values = props.isMulti
                ? selectedValue.map((option: any) => option.value)
                : selectedValue?.value

              field.onChange(values)
            }}
            value={
              props.isMulti
                ? options.filter((option: any) =>
                    field.value?.includes(option.value)
                  )
                : options.find((option: any) => option.value === field.value)
            }
            {...props}
          />
        )}
      />

      <SmallText>{smallText}</SmallText>
      <ErrorText hideErrors={hideErrors} error={errors[name]} />
    </div>
  )
}

export default SelectSearch
