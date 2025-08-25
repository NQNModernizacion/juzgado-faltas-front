import { ButtonHTMLAttributes, ReactNode } from 'react'
import Loader from '../Loader'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'solid' | 'bordered'
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'gray'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  startContent?: ReactNode
  endContent?: ReactNode
  isLoading?: boolean
}

const Button = ({
  children,
  className,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  textSize = 'md',
  type = 'button',
  shadow = 'md',
  startContent,
  endContent,
  isLoading,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: {
      solid:
        'text-white bg-primary-800 hover:bg-primary-900 border-primary-800 hover:border-primary-900',
      bordered:
        'text-primary-800 hover:bg-primary-800 hover:text-white border-primary-800',
    },
    secondary: {
      solid:
        'text-white bg-secondary-400 hover:bg-secondary-500 border-secondary-400 hover:border-secondary-500',
      bordered:
        'text-secondary-400 hover:bg-secondary-400 hover:border-secondary-400 hover:text-white border-secondary-400',
    },
    gray: {
      solid:
        'text-white bg-neutral-400 hover:bg-neutral-500 border-neutral-400 hover:border-neutral-500',
      bordered:
        'text-neutral-600 hover:bg-neutral-400 border-neutral-400 hover:text-white hover:text-neutral-800 bg-white',
    },
    danger: {
      solid:
        'text-white bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600',
      bordered: 'text-red-500 hover:bg-red-500 hover:text-white border-red-500',
    },
    warning: {
      solid:
        'text-white bg-yellow-400 hover:bg-yellow-500 border-yellow-400 hover:border-yellow-500',
      bordered:
        'text-yellow-400 hover:bg-yellow-400 hover:border-yellow-400 hover:text-white border-yellow-400',
    },
    success: {
      solid:
        'text-white bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600',
      bordered:
        'text-green-600 hover:bg-green-500 hover:text-white border-green-500',
    },
  }

  const sizes = {
    xs: 'py-0.5',
    sm: 'py-1',
    md: 'py-2',
    lg: 'py-3',
    xl: 'py-4',
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }

  return (
    <button
      type={type}
      {...props}
      className={`rounded-lg border-2 px-3 font-semibold transition-all duration-200 ease-linear disabled:select-none disabled:pointer-events-none ${shadows[shadow]} ${textSizes[textSize]} disabled:opacity-70 ${variants[color][variant]} ${className ?? ''} `}
      disabled={isLoading}
    >
      <div
        className={`flex flex-nowrap items-center justify-center gap-2 ${sizes[size]}`}
      >
        {startContent}
        {children}
        {endContent}
        {isLoading && <Loader />}
      </div>
    </button>
  )
}

export default Button
