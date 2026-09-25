import { useEffect, useState, useRef, useCallback } from 'react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import { toast } from 'react-toastify'
import { toastOptions } from '@/config/toast'
import {
  Plantilla,
  FormularioGuardado,
  getPlantillas,
  getFormulariosActa,
  precargarFormulario,
  guardarFormulario,
  actualizarFormulario,
  getPdfDocumento,
} from '@/services/FormularioService'
import { FormulariosHistorial } from './Formularios/FormulariosHistorial'
import { FormularioEmision } from './Formularios/FormularioEmision'
import { FormularioPdfModal } from './Formularios/FormularioPdfModal'

interface Props {
  actaId: string | undefined
  setIsLoadingGlobal?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
}

export const FormulariosTab = ({ actaId, setIsLoadingGlobal }: Props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null)

  // Listados principales
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [formulariosEmitidos, setFormulariosEmitidos] = useState<FormularioGuardado[]>([])

  // Estado del editor / emisión
  const [selectedCodigo, setSelectedCodigo] = useState('')
  const [selectedPlantilla, setSelectedPlantilla] = useState<Plantilla | null>(null)
  const [contenido, setContenido] = useState('')
  const [editingDocumentoId, setEditingDocumentoId] = useState<number | null>(null)

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

  // Carga inicial
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

  // Recargar historial
  const recargarEmitidos = useCallback(async () => {
    if (!actaId) return
    try {
      const data = await getFormulariosActa(actaId)
      setFormulariosEmitidos(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al refrescar listado de emitidos'
      toast.error(msg, toastOptions)
    }
  }, [actaId])

  // Seleccionar plantilla -> precarga
  const handleSeleccionarPlantilla = async (codigo: string) => {
    setSelectedCodigo(codigo)
    if (editingDocumentoId) {
      setEditingDocumentoId(null)
    }

    if (!codigo) {
      setSelectedPlantilla(null)
      setContenido('')
      if (editorRef.current) {
        editorRef.current.setContent('')
      }
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
      const htmlPrecargado = data?.contenido_html ?? ''
      setContenido(htmlPrecargado)
      if (editorRef.current) {
        editorRef.current.setContent(htmlPrecargado)
      }
      toast.info(`Plantilla "${encontrada?.nombre ?? codigo}" precargada con éxito`, toastOptions)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al precargar la plantilla'
      toast.error(msg, toastOptions)
    } finally {
      setIsPrecargando(false)
    }
  }

  // Iniciar edición de un formulario previamente emitido
  const handleIniciarEdicion = (formulario: FormularioGuardado) => {
    setEditingDocumentoId(formulario.id)

    // Buscar la plantilla coincidente
    const encontrada =
      plantillas.find(
        (p) =>
          p.id === formulario.plantilla_documento_id ||
          p.codigo === formulario.plantilla?.codigo ||
          p.codigo === formulario.tipo
      ) || null

    setSelectedPlantilla(encontrada)
    setSelectedCodigo(encontrada?.codigo ?? formulario.plantilla?.codigo ?? formulario.tipo)

    const htmlToEdit = formulario.contenido_html || ''
    setContenido(htmlToEdit)

    if (editorRef.current) {
      editorRef.current.setContent(htmlToEdit)
    }

    // Scroll suave hacia la sección del editor
    document.getElementById('formulario-emision-section')?.scrollIntoView({ behavior: 'smooth' })

    toast.info(`Cargado documento #${formulario.id} para edición`, toastOptions)
  }

  // Cancelar modo edición
  const handleCancelarEdicion = () => {
    setEditingDocumentoId(null)
    setSelectedCodigo('')
    setSelectedPlantilla(null)
    setContenido('')
    if (editorRef.current) {
      editorRef.current.setContent('')
    }
    toast.info('Edición cancelada', toastOptions)
  }

  // Guardar o Actualizar formulario
  const handleGuardar = async () => {
    if (!actaId) {
      toast.error('No se encontró el ID del acta', toastOptions)
      return
    }

    if (!selectedPlantilla && !selectedCodigo) {
      toast.warning('Seleccione una plantilla antes de guardar', toastOptions)
      return
    }

    const htmlFinal = editorRef.current ? editorRef.current.getContent() : contenido

    if (!htmlFinal || htmlFinal.trim() === '' || htmlFinal === '<p><br></p>') {
      toast.warning('El contenido del formulario no puede estar vacío', toastOptions)
      return
    }

    try {
      setIsGuardando(true)
      if (setIsLoadingGlobal) setIsLoadingGlobal(true)

      if (editingDocumentoId) {
        await actualizarFormulario(editingDocumentoId, {
          plantilla_documento_id: selectedPlantilla?.id,
          tipo: selectedPlantilla?.codigo ?? selectedCodigo,
          contenido_html: htmlFinal,
        })
        toast.success(`Formulario #${editingDocumentoId} actualizado exitosamente`, toastOptions)
      } else {
        await guardarFormulario(actaId, {
          plantilla_documento_id: selectedPlantilla?.id ?? 0,
          tipo: selectedPlantilla?.codigo ?? selectedCodigo,
          contenido_html: htmlFinal,
        })
        toast.success('Formulario guardado exitosamente', toastOptions)
      }

      setEditingDocumentoId(null)
      setSelectedCodigo('')
      setSelectedPlantilla(null)
      setContenido('')
      if (editorRef.current) {
        editorRef.current.setContent('')
      }
      await recargarEmitidos()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el formulario'
      toast.error(msg, toastOptions)
    } finally {
      setIsGuardando(false)
      if (setIsLoadingGlobal) setIsLoadingGlobal(false)
    }
  }

  // Helper Base64 -> Blob URL
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

  // Previsualizar PDF
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

  // Descargar PDF
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
      <FormulariosHistorial
        formularios={formulariosEmitidos}
        isCargando={isCargandoInicial}
        descargandoId={descargandoId}
        isCargandoPdf={isCargandoPdf}
        editingDocumentoId={editingDocumentoId}
        onRecargar={recargarEmitidos}
        onPrevisualizar={handlePrevisualizarPdf}
        onDescargar={handleDescargarPdf}
        onEditar={handleIniciarEdicion}
      />

      <FormularioEmision
        plantillas={plantillas}
        selectedCodigo={selectedCodigo}
        contenido={contenido}
        isCargandoInicial={isCargandoInicial}
        isPrecargando={isPrecargando}
        isGuardando={isGuardando}
        editingDocumentoId={editingDocumentoId}
        onCancelarEdicion={handleCancelarEdicion}
        onSeleccionarPlantilla={handleSeleccionarPlantilla}
        onChangeContenido={setContenido}
        onGuardar={handleGuardar}
        onInitEditor={(editor) => {
          editorRef.current = editor
        }}
      />

      <FormularioPdfModal
        isOpen={pdfModalOpen}
        pdfBlobUrl={pdfBlobUrl}
        fileName={pdfFileName}
        onClose={handleCerrarModalPdf}
      />
    </div>
  )
}
