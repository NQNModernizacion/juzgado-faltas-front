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
          <div className="text-center py-8 text-xs text-gray-500">Cargando archivo PDF...</div>
        )}
      </ModalContent>
    </Modal>
  )
}
