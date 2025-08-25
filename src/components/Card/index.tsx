interface CardProps {
  title?: React.ReactNode
  children: React.ReactNode
  bgColor?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'gray'
}

const bgColors = {
  primary: 'bg-primary-600 text-white',
  secondary: 'bg-secondary-400 text-white',
  danger: 'bg-red-500 text-white',
  warning: 'bg-yellow-400 text-neutral-900',
  success: 'bg-green-500 text-white',
  gray: 'bg-gray-300 text-gray-700',
}

const Card = ({ title, children, bgColor = 'gray', ...props }: CardProps) => {
  return (
    <div className={`w-full p-0 shadow-md rounded-lg `} {...props}>
      {title && <div className={`px-4 py-2 font-semibold rounded-t-lg ${bgColors[bgColor]}`}>{title}</div>}
      <div className="p-4">{children}</div>
    </div>
  )
}

export default Card
