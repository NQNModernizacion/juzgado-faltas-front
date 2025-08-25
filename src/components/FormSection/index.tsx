type FormSectionProps = {
  children: React.ReactNode
  title?: string
  subtitle?: string
  fullWidth?: boolean
  className?: string
}

const FormSection = ({ children, title, subtitle, fullWidth, className, ...props }: FormSectionProps) => {
  return (
    <div>
      {title && <p className="mb-1 block text-lg font-semibold">{title}</p>}
      {subtitle && <p className="mb-4 text-sm">{subtitle}</p>}
      <div {...props} className={`grid grid-cols-1 gap-6 ${!fullWidth && 'md:grid-cols-2'} ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default FormSection
