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
  return (
    <div className={className.container || 'mb-4'}>
      {label && (
        <label
          className={
            className.label || 'block text-sm font-medium text-gray-700'
          }
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
        styles={customStyles}
      />

      {invalidMsg && (
        <span className='mt-1 text-sm text-red-500'>{invalidMsg}</span>
      )}
    </div>
  )
}

export default SelectSearch
