import { ReactNode } from 'react'

type ErrorTextProps = {
  hideErrors?: boolean
  children?: ReactNode
  error: undefined | any
}

const ErrorText = ({ error, hideErrors }: ErrorTextProps) => {
  if (hideErrors) return null

  /* Si no hay mensaje de error, se imprime un espacio en blanco para reservar el lugar */

  return (
    <p className="ms-1 select-none text-sm text-red-500">
      {error?.message?.toString()}
    </p>
  )
}

export default ErrorText
