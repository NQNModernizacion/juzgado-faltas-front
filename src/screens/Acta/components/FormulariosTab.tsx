import { useEffect, useState, useId } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { Modal, ModalHeader, ModalContent } from '@nqnmodernizacion/muni-ui'
import { toast } from 'react-toastify'
import { toastOptions } from '@/config/toast'
import {
  Plantilla,
  FormularioGuardado,
  getPlantillas,
  getFormulariosActa,
  precargarFormulario,
  guardarFormulario,
  getPdfDocumento,
} from '@/services/FormularioService'

interface Props {
  actaId: string | undefined
  setIsLoadingGlobal?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
}

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['clean'],
]

export const FormulariosTab = ({ actaId, setIsLoadingGlobal }: Props) => {
  const selectId = useId()
  // Listados principales
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [formulariosEmitidos, setFormulariosEmitidos] = useState<FormularioGuardado[]>([])

  // Estado del editor / emisión
  const [selectedCodigo, setSelectedCodigo] = useState('')
  const [selectedPlantilla, setSelectedPlantilla] = useState<Plantilla | null>(null)
  const [contenido, setContenido] = useState('')

  // Estados de carga
  const [isCargandoInicial, setIsCargandoInicial] = useState(false)
  const [isPrecargando, setIsPrecargando] = useState(false)
  const [isGuardando, setIsGuardando] = useState(false)
  const [descargandoId, setDescargandoId] = useState<number | null>(null)

  // Estado del Modal de Previsualización PDF
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [pdfFileName, setPdfFileName] = useState<string>('')
  const [isCargandoPdf, setIsCargandoPdf] = useState(false)

  // Carga inicial: plantillas y formularios guardados
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setIsCargandoInicial(true)
        if (setIsLoadingGlobal) setIsLoadingGlobal(true)

        const [plantillasData, emitidosData] = await Promise.all([
          getPlantillas(),
          actaId ? getFormulariosActa(actaId) : Promise.resolve([]),
        ])

        setPlantillas(plantillasData)
        setFormulariosEmitidos(emitidosData)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al cargar datos de formularios'
        toast.error(msg, toastOptions)
      } finally {
        setIsCargandoInicial(false)
        if (setIsLoadingGlobal) setIsLoadingGlobal(false)
      }
    }

    cargarDatosIniciales()
  }, [actaId, setIsLoadingGlobal])

  // Recargar solo la lista de emitidos
  const recargarEmitidos = async () => {
    if (!actaId) return
    try {
      const data = await getFormulariosActa(actaId)
      setFormulariosEmitidos(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al refrescar listado de emitidos'
      toast.error(msg, toastOptions)
    }
  }

  // Cambio en el combo de plantillas -> Dispara precarga automática
  const handleSeleccionarPlantilla = async (codigo: string) => {
    setSelectedCodigo(codigo)
    if (!codigo) {
      setSelectedPlantilla(null)
      setContenido('')
      return
    }

    const encontrada = plantillas.find((p) => p.codigo === codigo) || null
    setSelectedPlantilla(encontrada)

    if (!actaId) {
      toast.error('No se encontró el ID del acta', toastOptions)
      return
    }

    try {
      setIsPrecargando(true)
      const data = await precargarFormulario(actaId, codigo)
      setContenido(data?.contenido_html ?? '')
      toast.info(`Plantilla "${encontrada?.nombre ?? codigo}" precargada con éxito`, toastOptions)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al precargar la plantilla'
      toast.error(msg, toastOptions)
    } finally {
      setIsPrecargando(false)
    }
  }

  // Guardar formulario editado
  const handleGuardar = async () => {
    if (!actaId || !selectedPlantilla) {
      toast.warning('Seleccione una plantilla antes de guardar', toastOptions)
      return
    }

    if (!contenido || contenido.trim() === '' || contenido === '<p><br></p>') {
      toast.warning('El contenido del formulario no puede estar vacío', toastOptions)
      return
    }

    try {
      setIsGuardando(true)
      if (setIsLoadingGlobal) setIsLoadingGlobal(true)

      await guardarFormulario(actaId, {
        plantilla_documento_id: selectedPlantilla.id,
        tipo: selectedPlantilla.codigo,
        contenido_html: contenido,
      })

      toast.success('Formulario guardado exitosamente', toastOptions)
      
      // Limpiar selección del editor y refrescar historial
      setSelectedCodigo('')
      setSelectedPlantilla(null)
      setContenido('')
      await recargarEmitidos()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el formulario'
      toast.error(msg, toastOptions)
    } finally {
      setIsGuardando(false)
      if (setIsLoadingGlobal) setIsLoadingGlobal(false)
    }
  }

  // Helper para convertir base64 en Blob URL
  const crearBlobUrlDesdeBase64 = (base64Raw: string): string => {
    const base64String = base64Raw.includes(',') ? base64Raw.split(',')[1] : base64Raw
    const byteCharacters = atob(base64String)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    return URL.createObjectURL(blob)
  }

  // Previsualizar PDF en Modal
  const handlePrevisualizarPdf = async (documentoId: number) => {
    try {
      setIsCargandoPdf(true)
      const resp = await getPdfDocumento(documentoId)
      const dataUri = resp.data.file
      const name = resp.data.file_name || `formulario_${documentoId}.pdf`

      const url = crearBlobUrlDesdeBase64(dataUri)
      setPdfBlobUrl(url)
      setPdfFileName(name)
      setPdfModalOpen(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar previsualización del PDF'
      toast.error(msg, toastOptions)
    } finally {
      setIsCargandoPdf(false)
    }
  }

  // Descarga directa del PDF
  const handleDescargarPdf = async (documentoId: number, tipoDoc: string) => {
    try {
      setDescargandoId(documentoId)
      const resp = await getPdfDocumento(documentoId)
      const dataUri = resp.data.file
      const name = resp.data.file_name || `${tipoDoc}_acta_${actaId}.pdf`

      const url = crearBlobUrlDesdeBase64(dataUri)
      const link = document.createElement('a')
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Descarga iniciada', toastOptions)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al descargar el PDF'
      toast.error(msg, toastOptions)
    } finally {
      setDescargandoId(null)
    }
  }

  const handleCerrarModalPdf = () => {
    setPdfModalOpen(false)
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(null)
    }
  }

  return (
    <div className="space-y-2">
      {/* SECCIÓN 1: HISTORIAL DE FORMULARIOS / SENTENCIAS EMITIDAS */}
      <div className="mx-section p-2 sm:p-3 bg-white">
        <div className="flex items-center justify-between border-b pb-1 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-primary-500 uppercase tracking-wide">
              Documentos y Formularios Emitidos
            </h3>
            <span className="text-[11px] bg-primary-100 text-primary-700 font-semibold px-2 py-0.2 rounded-full">
              {formulariosEmitidos.length}
            </span>
          </div>
          <button
            type="button"
            onClick={recargarEmitidos}
            disabled={isCargandoInicial}
            className="text-[11px] text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 transition-colors"
          >
            ↻ Actualizar lista
          </button>
        </div>

        {formulariosEmitidos.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-xs text-gray-500">
              Aún no se han emitido formularios ni descargos para esta causa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-[11px] font-bold text-textSecondary uppercase">
                  <th className="py-1 px-2">ID</th>
                  <th className="py-1 px-2">Fecha de Emisión</th>
                  <th className="py-1 px-2">Plantilla / Tipo</th>
                  <th className="py-1 px-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {formulariosEmitidos.map((f) => {
                  const isDownloading = descargandoId === f.id
                  return (
                    <tr key={f.id} className="hover:bg-primary-50/40 transition-colors">
                      <td className="py-1 px-2 font-medium text-gray-700">#{f.id}</td>
                      <td className="py-1 px-2 text-gray-600">{f.created_at}</td>
                      <td className="py-1 px-2 font-semibold text-primary-700">
                        {f.plantilla?.nombre ?? f.tipo}
                      </td>
                      <td className="py-1 px-2 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => handlePrevisualizarPdf(f.id)}
                          disabled={isCargandoPdf}
                          className="h-6 px-2 text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium border border-blue-200 transition-colors disabled:opacity-50"
                        >
                          👁 Previsualizar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDescargarPdf(f.id, f.tipo)}
                          disabled={isDownloading}
                          className="h-6 px-2 text-[11px] bg-green-50 text-green-700 hover:bg-green-100 rounded font-medium border border-green-200 transition-colors disabled:opacity-50"
                        >
                          {isDownloading ? 'Descargando...' : '⬇ Descargar PDF'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: EMISIÓN DE NUEVO FORMULARIO */}
      <div className="mx-section p-2 sm:p-3 bg-white">
        <div className="border-b pb-1 mb-2">
          <h3 className="text-xs font-bold text-primary-500 uppercase tracking-wide">
            Emisión de Nuevo Formulario / Sentencia
          </h3>
        </div>

        {/* Selector de plantilla */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-center">
          <div className="md:col-span-2">
            <label htmlFor={selectId} className="block text-[11px] font-semibold text-primary-600 mb-0.5">
              Seleccionar Plantilla a Redactar
            </label>
            <select
              id={selectId}
              className="w-full h-8 text-xs border border-primary-500 rounded-lg px-2 bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
              value={selectedCodigo}
              onChange={(e) => handleSeleccionarPlantilla(e.target.value)}
              disabled={isCargandoInicial || isPrecargando || isGuardando}
            >
              <option value="">-- Seleccione una plantilla... --</option>
              {plantillas.map((p) => (
                <option key={p.id} value={p.codigo}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            {isPrecargando && (
              <span className="text-xs text-blue-600 font-medium animate-pulse flex items-center gap-1">
                ⏳ Precargando datos del acta en la plantilla...
              </span>
            )}
          </div>
        </div>

        {/* Editor WYSIWYG */}
        {selectedCodigo ? (
          <div className="space-y-2">
            <div className="border rounded-lg overflow-hidden bg-white">
              <ReactQuill
                theme="snow"
                value={contenido}
                onChange={(value) => setContenido(value)}
                modules={{ toolbar: TOOLBAR }}
                placeholder="El contenido de la plantilla se cargará aquí. Puede editarlo libremente..."
                className="quill-compact"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-gray-500 italic">
                * Revise los datos precargados antes de presionar &quot;Guardar Formulario&quot;.
              </p>
              <button
                type="button"
                onClick={handleGuardar}
                disabled={isGuardando || isPrecargando || !contenido}
                className="h-8 px-4 text-xs bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isGuardando ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  '💾 Guardar Formulario'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-xs text-gray-500">
              Elija una plantilla del combo superior para precargar el documento con los datos de esta causa y comenzar la edición.
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE PREVISUALIZACIÓN DE PDF */}
      <Modal open={pdfModalOpen} onOpenChange={(open) => !open && handleCerrarModalPdf()} size="lg">
        <ModalHeader
          title={`Previsualización: ${pdfFileName}`}
          right={
            <button
              type="button"
              onClick={handleCerrarModalPdf}
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
                    link.download = pdfFileName || 'documento.pdf'
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
                  onClick={handleCerrarModalPdf}
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
    </div>
  )
}
