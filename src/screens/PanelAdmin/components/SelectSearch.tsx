// import Select, { GroupBase, Props as SelectProps } from 'react-select'

// type ClassNameProps = {
//   container?: string
//   label?: string
//   input?: string
// }

// type SelectSearchProps<T> = {
//   id: string
//   label?: string
//   className?: ClassNameProps
//   isMulti?: boolean
//   value?: T
//   defaultValue?: T
//   options: SelectProps<T, boolean, GroupBase<T>>['options']
//   onChange?: SelectProps<T, boolean, GroupBase<T>>['onChange']
//   disabled?: boolean
//   loading?: boolean
//   isClearable?: boolean
//   isSearchable?: boolean
//   customStyles?: SelectProps<T, boolean, GroupBase<T>>['styles']
//   invalidMsg?: string
//   buttonLabel?: () => JSX.Element
// }

// const SelectSearch = <T,>({
//   id,
//   label,
//   className = {},
//   isMulti,
//   value,
//   defaultValue,
//   options,
//   onChange,
//   disabled,
//   loading,
//   isClearable,
//   isSearchable = true,
//   customStyles,
//   invalidMsg,
//   buttonLabel,
// }: SelectSearchProps<T>) => {
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       borderRadius: 12,
//       borderColor: state.isFocused
//         ? 'rgb(var(--primary-600))'
//         : 'rgb(var(--border, 220 223 230))',
//       boxShadow: state.isFocused
//         ? '0 0 0 3px rgba(var(--primary-600), 0.18)'
//         : 'none',
//       ':hover': {
//         borderColor: 'rgb(var(--primary-700))',
//       },
//       minHeight: 40,
//     }),

//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? 'rgb(var(--primary-600))'
//         : state.isFocused
//           ? 'rgba(var(--primary-600), 0.12)'
//           : 'white',
//       color: state.isSelected ? 'white' : 'rgb(var(--text))',
//     }),

//     singleValue: (base) => ({
//       ...base,
//       color: 'rgb(var(--text))',
//     }),

//     placeholder: (base) => ({
//       ...base,
//       color: 'rgba(var(--text), 0.6)',
//     }),
//   }

//   const selectTheme = (theme) => ({
//     ...theme,
//     colors: {
//       ...theme.colors,
//       primary: 'rgb(var(--primary-600))',
//       primary25: 'rgba(var(--primary-600), 0.12)',
//       primary50: 'rgba(var(--primary-600), 0.18)',
//       neutral20: 'rgb(var(--border, 220 223 230))',
//       neutral30: 'rgb(var(--border, 220 223 230))',
//     },
//   })

//   return (
//     <div className={className.container || 'mb-4'}>
//       {label && (
//         <label
//           className={
//             className.label || 'block text-sm font-medium text-gray-700'
//           }
//           htmlFor={id}
//           id={'label-' + id}
//         >
//           {label} {buttonLabel && buttonLabel()}
//         </label>
//       )}

//       {/* <Select<T, boolean, GroupBase<T>>
//         className={className.input || 'mt-1'}
//         id={id}
//         name={id}
//         isSearchable={isSearchable}
//         isLoading={loading}
//         isDisabled={disabled || loading}
//         defaultValue={defaultValue}
//         isClearable={isClearable}
//         isMulti={isMulti}
//         value={value}
//         options={options}
//         onChange={onChange}
//         styles={customStyles}
//       /> */}
//       <Select<T, boolean, GroupBase<T>>
//         className={className.input || 'mt-1'}
//         id={id}
//         name={id}
//         isSearchable={isSearchable}
//         isLoading={loading}
//         isDisabled={disabled || loading}
//         defaultValue={defaultValue}
//         isClearable={isClearable}
//         isMulti={isMulti}
//         value={value}
//         options={options}
//         onChange={onChange}
//         styles={customStyles ?? selectStyles}
//         theme={selectTheme}
//       />

//       {invalidMsg && (
//         <span className='mt-1 text-sm text-red-500'>{invalidMsg}</span>
//       )}
//     </div>
//   )
// }

// export default SelectSearch
import Select, { GroupBase, Props as SelectProps } from 'react-select'

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
      borderRadius: 12,
      minHeight: 40,

      // ✅ borde coral SIEMPRE (como el resto del formulario)
      borderColor: 'rgb(var(--mx-primary-600))',
      borderWidth: 1,

      backgroundColor: 'rgb(var(--mx-surface))',

      // focus ring consistente con el input
      boxShadow: state.isFocused
        ? '0 0 0 3px rgba(var(--mx-primary-600), 0.18)'
        : 'none',

      ':hover': {
        borderColor: 'rgb(var(--mx-primary-700))',
      },

      opacity: state.isDisabled ? 0.6 : 1,
    }),

    valueContainer: (base) => ({
      ...base,
      paddingLeft: 10,
      paddingRight: 10,
    }),

    placeholder: (base) => ({
      ...base,
      color: 'rgba(var(--mx-text), 0.6)',
    }),

    singleValue: (base) => ({
      ...base,
      color: 'rgb(var(--mx-text))',
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

    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgb(var(--mx-border))',
      boxShadow: '0 12px 30px rgba(0,0,0,0.14)',
    }),

    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: 'rgb(var(--mx-border))',
    }),
  }

  const selectTheme = (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      // ✅ asegura coherencia interna de react-select
      primary: 'rgb(var(--mx-primary-600))',
      primary25: 'rgba(var(--mx-primary-600), 0.12)',
      primary50: 'rgba(var(--mx-primary-600), 0.18)',
      neutral20: 'rgb(var(--mx-primary-600))', // borde default (si algo no se overridea)
      neutral30: 'rgb(var(--mx-primary-700))', // hover borde
      neutral80: 'rgb(var(--mx-text))',
    },
  })

  return (
    <div className={className.container || 'mb-4'}>
      {label && (
        <label
          className={className.label || 'block text-sm font-medium text-primary-600'}
          htmlFor={id}
          id={'label-' + id}
        >
          {label} {buttonLabel && buttonLabel()}
        </label>
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
