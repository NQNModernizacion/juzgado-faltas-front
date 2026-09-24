import { FormularioGuardado } from '@/services/FormularioService'

export interface FormulariosHistorialProps {
  formularios: FormularioGuardado[]
  isCargando: boolean
  descargandoId: number | null
  isCargandoPdf: boolean
  onRecargar: () => void
  onPrevisualizar: (documentoId: number) => void
  onDescargar: (documentoId: number, tipoDoc: string) => void
}

export const FormulariosHistorial = ({
  formularios,
  isCargando,
  descargandoId,
  isCargandoPdf,
  onRecargar,
  onPrevisualizar,
  onDescargar,
}: FormulariosHistorialProps) => {
  return (
    <div className="mx-section p-2 sm:p-3 bg-white">
      <div className="flex items-center justify-between border-b pb-1 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-primary-500 uppercase tracking-wide">
            Documentos y Formularios Emitidos
          </h3>
          <span className="text-[11px] bg-primary-100 text-primary-700 font-semibold px-2 py-0.2 rounded-full">
            {formularios.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onRecargar}
          disabled={isCargando}
          className="text-[11px] text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          ↻ Actualizar lista
        </button>
      </div>

      {formularios.length === 0 ? (
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
              {formularios.map((f) => {
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
                        onClick={() => onPrevisualizar(f.id)}
                        disabled={isCargandoPdf}
                        className="h-6 px-2 text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium border border-blue-200 transition-colors disabled:opacity-50"
                      >
                        👁 Previsualizar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDescargar(f.id, f.tipo)}
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
  )
}
