import { Modal, ModalHeader, ModalContent } from '@nqnmodernizacion/muni-ui'

export interface FormularioPdfModalProps {
  isOpen: boolean
  pdfBlobUrl: string | null
  fileName: string
  onClose: () => void
}

export const FormularioPdfModal = ({
  isOpen,
  pdfBlobUrl,
  fileName,
  onClose,
}: FormularioPdfModalProps) => {
  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()} size="lg">
      <ModalHeader
        title={`Previsualización: ${fileName}`}
        right={
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10 font-bold"
            aria-label="Cerrar"
          >
            ✕
          </button>
        }
      />
      <ModalContent>
        {pdfBlobUrl ? (
          <div className="flex flex-col gap-3">
            <iframe
              src={pdfBlobUrl}
              className="w-full h-[520px] rounded border border-gray-300"
              title="Previsualización de Documento Legal"
            />
            <div className="flex justify-end gap-2 pt-1 border-t">
              <button
                type="button"
                onClick={() => {
                  if (!pdfBlobUrl) return
                  const link = document.createElement('a')
                  link.href = pdfBlobUrl
                  link.download = fileName || 'documento.pdf'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
                className="h-8 px-4 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded font-semibold transition-colors"
              >
                Descargar Archivo
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-4 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs font-semibold text-gray-700">Generando documento PDF judicial...</p>
            <p className="text-[11px] text-gray-400">Compilando vista previa e imprimiendo encabezados y firmas</p>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}
