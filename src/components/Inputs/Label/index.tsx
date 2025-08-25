type LabelProps = {
  label?: string
  name: string
  className?: string
}

const Label = ({ label, name, className }: LabelProps) => {
  if (!label) return null

  return (
    <label htmlFor={'input-' + name} id={'label-' + name} className={`${className} text-primary-800  block font-semibold`}>
      <span className="flex items-center gap-2">{label}</span>
    </label>
  )
}

export default Label
