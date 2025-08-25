import { ReactNode } from 'react'

type SmallTextProps = {
  children?: ReactNode
}

const SmallText = ({ children }: SmallTextProps) => {
  if (!children) return null

  return <p className="ms-1 text-sm text-neutral-500">{children}</p>
}

export default SmallText
