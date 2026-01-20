// import { useEffect, useRef } from 'react'
// import Cruz from '../Svgs/Cruz'

// interface ModalProps {
//   title?: React.ReactNode
//   footer?: React.ReactNode
//   loading?: boolean
//   show: boolean
//   children?: React.ReactNode
//   closeButton?: boolean
//   noPadding?: boolean
//   variant?: string
//   maxWidth?: string
//   onHide?: () => void
// }

// const Modal = ({
//   maxWidth = 'max-w-4xl',
//   show,
//   onHide,
//   title,
//   children,
//   loading,
//   variant = 'primary',
//   noPadding = false,
// }: ModalProps) => {
//   const modalRef = useRef(null)

//   useEffect(() => {
//     if (show) {
//       document.body.classList.add('no-scroll')
//     }

//     return () => {
//       document.body.classList.remove('no-scroll')
//     }
//   }, [show])

//   useEffect(() => {
//     const handleClickListener = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         onHide?.()
//       }
//     }

//     document.addEventListener('mousedown', handleClickListener)

//     return () => {
//       document.removeEventListener('mousedown', handleClickListener)
//     }
//   }, [onHide])

//   const headerBg: { [key: string]: string } = {
//     primary: 'bg-primary-700',
//     danger: 'bg-red-700',
//     success: 'bg-green-700',
//     default: 'bg-gray-700',
//   }

//   if (!show) return null

//   return (
//     <div className="custom-scroll-bar fixed inset-0 left-0 right-0 top-0 z-50 grid max-h-full w-full place-items-center items-center overflow-y-auto overflow-x-hidden bg-black/40 px-3 py-3 sm:px-6 sm:py-6">
//       <div
//       ref={modalRef}
//         className={`relative max-h-full w-full rounded-lg shadow-lg ${maxWidth}`}
//       >
//         {/* Header */}
//         <div
//           className={`${!noPadding ? 'border-b' : ''} flex flex-nowrap items-center justify-between rounded-t-lg p-3 md:p-4 ${headerBg[variant]}`}
//         >
//           {title && (
//             <h3 className="text-xl font-semibold text-white">
//               {!loading && title}
//             </h3>
//           )}

//           {onHide && (
//             <button
//               type="button"
//               className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 transition-colors duration-300 hover:bg-black/15"
//               onClick={onHide}
//             >
//               <Cruz className="h-6 w-6 text-white" />
//             </button>
//           )}
//         </div>

//         {/* Contenido */}
//         <div
//           className={`${!noPadding ? 'px-4 py-6 sm:px-5 md:px-6' : ''} rounded-b-lg bg-white`}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Modal
import { useEffect, useRef } from 'react'
import Cruz from '../Svgs/Cruz'

interface ModalProps {
  title?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  show: boolean
  children?: React.ReactNode
  closeButton?: boolean
  noPadding?: boolean
  variant?: 'primary' | 'danger' | 'success' | 'default'
  maxWidth?: string
  onHide?: () => void
}

const Modal = ({
  maxWidth = 'max-w-4xl',
  show,
  onHide,
  title,
  children,
  loading,
  variant = 'primary',
  noPadding = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (show) document.body.classList.add('no-scroll')
    return () => document.body.classList.remove('no-scroll')
  }, [show])

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onHide?.()
      }
    }
    document.addEventListener('mousedown', handleClickListener)
    return () => document.removeEventListener('mousedown', handleClickListener)
  }, [onHide])

  const headerBg: Record<NonNullable<ModalProps['variant']>, string> = {
    // ✅ amarillo MuniExpress
    primary: 'bg-secondary-500',
    danger: 'bg-red-700',
    success: 'bg-green-700',
    default: 'bg-gray-700',
  }

  const headerText: Record<NonNullable<ModalProps['variant']>, string> = {
    // ✅ coral MuniExpress
    primary: 'text-primary-700',
    danger: 'text-white',
    success: 'text-white',
    default: 'text-white',
  }

  const closeBtnText: Record<NonNullable<ModalProps['variant']>, string> = {
    primary: 'text-primary-700',
    danger: 'text-white',
    success: 'text-white',
    default: 'text-white',
  }

  if (!show) return null

  return (
    <div className="custom-scroll-bar fixed inset-0 z-50 grid max-h-full w-full place-items-center overflow-y-auto overflow-x-hidden bg-black/40 px-3 py-3 sm:px-6 sm:py-6">
      <div
        ref={modalRef}
        className={`relative max-h-full w-full rounded-lg shadow-lg ${maxWidth}`}
      >
        {/* Header */}
        <div
          className={[
            !noPadding ? 'border-b border-border' : '',
            'flex flex-nowrap items-center justify-between rounded-t-lg p-3 md:p-4',
            headerBg[variant],
          ].join(' ')}
        >
          {title && (
            <h3 className={['text-xl font-semibold', headerText[variant]].join(' ')}>
              {!loading && title}
            </h3>
          )}

          {onHide && (
            <button
              type="button"
              className={[
                'ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm',
                closeBtnText[variant],
                'transition-colors duration-300 hover:bg-black/10',
              ].join(' ')}
              onClick={onHide}
            >
              <Cruz className={['h-6 w-6', closeBtnText[variant]].join(' ')} />
            </button>
          )}
        </div>

        {/* Contenido */}
        <div
          className={[
            !noPadding ? 'px-4 py-6 sm:px-5 md:px-6' : '',
            'rounded-b-lg bg-white',
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
