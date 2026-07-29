import { useEffect, useRef, useState, type FC, type RefObject } from 'react'
import { Table } from '@/components/Table'
import { GridColDef } from '@mui/x-data-grid'
import { Modal, ModalContent, ModalHeader, SwitchBase } from '@nqnmodernizacion/muni-ui'
import { getPruebasActa, postPrueba, putPrueba, deletePrueba } from '@/services/ActaService'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { toast } from 'react-toastify'
import { toastOptions } from '@/config/toast'

interface Props {
  actaId: string | undefined
  setIsLoadingGlobal: (val: boolean) => void
}

interface ArchivoModal {
  url: string
  tipo: 'imagen' | 'video' | 'audio' | 'texto' | 'otro'
  extension: string
  texto?: string
}

// Mapa completo de extensiones aceptadas por el backend → MIME correcto
const MIME_POR_EXTENSION: Record<string, string> = {
  // imágenes
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  // pdf
  pdf: 'application/pdf',
  // video
  mp4: 'video/mp4',
  mpeg: 'video/mpeg',
  mov: 'video/quicktime',
  quicktime: 'video/quicktime',
  avi: 'video/x-msvideo',
  // audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  // texto
  txt: 'text/plain',
  text: 'text/plain',
}

const resolverTipoYMime = (contentType: string): { tipo: ArchivoModal['tipo']; mime: string } => {
  const subtipoRaw = contentType.split('/')[1]
  const subtipo = subtipoRaw?.split('+')[0]?.split(';')[0]?.toLowerCase() || ''

  // Normaliza: si conocemos la extensión usamos el MIME correcto
  // (tolerancia al backend que envía p.ej. image/mp4, image/txt, etc.)
  const mimeNormalizado = MIME_POR_EXTENSION[subtipo] ?? contentType
  const categoria = mimeNormalizado.split('/')[0]

  if (mimeNormalizado === 'text/plain') return { tipo: 'texto', mime: mimeNormalizado }
  if (categoria === 'image') return { tipo: 'imagen', mime: mimeNormalizado }
  if (categoria === 'video') return { tipo: 'video', mime: mimeNormalizado }
  if (categoria === 'audio') return { tipo: 'audio', mime: mimeNormalizado }

  return { tipo: 'otro', mime: contentType }
}

const formatearTamano = (bytes: number): string => {
  if (!bytes) return ''
  const unidades = ['B', 'KB', 'MB', 'GB']
  const indice = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), unidades.length - 1)
  const valor = bytes / Math.pow(1024, indice)
  return `${valor.toFixed(indice === 0 ? 0 : 1)} ${unidades[indice]}`
}

interface ArchivoDropzoneProps {
  inputRef: RefObject<HTMLInputElement>
  file: File | null
  onFileChange: (file: File | null) => void
  accept: string
}

const ArchivoDropzone: FC<ArchivoDropzoneProps> = ({
  inputRef,
  file,
  onFileChange,
  accept,
}) => {
  const limpiar = () => {
    if (inputRef.current) inputRef.current.value = ''
    onFileChange(null)
  }

  return (
    <div>
      {file ? (
        <div className="flex items-center gap-3 border border-blue-200 bg-blue-50 rounded-lg px-4 py-3">
          <AttachFileIcon className="text-blue-600 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatearTamano(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={limpiar}
            className="rounded-lg px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold text-sm transition-colors"
            aria-label="Quitar archivo"
          >
            Quitar
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-lg px-4 py-6 cursor-pointer text-center transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
          <CloudUploadIcon className="text-gray-400" fontSize="large" />
          <span className="text-sm font-medium text-gray-700">Hacé clic para adjuntar un archivo</span>
          <span className="text-xs text-gray-400">PDF, imagen, video, audio o texto</span>
        </label>
      )}
    </div>
  )
}

export const PruebasTab = ({ actaId, setIsLoadingGlobal }: Props) => {
  const [pruebas, setPruebas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Estados para nueva prueba
  const [observacion, setObservacion] = useState('')
  const [adjuntarArchivo, setAdjuntarArchivo] = useState(false)
  const [archivo, setArchivo] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado para visualizar archivo
  const [archivoModal, setArchivoModal] = useState<ArchivoModal | null>(null)

  // Estado para editar prueba
  const [editando, setEditando] = useState<any | null>(null)
  const [editObservacion, setEditObservacion] = useState('')
  const [editReemplazarArchivo, setEditReemplazarArchivo] = useState(false)
  const [editArchivo, setEditArchivo] = useState<File | null>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  // Estado para confirmar eliminación
  const [pruebaAEliminar, setPruebaAEliminar] = useState<any | null>(null)

  useEffect(() => {
    if (actaId) {
      getPruebasActa(actaId, setPruebas, setIsLoading)
    }
  }, [actaId])

  const handleToggleArchivo = (checked: boolean) => {
    setAdjuntarArchivo(checked)
    if (!checked) {
      setArchivo(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRegistrarPrueba = () => {
    if (!observacion.trim()) return
    if (adjuntarArchivo && !archivo) return

    const formData = new FormData()
    formData.append('acta_id', String(actaId))
    formData.append('observacion', observacion)
    if (adjuntarArchivo && archivo) {
      formData.append('archivo', archivo)
    }

    postPrueba(
      formData,
      () => {
        setObservacion('')
        setAdjuntarArchivo(false)
        setArchivo(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        getPruebasActa(actaId, setPruebas, setIsLoading)
      },
      setIsLoadingGlobal
    )
  }

  const handleAbrirEdicion = (prueba: any) => {
    setEditando(prueba)
    setEditObservacion(prueba.observacion || '')
    setEditReemplazarArchivo(false)
    setEditArchivo(null)
    if (editFileInputRef.current) editFileInputRef.current.value = ''
  }

  const handleToggleEditArchivo = (checked: boolean) => {
    setEditReemplazarArchivo(checked)
    if (!checked) {
      setEditArchivo(null)
      if (editFileInputRef.current) editFileInputRef.current.value = ''
    }
  }

  const handleGuardarEdicion = () => {
    if (!editando) return
    if (!editObservacion.trim()) return
    if (editReemplazarArchivo && !editArchivo) return

    const formData = new FormData()
    formData.append('acta_id', String(actaId))
    formData.append('observacion', editObservacion)
    if (editReemplazarArchivo && editArchivo) {
      formData.append('archivo', editArchivo)
    }

    putPrueba(
      editando.id,
      formData,
      () => {
        setEditando(null)
        getPruebasActa(actaId, setPruebas, setIsLoading)
      },
      setIsLoadingGlobal
    )
  }

  const handleEliminarPrueba = (prueba: any) => {
    setPruebaAEliminar(prueba)
  }

  const confirmarEliminar = () => {
    if (!pruebaAEliminar) return
    deletePrueba(
      pruebaAEliminar.id,
      () => {
        setPruebaAEliminar(null)
        getPruebasActa(actaId, setPruebas, setIsLoading)
      },
      setIsLoadingGlobal
    )
  }

  const handleVerArchivo = (fileDataUri: string) => {
    try {
      const esDataUri = fileDataUri.startsWith('data:')
      const contentType = esDataUri
        ? fileDataUri.split(';')[0].split(':')[1]
        : 'application/pdf'
      const base64String = esDataUri ? fileDataUri.split(',')[1] : fileDataUri

      const { tipo, mime } = resolverTipoYMime(contentType)

      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mime })
      const url = URL.createObjectURL(blob)

      const subtipoOriginal = contentType.split('/')[1]?.split('+')[0]?.split(';')[0]?.toLowerCase() || ''
      const extension = MIME_POR_EXTENSION[subtipoOriginal] ? subtipoOriginal : (mime.split('/')[1]?.split('+')[0] || 'bin')

      const modalData: ArchivoModal = {
        url,
        tipo,
        extension,
      }

      if (tipo === 'texto') {
        modalData.texto = new TextDecoder('utf-8').decode(byteArray)
      }

      setArchivoModal(modalData)
    } catch {
      toast.error('Error al procesar el archivo', toastOptions)
    }
  }

  const handleCerrarModal = () => {
    if (archivoModal) {
      URL.revokeObjectURL(archivoModal.url)
    }
    setArchivoModal(null)
  }

  const handleDescargarArchivo = () => {
    if (!archivoModal) return
    const link = document.createElement('a')
    link.href = archivoModal.url
    link.download = `prueba_archivo.${archivoModal.extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: GridColDef[] = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'descripcion', headerName: 'Descripción', flex: 2 },
    {
      field: 'archivo',
      headerName: 'Archivo',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.row.archivoFile         ? (
          <button
            type="button"
            onClick={() => handleVerArchivo(params.row.archivoFile)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors"
          >
            Ver
          </button>
        ) : (
          '-'
        ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleAbrirEdicion(params.row.prueba)}
            title="Actualizar"
            aria-label="Actualizar"
            className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => handleEliminarPrueba(params.row.prueba)}
            title="Eliminar"
            aria-label="Eliminar"
            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      ),
    },
  ]

  const filas = pruebas.map((prueba: any, index: number) => ({
    id: prueba.id ?? index,
    fecha: prueba.created_at ? new Date(prueba.created_at).toLocaleDateString('es-ES') : '-',
    // fecha: prueba.created_at ? prueba.created_at.split(' ')[0] : '-',
    descripcion: prueba.observacion || '-',
    archivoFile: prueba?.archivo?.base_64?.file ?? null,
    prueba,
  }))

  const puedeConfirmar = Boolean(observacion.trim()) && (!adjuntarArchivo || Boolean(archivo))

  return (
    <>
      <div className="space-y-8">
        {/* HISTORIAL */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Pruebas</h3>
          <div className="w-full">
            <Table
              data={{ rows: filas, columns }}
              loading={isLoading}
              height={400}
            />
          </div>
        </div>

        {/* REGISTRAR NUEVA PRUEBA */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Registrar Nueva Prueba</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={observacion} onChange={(e) => setObservacion(e.target.value)} />
            </div>
            <div className="w-full flex items-center gap-2">
              <SwitchBase checked={adjuntarArchivo} onCheckedChange={handleToggleArchivo} />
              <span className="text-sm font-medium text-gray-700">Adjuntar archivo</span>
            </div>
              {adjuntarArchivo && (
                <div className="flex-1 min-w-[220px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
                  <ArchivoDropzone
                    inputRef={fileInputRef}
                    file={archivo}
                    onFileChange={setArchivo}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.mp4,.mpeg,.mov,.avi,.mp3,.wav,.ogg,.m4a,.aac,.txt,.text"
                  />
                </div>
              )}
          </div>
          <button
            type="button"
            onClick={handleRegistrarPrueba}
            disabled={!puedeConfirmar}
            className={`px-6 py-2 text-white rounded font-semibold transition-colors ${puedeConfirmar ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Confirmar Prueba
          </button>
        </div>
      </div>

      {/* MODAL EDITAR PRUEBA */}
      <Modal open={Boolean(editando)} onOpenChange={(open) => !open && setEditando(null)} size="lg">
        <ModalHeader
          title="Editar Prueba"
          right={
            <button
              type="button"
              onClick={() => setEditando(null)}
              className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10 font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>
          }
        />
        <ModalContent>
          {editando && (
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                  value={editObservacion}
                  onChange={(e) => setEditObservacion(e.target.value)}
                />
              </div>
              <div className="w-full flex items-center gap-2">
                <SwitchBase checked={editReemplazarArchivo} onCheckedChange={handleToggleEditArchivo} />
                <span className="text-sm font-medium text-gray-700">Reemplazar archivo</span>
              </div>
              {editReemplazarArchivo && (
                <div className="flex-1 min-w-[220px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
                  <ArchivoDropzone
                    inputRef={editFileInputRef}
                    file={editArchivo}
                    onFileChange={setEditArchivo}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.mp4,.mpeg,.mov,.avi,.mp3,.wav,.ogg,.m4a,.aac,.txt,.text"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarEdicion}
                  disabled={!editObservacion.trim() || (editReemplazarArchivo && !editArchivo)}
                  className={`px-4 py-2 text-white rounded font-semibold transition-colors ${editObservacion.trim() && (!editReemplazarArchivo || editArchivo) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Guardar
                </button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      <Modal open={Boolean(pruebaAEliminar)} onOpenChange={(open) => !open && setPruebaAEliminar(null)} size="sm">
        <ModalHeader
          title="Confirmar eliminación"
          right={
            <button
              type="button"
              onClick={() => setPruebaAEliminar(null)}
              className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10 font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>
          }
        />
        <ModalContent>
          <p className="text-sm text-gray-700 mb-6">
            ¿Está seguro de que desea eliminar esta prueba?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPruebaAEliminar(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarEliminar}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
            >
              Eliminar
            </button>
          </div>
        </ModalContent>
      </Modal>

      {/* MODAL VISUALIZAR ARCHIVO */}
      <Modal open={Boolean(archivoModal)} onOpenChange={(open) => !open && handleCerrarModal()} size="lg">
        <ModalHeader
          title="Previsualización de Archivo"
          right={
            <button
              type="button"
              onClick={handleCerrarModal}
              className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10 font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>
          }
        />
        <ModalContent>
          {archivoModal && (
            <div className="flex flex-col gap-4">
              {archivoModal.tipo === 'imagen' && (
                <img
                  src={archivoModal.url}
                  alt="Archivo de prueba"
                  className="max-h-[550px] w-auto mx-auto rounded border border-gray-300"
                />
              )}
              {archivoModal.tipo === 'video' && (
                <video
                  controls
                  preload="metadata"
                  src={archivoModal.url}
                  className="w-full max-h-[550px] rounded border border-gray-300 bg-black"
                />
              )}
              {archivoModal.tipo === 'audio' && (
                <audio
                  controls
                  src={archivoModal.url}
                  className="w-full"
                />
              )}
              {archivoModal.tipo === 'texto' && (
                <pre className="w-full max-h-[550px] overflow-auto whitespace-pre-wrap break-words rounded border border-gray-300 bg-gray-50 p-4 text-sm font-mono">
                  {archivoModal.texto}
                </pre>
              )}
              {archivoModal.tipo === 'otro' && (
                <iframe
                  src={archivoModal.url}
                  className="w-full h-[550px] rounded border border-gray-300"
                  title="Previsualización de Archivo"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleDescargarArchivo}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                >
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={handleCerrarModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
