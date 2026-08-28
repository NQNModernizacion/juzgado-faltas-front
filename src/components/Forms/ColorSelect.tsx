import React, { useEffect, useRef, useState } from 'react'
import { Controller, Control } from 'react-hook-form'

interface Option {
  value: string
  label: string
}

interface ColorSelectProps {
  label: string
  name: string
  control: Control<any>
  options: Option[]
  disabled?: boolean
  containerClassName?: string
}

const ColorSelect: React.FC<ColorSelectProps> = ({ label, name, control, options, disabled = false, containerClassName }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className={`w-full ${containerClassName || ''}`} ref={ref}>
      <label className="mx-label">{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected = options?.find((o) => o.value === field.value)

          return (
            <div className="relative">
              <button type="button" disabled={disabled} onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-2 h-8 border rounded-md bg-white text-left text-xs">
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 mr-2 rounded-sm border" style={{ backgroundColor: selected?.value || 'transparent' }} />
                  <span>{selected?.label ?? 'Seleccione una opción'}</span>
                </div>
                <svg className="w-4 h-4 ml-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <ul className="absolute z-20 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                  {options?.map((opt) => (
                    <li
                      key={opt.value}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        field.onChange(opt.value)
                        setOpen(false)
                      }}
                    >
                      <span className="inline-block w-4 h-4 mr-2 rounded-sm border" style={{ backgroundColor: opt.value }} />
                      <span>{opt.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}

export default ColorSelect
