// import { ButtonHTMLAttributes, ReactNode } from 'react'
// import Loader from '../Loader'

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   children: ReactNode
//   variant?: 'solid' | 'bordered'
//   color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'gray'
//   size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
//   textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
//   shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
//   startContent?: ReactNode
//   endContent?: ReactNode
//   isLoading?: boolean
// }

// const Button = ({
//   children,
//   className,
//   variant = 'solid',
//   color = 'primary',
//   size = 'md',
//   textSize = 'md',
//   type = 'button',
//   shadow = 'md',
//   startContent,
//   endContent,
//   isLoading,
//   ...props
// }: ButtonProps) => {
//   const variants = {
//     primary: {
//       solid:
//         'text-white bg-primary-800 hover:bg-primary-900 border-primary-800 hover:border-primary-900',
//       bordered:
//         'text-primary-800 hover:bg-primary-800 hover:text-white border-primary-800',
//     },
//     secondary: {
//       solid:
//         'text-white bg-secondary-400 hover:bg-secondary-500 border-secondary-400 hover:border-secondary-500',
//       bordered:
//         'text-secondary-400 hover:bg-secondary-400 hover:border-secondary-400 hover:text-white border-secondary-400',
//     },
//     gray: {
//       solid:
//         'text-white bg-neutral-400 hover:bg-neutral-500 border-neutral-400 hover:border-neutral-500',
//       bordered:
//         'text-neutral-600 hover:bg-neutral-400 border-neutral-400 hover:text-white hover:text-neutral-800 bg-white',
//     },
//     danger: {
//       solid:
//         'text-white bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600',
//       bordered: 'text-red-500 hover:bg-red-500 hover:text-white border-red-500',
//     },
//     warning: {
//       solid:
//         'text-white bg-yellow-400 hover:bg-yellow-500 border-yellow-400 hover:border-yellow-500',
//       bordered:
//         'text-yellow-400 hover:bg-yellow-400 hover:border-yellow-400 hover:text-white border-yellow-400',
//     },
//     success: {
//       solid:
//         'text-white bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600',
//       bordered:
//         'text-green-600 hover:bg-green-500 hover:text-white border-green-500',
//     },
//   }

//   const sizes = {
//     xs: 'py-0.5',
//     sm: 'py-1',
//     md: 'py-2',
//     lg: 'py-3',
//     xl: 'py-4',
//   }

//   const textSizes = {
//     xs: 'text-xs',
//     sm: 'text-sm',
//     md: 'text-md',
//     lg: 'text-lg',
//     xl: 'text-xl',
//     '2xl': 'text-2xl',
//   }

//   const shadows = {
//     none: '',
//     sm: 'shadow-sm',
//     md: 'shadow-md',
//     lg: 'shadow-lg',
//     xl: 'shadow-xl',
//   }

//   return (
//     <button
//       type={type}
//       {...props}
//       className={`rounded-lg border-2 px-3 font-semibold transition-all duration-200 ease-linear disabled:select-none disabled:pointer-events-none ${shadows[shadow]} ${textSizes[textSize]} disabled:opacity-70 ${variants[color][variant]} ${className ?? ''} `}
//       disabled={isLoading}
//     >
//       <div
//         className={`flex flex-nowrap items-center justify-center gap-2 ${sizes[size]}`}
//       >
//         {startContent}
//         {children}
//         {endContent}
//         {isLoading && <Loader />}
//       </div>
//     </button>
//   )
// }

// export default Button
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
  /**
   * Objetivo visual (MuniExpress):
   * - Primary: coral
   * - Secondary: amarillo con texto rojo/coral
   * - Rounded + shadow suaves 
   */

  const variants = {
    primary: {
      // coral
      solid:
        'text-white bg-primary-400 hover:bg-primary-500 border-primary-400 hover:border-primary-500',
      bordered:
        'text-primary-700 hover:bg-primary-50 border-primary-400 hover:border-primary-500',
    },

    secondary: {
      // amarillo muni + texto rojo/coral (no blanco)
      solid:
        'text-primary-700 bg-secondary-500 hover:bg-secondary-600 border-secondary-500 hover:border-secondary-600',
      bordered:
        'text-primary-700 hover:bg-secondary-50 border-secondary-500 hover:border-secondary-600',
    },

    gray: {
      solid:
        'text-text bg-surface hover:bg-bg border-border hover:border-border',
      bordered:
        'text-text bg-surface hover:bg-bg border-border hover:border-border',
    },
    
    danger: {
      // danger = rojo más profundo, útil para acciones destructivas
      solid:
        'text-white bg-primary-800 hover:bg-primary-900 border-primary-800 hover:border-primary-900',
      bordered:
        'text-primary-800 hover:bg-primary-800 hover:text-white border-primary-800',
    },

    warning: {
      solid:
        'text-white bg-yellow-500 hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600',
      bordered:
        'text-yellow-700 hover:bg-yellow-100 border-yellow-400 hover:border-yellow-500',
    },

    success: {
      solid:
        'text-white bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700',
      bordered:
        'text-green-700 hover:bg-green-100 border-green-500 hover:border-green-600',
    },
  } as const

  const sizes = {
    xs: 'py-1',
    sm: 'py-1.5',
    md: 'py-2.5',
    lg: 'py-3',
    xl: 'py-4',
  } as const

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  } as const

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  } as const

  return (
    <button
      type={type}
      {...props}
      disabled={isLoading || props.disabled}
      className={[
        // MuniExpress usa radios grandes y “botones tipo píldora suave”
        'rounded-xl border-2 px-4 font-semibold transition-colors duration-200',
        'disabled:select-none disabled:pointer-events-none disabled:opacity-70',
        // focus consistente
        'focus:outline-none focus:ring-2 focus:ring-primary-400/40',
        shadows[shadow],
        textSizes[textSize],
        variants[color][variant],
        className ?? '',
      ].join(' ')}
    >
      <div className={`flex flex-nowrap items-center justify-center gap-2 ${sizes[size]}`}>
        {startContent}
        {children}
        {endContent}
        {isLoading && <Loader />}
      </div>
    </button>
  )
}

export default Button

