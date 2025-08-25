import { ReactNode } from 'react'

type RFC = React.FC<{
  children: ReactNode
  startContent?: ReactNode
  endContent?: ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'gray' | 'warning'
  textAlign?: 'start' | 'center' | 'end'
  borderStyle?: 'dashed' | 'solid'
  classNames?: {
    container?: string
    content?: string
  }
}>

const Alert: RFC = ({ color = 'primary', textAlign = 'start', borderStyle = 'solid', startContent, endContent, children, classNames }) => {
  const containerClass = classNames?.container || ''
  const contentClass = classNames?.content || ''

  const colors = {
    primary: {
      icon: 'text-primary-500',
      content: 'bg-primary-100 border-primary-300',
    },
    secondary: {
      icon: 'text-secondary-500',
      content: 'bg-secondary-100 border-secondary-300',
    },
    success: {
      icon: 'text-emerald-500',
      content: 'bg-emerald-100 border-emerald-300',
    },
    danger: {
      icon: 'text-red-500',
      content: 'bg-red-100 border-red-300',
    },
    gray: {
      icon: 'text-gray-500',
      content: 'bg-gray-50 border-gray-300',
    },
    warning: {
      icon: 'text-yellow-400',
      content: 'bg-yellow-100 border-yellow-300',
    },
  }

  const textAligns = {
    start: 'text-start',
    center: 'text-center',
    end: 'text-end',
  }

  const borderStyles = {
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    solid: 'border-solid',
  }

  return (
    <div className={`${containerClass} flex gap-x-6 rounded-lg border-2 p-4 ${borderStyles[borderStyle]} ${colors[color].content}`}>
      {startContent && <div className={`self-center ${colors[color].icon}`}>{startContent}</div>}

      <div className={`${contentClass} flex-1 space-y-3 ${textAligns[textAlign]}`}>{children}</div>

      {endContent && <div className={`self-center ${colors[color].icon}`}>{endContent}</div>}
    </div>
  )
}

export default Alert
