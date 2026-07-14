import { useState } from 'react'
import { Modal, ModalHeader, ModalContent } from '@nqnmodernizacion/muni-ui'
import { getCaratulaActa } from '@/services/ActaService'
import { toast } from 'react-toastify'
import { toastOptions } from '@/config/toast'

interface BotonCaratulaProps {
  actaId: string | number
  disabled?: boolean
}

export const BotonCaratula = ({ actaId, disabled = false }: BotonCaratulaProps) => {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleObtenerCaratula = async () => {
    if (!actaId) {
      toast.error('ID del acta no válido', toastOptions)
      return
    }
    try {
      setLoading(true)
      const data = await getCaratulaActa(actaId)
      const dataUri = data.data.file
      const name = data.data.file_name

      const base64String = dataUri.split(',')[1]

      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
      setFileName(name)
      setModalOpen(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener la carátula'
      toast.error(errorMessage, toastOptions)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!blobUrl) return
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName || `caratula_acta_${actaId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleObtenerCaratula}
        disabled={disabled || loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-start sm:self-auto"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Cargando...
          </>
        ) : (
          'Obtener Carátula'
        )}
      </button>

      {/* Modal para visualizar Carátula */}
      <Modal open={modalOpen} onOpenChange={(open) => !open && handleCloseModal()} size="lg">
        <ModalHeader
          title="Previsualización de Carátula"
          right={
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10 font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>
          }
        />
        <ModalContent>
          {blobUrl ? (
            <div className="flex flex-col gap-4">
              <iframe
                src={blobUrl}
                className="w-full h-[550px] rounded border border-gray-300"
                title="Previsualización de Carátula"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                >
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">Cargando archivo...</div>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
