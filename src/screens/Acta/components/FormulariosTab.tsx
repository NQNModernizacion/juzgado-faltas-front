import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { getFormulariosActa, guardarFormularioActa, FormularioActa } from '@/services/ActaService'

interface Props {
  actaId: string | undefined
  setIsLoadingGlobal: (val: boolean) => void
}

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['clean'],
]

export const FormulariosTab = ({ actaId, setIsLoadingGlobal }: Props) => {
  const [formularios, setFormularios] = useState<FormularioActa[]>([])
  const [formularioId, setFormularioId] = useState('')
  const [contenido, setContenido] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (actaId) {
      getFormulariosActa(actaId, setFormularios, setIsLoading)
    }
  }, [actaId])

  const handleSeleccionar = (id: string) => {
    setFormularioId(id)
    const seleccionado = formularios.find((f) => String(f.id) === id)
    setContenido(seleccionado?.contenido ?? '')
  }

  const handleGuardar = () => {
    if (!formularioId || !actaId) return
    guardarFormularioActa(actaId, formularioId, contenido, undefined, setIsLoadingGlobal)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Formularios</h3>

      <div className="mb-4 max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">Formulario</label>
        <select className="w-full border rounded-lg px-3 py-2" value={formularioId} onChange={(e) => handleSeleccionar(e.target.value)}>
          <option value="">Seleccione un formulario...</option>
          {formularios.map((f) => (
            <option key={f.id} value={String(f.id)}>
              {f.nombre}
            </option>
          ))}
        </select>
      </div>

      {formularioId ? (
        <>
          <ReactQuill
            theme="snow"
            value={contenido}
            onChange={(value) => setContenido(value)}
            modules={{ toolbar: TOOLBAR }}
            placeholder="Escriba el contenido del formulario..."
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleGuardar}
              disabled={isLoading}
              className="px-6 py-2 text-white rounded font-semibold transition-colors bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar Formulario
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">Seleccione un formulario para editarlo.</p>
      )}
    </div>
  )
}
