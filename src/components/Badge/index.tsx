import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?:
    | 'blue'
    | 'gray'
    | 'success'
    | 'orange'
    | 'primary'
    | 'purple'
    | 'danger'
    | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  textSize?: 'xs' | 'sm' | 'md' | 'lg'
}

const Badge = ({
  size = 'sm',
  textSize = 'sm',
  color = 'primary',
  children,
  ...props
}: BadgeProps) => {
  const colors = {
    blue: 'bg-blue-200 text-blue-500',
    gray: 'bg-neutral-200 text-neutral-500',
    success: 'bg-green-300 text-green-800',
    orange: 'bg-orange-200 text-orange-600',
    primary: 'bg-primary-100 text-primary-500',
    purple: 'bg-purple-200 text-purple-500',
    danger: 'bg-red-200 text-red-500',
    warning: 'bg-amber-300 text-amber-800',
  }

  const sizes = {
    xs: 'px-1.5 pb-0 pt-0.5',
    sm: 'px-2 pb-0.5 pt-1',
    md: 'px-2.5 pb-1 pt-1.5',
    lg: 'px-4 pb-1.5 pt-2',
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
  }

  return (
    <div>
      <span
        className={`w-fit text-wrap rounded-full px-4 font-semibold ${colors[color]} ${sizes[size]} ${textSizes[textSize]}`}
        {...props}
      >
        {children}
      </span>
    </div>
  )
}

export default Badge
