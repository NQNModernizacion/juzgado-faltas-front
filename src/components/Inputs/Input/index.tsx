import { ComponentProps, ReactNode } from 'react'
import { Control, useController } from 'react-hook-form'
import Label from '../Label'
import SmallText from '../SmallText'
import ErrorText from '../ErrorText'

type InputProps = ComponentProps<'input'> & {
  label?: string
  name: string
  smallText?: ReactNode
  className?: {
    container?: string
    label?: string
    input?: string
  }
  control: Control<any>
  hideErrors?: boolean
  readOnly?: boolean
}

const Input = ({ label, name, control, className, smallText, hideErrors = false, readOnly = false, ...props }: InputProps) => {
  const {
    formState: { errors },
  } = useController({ name, control })

  return (
    <div className={className?.container ?? ''}>
      <Label label={label} name={name} className={className?.label ?? ''} />

      <div className="relative">
        <input
          {...control.register(name)}
          id={'input-' + name}
          readOnly={readOnly}
          className={` ${className?.input ?? ''} ${!readOnly ? 'border border-gray-200' : ''} block w-full rounded-lg bg-gray-50/50 p-1.5 px-2 text-gray-900 outline-none transition-all duration-200 ease-linear focus:shadow-sm disabled:opacity-50`}
          {...props}
        />

        <SmallText>{smallText}</SmallText>
        <ErrorText hideErrors={hideErrors} error={errors[name]} />
      </div>
    </div>
  )
}

export default Input
