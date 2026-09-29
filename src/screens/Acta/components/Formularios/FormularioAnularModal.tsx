import { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalContent } from '@nqnmodernizacion/muni-ui'
import { FormularioGuardado } from '@/services/FormularioService'

export interface FormularioAnularModalProps {
  formulario: FormularioGuardado | null
  isOpen: boolean
  isProcesando: boolean
  onClose: () => void
  onConfirm: (motivo: string) => void
}

export const FormularioAnularModal = ({
  formulario,
  isOpen,
  isProcesando,
  onClose,
  onConfirm,
}: FormularioAnularModalProps) => {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMotivo('')
      setError('')
    }
  }, [isOpen])

  const handleConfirmar = () => {
    if (!motivo.trim()) {
      setError('Debe especificar un motivo formal para la anulación del documento.')
      return
    }
    setError('')
    onConfirm(motivo.trim())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleConfirmar()
  }

  if (!formulario) return null

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && !isProcesando && onClose()} size="md">
      <ModalHeader
        title={`🚫 Anular Documento #${formulario.id}`}
        right={
          <button
            type="button"
            onClick={onClose}
            disabled={isProcesando}
            className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10 font-bold disabled:opacity-50"
            aria-label="Cerrar"
          >
            ✕
          </button>
        }
      />
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-lg text-xs">
            <p className="font-semibold mb-1">
              ⚠️ Esta acción registrará formalmente el documento como &quot;Anulado / No Válido&quot;.
            </p>
            <p className="text-[11px] text-red-700">
              El documento se mantendrá en el historial por motivos de auditoría judicial, pero quedará inhabilitado para futuras ediciones y se le estampará una advertencia de nulidad en las descargas.
            </p>
          </div>

          <div>
            <label htmlFor="motivo-anulacion" className="block text-xs font-semibold text-gray-700 mb-1">
              Motivo de Anulación <span className="text-red-500">*</span>
            </label>
            <textarea
              id="motivo-anulacion"
              rows={3}
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value)
                if (error) setError('')
              }}
              placeholder="Ej: Reemplazado por nuevo descargo con fecha 28/09, o error material en carátula..."
              disabled={isProcesando}
              className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcesando}
              className="h-8 px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              disabled={isProcesando || !motivo.trim()}
              className="h-8 px-4 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isProcesando ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Anulando...
                </>
              ) : (
                'Confirmar Anulación'
              )}
            </button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}
