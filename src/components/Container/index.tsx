import ChevronLeft from '@/components/Svgs/ChevronLeft'
import React from 'react'
import { Link } from 'react-router-dom'

type RFC = React.FC<{
  children: React.ReactNode
  title?: string
  subtitle?: string
  linkBack?: string
  className?: string
}>

const Container: RFC = ({
  children,
  title,
  subtitle,
  linkBack,
  className,
  ...props
}) => {
  return (
    <section
      className="w-full max-w-screen-xl mx-auto p-2.5  relative bg-white/70 rounded-lg"
      {...props}
    >
      <div className={`bg-white p-4 sm:p-6 rounded-md ${className}`}>
        {linkBack && (
          <div className="flex mb-3">
            <Link
              to={linkBack}
              className="flex items-center gap-1 px-3 py-1.5 text-white bg-primary-800 rounded-md shadow-sm hover:bg-primary-900 text-sm transition-colors duration-200"
            >
              <ChevronLeft className="size-3.5" />
              Volver
            </Link>
          </div>
        )}
        {title && (
          <div>
            <h2 className="w-full text-center text-3xl font-bold">{title}</h2>

            {subtitle && (
              <p className="text-center text-2xl text-neutral-600 font-semibold">
                {subtitle}
              </p>
            )}

            <hr className="mt-3 mb-6" />
          </div>
        )}

        {children}
      </div>
    </section>
  )
}

export default Container
