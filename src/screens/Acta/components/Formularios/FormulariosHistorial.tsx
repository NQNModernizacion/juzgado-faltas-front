import { FormularioGuardado } from '@/services/FormularioService'

export interface FormulariosHistorialProps {
  formularios: FormularioGuardado[]
  isCargando: boolean
  isRecargando?: boolean
  recentlyUpdatedId?: number | null
  descargandoId: number | null
  previsualizandoId?: number | null
  reemitiendoId?: number | null
  isCargandoPdf: boolean
  editingDocumentoId?: number | null
  onRecargar: () => void
  onPrevisualizar: (documentoId: number) => void
  onDescargar: (documentoId: number, tipoDoc: string) => void
  onEditar?: (formulario: FormularioGuardado) => void
  onReemitir?: (formulario: FormularioGuardado) => void
  onAnular?: (formulario: FormularioGuardado) => void
}

export const FormulariosHistorial = ({
  formularios,
  isCargando,
  isRecargando,
  recentlyUpdatedId,
  descargandoId,
  previsualizandoId,
  reemitiendoId,
  isCargandoPdf,
  editingDocumentoId,
  onRecargar,
  onPrevisualizar,
  onDescargar,
  onEditar,
  onReemitir,
  onAnular,
}: FormulariosHistorialProps) => {
  const isUpdating = isCargando || isRecargando

  return (
    <div className="mx-section p-2 sm:p-3 bg-white">
      <div className="flex items-center justify-between border-b pb-1 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-primary-500 uppercase tracking-wide">
            Documentos y Formularios Emitidos
          </h3>
          <span className="text-[11px] bg-primary-100 text-primary-700 font-semibold px-2 py-0.2 rounded-full">
            {isCargando ? '...' : formularios.length}
          </span>
          {isRecargando && (
            <span className="text-[11px] text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-medium border border-primary-200 animate-pulse">
              <svg className="animate-spin h-3 w-3 text-primary-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sincronizando tabla...
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onRecargar}
          disabled={isUpdating}
          className="text-[11px] text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <span className={isUpdating ? 'animate-spin inline-block' : ''}>↻</span>
          {isUpdating ? 'Actualizando...' : 'Actualizar lista'}
        </button>
      </div>

      {isRecargando && (
        <div className="relative w-full h-1 bg-primary-100 overflow-hidden rounded mb-1">
          <div className="absolute inset-0 bg-primary-500 animate-pulse"></div>
        </div>
      )}

      {isCargando && formularios.length === 0 ? (
        /* SKELETON LOADER PARA TABLA DE HISTORIAL */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-[11px] font-bold text-textSecondary uppercase">
                <th className="py-1 px-2">ID</th>
                <th className="py-1 px-2">Fecha de Emisión</th>
                <th className="py-1 px-2">Plantilla / Tipo</th>
                <th className="py-1 px-2 text-center">Estado</th>
                <th className="py-1 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {[1, 2, 3].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td className="py-2.5 px-2">
                    <div className="h-3.5 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="h-3.5 bg-gray-200 rounded w-28"></div>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="h-3.5 bg-gray-200 rounded w-36"></div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <div className="h-5 bg-gray-200 rounded-full w-20 mx-auto"></div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="flex justify-end gap-1.5">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : formularios.length === 0 ? (
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
                <th className="py-1 px-2 text-center">Estado</th>
                <th className="py-1 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-gray-100 text-xs transition-opacity duration-300 ${
                isRecargando ? 'opacity-50 pointer-events-none' : 'opacity-100'
              }`}
            >
              {formularios.map((f) => {
                const isDownloading = descargandoId === f.id
                const isPrevisualizando = previsualizandoId === f.id
                const isReemitiendo = reemitiendoId === f.id
                const isEditingThis = editingDocumentoId === f.id
                const isAnulado = f.estado === 'anulado'
                const isReemplazado = f.estado === 'reemplazado'
                const isRecentlyUpdated = recentlyUpdatedId === f.id
                return (
                  <tr
                    key={f.id}
                    className={`transition-all duration-300 ${
                      isRecentlyUpdated
                        ? 'bg-emerald-50/90 ring-1 ring-emerald-400 font-semibold'
                        : isAnulado
                        ? 'bg-gray-50/70 opacity-80'
                        : isReemplazado
                        ? 'bg-gray-50/40 text-gray-500'
                        : isEditingThis
                        ? 'bg-amber-50/80 font-medium'
                        : 'hover:bg-primary-50/40'
                    }`}
                  >
                    <td className="py-1 px-2 font-medium text-gray-700">
                      <div className="flex items-center gap-1">
                        <span>#{f.id}</span>
                        {isRecentlyUpdated && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded animate-pulse">
                            ¡Actualizado!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1 px-2 text-gray-600">{f.created_at}</td>
                    <td className="py-1 px-2 font-semibold text-primary-700">
                      {f.plantilla?.nombre ?? f.tipo}
                    </td>
                    <td className="py-1 px-2 text-center">
                      {isAnulado ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200"
                          title={`Documento Anulado: ${f.motivo_anulacion || 'Sin motivo especificado'}`}
                        >
                          🚫 Anulado
                        </span>
                      ) : isReemplazado ? (
                        <div className="inline-flex flex-col items-center">
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300"
                            title={`Documento histórico superado por una emisión posterior${f.reemplazado_por_id ? ` (#${f.reemplazado_por_id})` : ''}`}
                          >
                            📦 Reemplazado
                          </span>
                          {f.reemplazado_por_id && (
                            <span className="text-[9px] text-gray-600 font-semibold mt-0.5">
                              Por #{f.reemplazado_por_id}
                            </span>
                          )}
                        </div>
                      ) : f.desactualizado ? (
                        <div className="inline-flex flex-col items-center">
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 cursor-help"
                            title={`El acta registró ${f.cant_movimientos_posteriores ?? 0} movimiento(s) y ${f.cant_estados_posteriores ?? 0} cambio(s) de estado procesal posteriores a esta emisión.`}
                          >
                            🟡 Desactualizado
                          </span>
                          {(f.cant_movimientos_posteriores || f.cant_estados_posteriores) && (
                            <span className="text-[9px] text-amber-700">
                              +{f.cant_movimientos_posteriores ?? 0} mov / +{f.cant_estados_posteriores ?? 0} est
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">
                            🟢 Vigente
                          </span>
                          {f.documento_reemplazado_id && (
                            <span className="text-[9px] text-purple-700 font-medium mt-0.5">
                              Reemite #{f.documento_reemplazado_id}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-1 px-2 text-right space-x-1 whitespace-nowrap">
                      {onEditar && !isAnulado && !isReemplazado && (
                        <button
                          type="button"
                          onClick={() => onEditar(f)}
                          className={`h-6 px-2 text-[11px] rounded font-medium border transition-colors ${
                            isEditingThis
                              ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                          }`}
                          title={f.desactualizado ? 'Editar documento existente (Advertencia: Existen movimientos posteriores)' : 'Editar documento'}
                        >
                          {isEditingThis ? '✏️ Editando...' : '✏️ Editar'}
                        </button>
                      )}
                      {onReemitir && !isAnulado && (
                        <button
                          type="button"
                          onClick={() => onReemitir(f)}
                          disabled={isReemitiendo}
                          className="h-6 px-2 text-[11px] bg-purple-50 text-purple-700 hover:bg-purple-100 rounded font-medium border border-purple-200 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                          title="Reemitir: Genera un nuevo documento con las tablas procesales actualizadas conservando el texto redactado"
                        >
                          {isReemitiendo ? (
                            <>
                              <svg className="animate-spin h-3 w-3 text-purple-700" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Reemitiendo...
                            </>
                          ) : (
                            '📋 Reemitir'
                          )}
                        </button>
                      )}
                      {onAnular && !isAnulado && !isReemplazado && (
                        <button
                          type="button"
                          onClick={() => onAnular(f)}
                          className="h-6 px-2 text-[11px] bg-rose-50 text-rose-700 hover:bg-rose-100 rounded font-medium border border-rose-200 transition-colors"
                          title="Anular documento formalmente"
                        >
                          🚫 Anular
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onPrevisualizar(f.id)}
                        disabled={isCargandoPdf || isPrevisualizando}
                        className="h-6 px-2 text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium border border-blue-200 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        {isPrevisualizando ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-blue-700" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Abriendo...
                          </>
                        ) : (
                          '👁 Previsualizar'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDescargar(f.id, f.tipo)}
                        disabled={isDownloading}
                        className="h-6 px-2 text-[11px] bg-green-50 text-green-700 hover:bg-green-100 rounded font-medium border border-green-200 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        {isDownloading ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-green-700" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Descargando...
                          </>
                        ) : (
                          '⬇ Descargar PDF'
                        )}
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
  )
}
