import React, { ReactNode } from 'react'

type TooltipProps = {
  text: string | ReactNode
  disabled?: boolean
  children: ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  disabled = true,
  children,
}) => {
  return (
    <div
      className={`relative flex justify-center ${disabled ? 'cursor-not-allowed pointer-events-none opacity-50' : ''}`}
    >
      <div className='group relative'>
        {/* Elemento sobre el cual se activa el tooltip */}
        <div className='cursor-pointer'>{children}</div>

        {/* Tooltip */}
        <div className='absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded-md bg-gray-800 px-3 py-1 text-sm text-white shadow-md group-hover:flex'>
          {text}
          <div className='absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-gray-800'></div>
        </div>
      </div>
    </div>
  )
}

export default Tooltip
