import React from 'react'
import { Controller, Control } from 'react-hook-form'
import Select, { GroupBase, StylesConfig } from 'react-select'

interface Option {
  value: string | number
  label: string
}

interface MultiSelectFieldProps {
  label: string
  name: string
  control: Control<any>
  options: Option[]
  error?: any
  disabled?: boolean
  placeholder?: string
}

const selectStyles: StylesConfig<Option, true, GroupBase<Option>> = {
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    minHeight: 40,
    borderColor: 'rgb(var(--mx-primary-600))',
    borderWidth: 1,
    backgroundColor: 'rgb(var(--mx-surface))',
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
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(var(--mx-primary-600), 0.12)',
    borderRadius: 6,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'rgb(var(--mx-primary-700))',
    fontWeight: 500,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'rgb(var(--mx-primary-700))',
    ':hover': {
      backgroundColor: 'rgb(var(--mx-primary-700))',
      color: 'white',
    },
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

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  name,
  control,
  options,
  error,
  disabled = false,
  placeholder = 'Seleccione una o más opciones',
}) => {
  return (
    <div className="w-full">
      <label className="mx-label mb-1">{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const fieldValue: Array<string | number> = Array.isArray(field.value)
            ? field.value
            : []
          const selectedValues: Option[] = fieldValue
            .map((v) =>
              options.find((o) => String(o.value) === String(v))
            )
            .filter((o): o is Option => Boolean(o))

          return (
            <Select<Option, true, GroupBase<Option>>
              isMulti
              options={options}
              value={selectedValues}
              onChange={(newValue) => {
                field.onChange(
                  newValue ? newValue.map((o) => o.value) : []
                )
              }}
              onBlur={field.onBlur}
              isDisabled={disabled}
              placeholder={placeholder}
              styles={selectStyles}
              classNamePrefix="react-select"
              closeMenuOnSelect={false}
            />
          )
        }}
      />

      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
      {Array.isArray(error) &&
        error.find((e: any) => e?.message)?.message && (
          <p className="text-red-500 text-sm mt-1">
            {error.find((e: any) => e?.message)?.message}
          </p>
        )}
    </div>
  )
}
