// import { Control, Controller, useController } from 'react-hook-form'
// import Select, { GroupBase, OptionsOrGroups } from 'react-select'
// import SmallText from '../SmallText'
// import ErrorText from '../ErrorText'
// import Label from '../Label'
// import { Option } from '@/interfaces/commons'

// interface SelectSearchProps {
//   name: string
//   label?: string
//   control: Control<any>
//   options: OptionsOrGroups<Option, GroupBase<Option>>
//   isMulti?: boolean
//   smallText?: string
//   hideErrors?: boolean
// }

// const SelectSearch = ({
//   name,
//   label,
//   smallText,
//   hideErrors = false,
//   control,
//   options,
//   ...props
// }: SelectSearchProps) => {
//   const {
//     formState: { errors },
//   } = useController({ name, control })

//   return (
//     <div>
//       <Label label={label} name={name} />

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <Select
//             options={options}
//             isClearable
//             onChange={(selectedValue) => {
//               const values = props.isMulti
//                 ? selectedValue.map((option: any) => option.value)
//                 : selectedValue?.value

//               field.onChange(values)
//             }}
//             value={
//               props.isMulti
//                 ? options.filter((option: any) =>
//                     field.value?.includes(option.value)
//                   )
//                 : options.find((option: any) => option.value === field.value)
//             }
//             {...props}
//           />
//         )}
//       />

//       <SmallText>{smallText}</SmallText>
//       <ErrorText hideErrors={hideErrors} error={errors[name]} />
//     </div>
//   )
// }

// export default SelectSearch

import Select, { GroupBase, Props as SelectProps } from 'react-select'
import Label from '../Label'

type ClassNameProps = {
  container?: string
  label?: string
  input?: string
}

type SelectSearchProps<T> = {
  id: string
  label?: string
  className?: ClassNameProps
  isMulti?: boolean
  value?: T
  defaultValue?: T
  options: SelectProps<T, boolean, GroupBase<T>>['options']
  onChange?: SelectProps<T, boolean, GroupBase<T>>['onChange']
  disabled?: boolean
  loading?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  customStyles?: SelectProps<T, boolean, GroupBase<T>>['styles']
  invalidMsg?: string
  buttonLabel?: () => JSX.Element
}

const SelectSearch = <T,>({
  id,
  label,
  className = {},
  isMulti,
  value,
  defaultValue,
  options,
  onChange,
  disabled,
  loading,
  isClearable,
  isSearchable = true,
  customStyles,
  invalidMsg,
  buttonLabel,
}: SelectSearchProps<T>) => {
  const selectStyles: SelectProps<T, boolean, GroupBase<T>>['styles'] = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      borderRadius: 12,
      backgroundColor: 'rgb(var(--mx-surface))',
  
      // ✅ normal gris
      borderColor: state.isFocused
        ? 'rgb(var(--mx-primary-400))'
        : 'rgb(var(--mx-border))',
      borderWidth: 1,
  
      // ✅ ring coral igual que input
      boxShadow: state.isFocused
        ? '0 0 0 3px rgba(var(--mx-primary-700), 0.25)'
        : 'none',
  
      // ':hover': {
      //   borderColor: state.isFocused
      //     ? 'rgb(var(--mx-primary-600))'
      //     : 'rgb(var(--mx-primary-700))',
      // },
    }),
  
    valueContainer: (base) => ({
      ...base,
      paddingLeft: 12,
      paddingRight: 12,
    }),
  
    placeholder: (base) => ({
      ...base,
      color: 'rgba(var(--mx-text), 0.6)',
    }),
  
    singleValue: (base) => ({
      ...base,
      color: 'rgb(var(--mx-text))',
    }),
  
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: 'rgb(var(--mx-border))',
    }),
  
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'rgb(var(--mx-primary-600))'
        : state.isFocused
          ? 'rgba(var(--mx-primary-600), 0.12)'
          : 'rgb(var(--mx-surface))',
      color: state.isSelected ? 'white' : 'rgb(var(--mx-text))',
    }),
  }
  

  const selectTheme = (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: 'rgb(var(--mx-primary-400))',
      primary25: 'rgba(var(--mx-primary-400), 0.12)',
      primary50: 'rgba(var(--mx-primary-400), 0.18)',
  
      // ✅ borde normal y hover = gris (sin “efecto” visible)
      neutral20: 'rgb(var(--mx-border))',
      neutral30: 'rgb(var(--mx-border))',
  
      neutral80: 'rgb(var(--mx-text))',
    },
  })
  

  return (
    <div className={className.container || 'mb-4'}>
      {label && (
        <Label
          label={label}
          name={id}
          className={className.label}
        />
      )}

      <Select<T, boolean, GroupBase<T>>
        className={className.input || 'mt-1'}
        id={id}
        name={id}
        isSearchable={isSearchable}
        isLoading={loading}
        isDisabled={disabled || loading}
        defaultValue={defaultValue}
        isClearable={isClearable}
        isMulti={isMulti}
        value={value}
        options={options}
        onChange={onChange}
        styles={customStyles ?? selectStyles}
        theme={selectTheme}
      />

      {invalidMsg && <span className="mt-1 text-sm text-red-600">{invalidMsg}</span>}
    </div>
  )
}

export default SelectSearch

