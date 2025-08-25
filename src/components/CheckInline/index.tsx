import { useController } from 'react-hook-form'
import ErrorText from '../Inputs/ErrorText'

interface CheckInlineProps {
  name: string
  control: any
  label: string
  value?: string | number
  hideErrors?: boolean
  classNames?: {
    container?: string
    input?: string
  }
}

const CheckInline = ({
  hideErrors,
  name,
  control,
  label,
  value,
  classNames,
  ...props
}: CheckInlineProps) => {
  const {
    formState: { errors },
  } = useController({ name, control })

  return (
    <div className={classNames?.container}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`input-${name}`}
          value={value}
          {...control.register(name)}
          className={`size-5 text-primary-600 border-2 border-gray-300 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ${classNames?.input}`}
          {...props}
        />

        <label
          htmlFor={`input-${name}`}
          className="ps-2 pt-0.5 text-gray-700 font-medium cursor-pointer"
        >
          {label}
        </label>
      </div>

      <ErrorText hideErrors={hideErrors} error={errors[name]} />
    </div>
  )
}

export default CheckInline
