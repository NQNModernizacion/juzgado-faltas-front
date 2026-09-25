import { useId } from 'react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import { Plantilla } from '@/services/FormularioService'
import { TinyEditor } from './TinyEditor'

export interface FormularioEmisionProps {
  plantillas: Plantilla[]
  selectedCodigo: string
  contenido: string
  isCargandoInicial: boolean
  isPrecargando: boolean
  isGuardando: boolean
  editingDocumentoId?: number | null
  onCancelarEdicion?: () => void
  onSeleccionarPlantilla: (codigo: string) => void
  onChangeContenido: (html: string) => void
  onGuardar: () => void
  onInitEditor: (editor: TinyMCEEditor) => void
}

export const FormularioEmision = ({
  plantillas,
  selectedCodigo,
  contenido,
  isCargandoInicial,
  isPrecargando,
  isGuardando,
  editingDocumentoId,
  onCancelarEdicion,
  onSeleccionarPlantilla,
  onChangeContenido,
  onGuardar,
  onInitEditor,
}: FormularioEmisionProps) => {
  const selectId = useId()

  return (
    <div id="formulario-emision-section" className="mx-section p-2 sm:p-3 bg-white">
      <div className="flex items-center justify-between border-b pb-1 mb-2">
        <div className="flex items-center gap-2">
          <h3
            className={`text-xs font-bold uppercase tracking-wide ${
              editingDocumentoId ? 'text-amber-600' : 'text-primary-500'
            }`}
          >
            {editingDocumentoId
              ? `✏️ Editando Formulario / Sentencia (#${editingDocumentoId})`
              : 'Emisión de Nuevo Formulario / Sentencia'}
          </h3>
          {editingDocumentoId && (
            <span className="text-[11px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.2 rounded-full">
              Modo Edición
            </span>
          )}
        </div>
        {editingDocumentoId && onCancelarEdicion && (
          <button
            type="button"
            onClick={onCancelarEdicion}
            className="text-[11px] text-gray-600 hover:text-gray-900 font-medium px-2 py-0.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            ✖ Cancelar Edición
          </button>
        )}
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
            onChange={(e) => onSeleccionarPlantilla(e.target.value)}
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

      {/* Editor TinyMCE */}
      {selectedCodigo ? (
        <div className="space-y-2">
          <TinyEditor
            value={contenido}
            onChange={onChangeContenido}
            onInit={onInitEditor}
            disabled={isGuardando || isPrecargando}
          />

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-gray-500 italic">
              {editingDocumentoId
                ? `* Modificando documento guardado #${editingDocumentoId}. Al presionar "Actualizar", los cambios reemplazarán la versión en la causa.`
                : '* Formato procesador de texto legal: justificado de margen a margen, control de fuentes, tablas y saltos de página.'}
            </p>
            <button
              type="button"
              onClick={onGuardar}
              disabled={isGuardando || isPrecargando || !contenido}
              className={`h-8 px-4 text-xs text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                editingDocumentoId
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isGuardando ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {editingDocumentoId ? 'Actualizando...' : 'Guardando...'}
                </>
              ) : (
                editingDocumentoId ? '💾 Actualizar Formulario' : '💾 Guardar Formulario'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xs text-gray-500">
            Elija una plantilla del combo superior para precargar el documento en el editor TinyMCE con los datos de esta causa y comenzar la redacción.
          </p>
        </div>
      )}
    </div>
  )
}
