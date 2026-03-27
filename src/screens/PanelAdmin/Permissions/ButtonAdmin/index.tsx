import React, { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonAdminProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  startContent?: ReactNode
  endContent?: ReactNode
  className?: string
}

const ButtonAdmin: React.FC<ButtonAdminProps> = ({
  startContent,
  endContent,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className='flex justify-center'>
      <button
        className={`items-center rounded-md bg-primary-600 px-4 py-1 text-white ${className}`}
        {...props}
      >
        {startContent ?? null}
        {children}
        {endContent ?? null}
      </button>
    </div>
  )
}

export default ButtonAdmin
