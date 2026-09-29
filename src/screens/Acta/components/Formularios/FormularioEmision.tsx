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
  reemisionOrigenId?: number | null
  onCancelarEdicion?: () => void
  onCancelarReemision?: () => void
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
  reemisionOrigenId,
  onCancelarEdicion,
  onCancelarReemision,
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
              editingDocumentoId
                ? 'text-amber-600'
                : reemisionOrigenId
                ? 'text-purple-600'
                : 'text-primary-500'
            }`}
          >
            {editingDocumentoId
              ? `✏️ Editando Formulario / Sentencia (#${editingDocumentoId})`
              : reemisionOrigenId
              ? `📋 Reemitiendo Formulario (Basado en #${reemisionOrigenId})`
              : 'Emisión de Nuevo Formulario / Sentencia'}
          </h3>
          {editingDocumentoId && (
            <span className="text-[11px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.2 rounded-full">
              Modo Edición
            </span>
          )}
          {reemisionOrigenId && (
            <span className="text-[11px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.2 rounded-full">
              Reemisión Actualizada
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
        {reemisionOrigenId && onCancelarReemision && (
          <button
            type="button"
            onClick={onCancelarReemision}
            className="text-[11px] text-purple-700 hover:text-purple-900 font-medium px-2 py-0.5 rounded border border-purple-300 hover:bg-purple-100 transition-colors flex items-center gap-1"
          >
            ✖ Cancelar Reemisión
          </button>
        )}
      </div>

      {reemisionOrigenId && (
        <div className="bg-purple-50 border border-purple-200 rounded-md p-2 mb-2 flex items-start gap-2 text-xs text-purple-800">
          <span className="text-base leading-none">ℹ️</span>
          <div>
            <strong>Reemisión con datos vigentes:</strong> Se regeneraron las tablas de estados procesales y movimientos con el estado actual del expediente, incorporando el texto legal que fue redactado en el documento #{reemisionOrigenId}. Al guardar, se generará un nuevo documento vigente vinculado como sucesor.
          </div>
        </div>
      )}

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
            disabled={isCargandoInicial || isPrecargando || isGuardando || !!reemisionOrigenId}
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

      {/* Editor TinyMCE o Skeleton de Precarga */}
      {isPrecargando ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 animate-pulse space-y-3">
          <div className="h-8 bg-gray-200/80 rounded w-full flex items-center gap-2 px-3">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-12 ml-auto"></div>
          </div>
          <div className="bg-white p-6 rounded border border-gray-100 shadow-sm space-y-4 min-h-[300px]">
            <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
            <div className="h-16 bg-gray-100 rounded w-full border border-gray-200/60 p-2"></div>
            <div className="space-y-2">
              <div className="h-3.5 bg-gray-200 rounded w-full"></div>
              <div className="h-3.5 bg-gray-200 rounded w-11/12"></div>
              <div className="h-3.5 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex justify-center items-center py-6">
              <span className="text-xs font-semibold text-primary-600 animate-pulse flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Precargando datos judiciales y tablas procesales del acta...
              </span>
            </div>
          </div>
        </div>
      ) : selectedCodigo ? (
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
                : reemisionOrigenId
                ? `* Reemitiendo a partir del documento #${reemisionOrigenId}. Se emitirá un nuevo registro con el historial vigente.`
                : '* Formato procesador de texto legal: justificado de margen a margen, control de fuentes, tablas y saltos de página.'}
            </p>
            <button
              type="button"
              onClick={onGuardar}
              disabled={isGuardando || isPrecargando || !contenido}
              className={`h-8 px-4 text-xs text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                editingDocumentoId
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : reemisionOrigenId
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isGuardando ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {editingDocumentoId
                    ? 'Actualizando...'
                    : reemisionOrigenId
                    ? 'Reemitiendo...'
                    : 'Guardando...'}
                </>
              ) : (
                editingDocumentoId
                  ? '💾 Actualizar Formulario'
                  : reemisionOrigenId
                  ? '💾 Emitir Nuevo Formulario Actualizado'
                  : '💾 Guardar Formulario'
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
