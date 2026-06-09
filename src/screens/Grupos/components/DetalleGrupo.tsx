import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@nqnmodernizacion/muni-ui'
import MuniSpinner from '@/components/MuniSpinner'
import TableBackPagination from '@/components/TableBackPagination'
import ChevronLeft from '@/components/Svgs/ChevronLeft'
import { getGrupoActaDetail } from '@/services/ActaService'
import { TableData } from '@/screens/Acta/TableData'
import { BannerAgregarActa } from './BannerAgregarActa'

interface DetalleGrupoProps {
  grupoId: number
  onBack: () => void
}

export const DetalleGrupo = ({ grupoId, onBack }: DetalleGrupoProps) => {
  const nav = useNavigate()
  const [grupoDetail, setGrupoDetail] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [actasPage, setActasPage] = useState(0)
  const pageSize = 10

  const fetchDetail = () => {
    getGrupoActaDetail(grupoId, setGrupoDetail, setIsLoading)
  }

  useEffect(() => {
    fetchDetail()
  }, [grupoId])

  // Prepare table data format for actas of the group
  const actasTableData = useMemo(() => {
    if (!grupoDetail || !grupoDetail.actas) {
      return { rows: [], columns: [], filter: () => false }
    }
    return TableData(grupoDetail.actas, nav)
  }, [grupoDetail, nav])

  return (
    <Container
      title={`Detalle de Grupo #${grupoId}`}
      backIcon={<ChevronLeft className="size-4 shrink-0 text-primary-700" />}
      backLabel="Volver al Listado"
      onBack={onBack}
    >
      {isLoading && <MuniSpinner file="muniexpress.svg" />}

      {!isLoading && grupoDetail && (
        <div className="space-y-6">
          {/* Información básica del grupo */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-bold mb-4">Información del Grupo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Estado
                </label>
                <span className="inline-block mt-1 px-3 py-1 rounded bg-blue-100 text-blue-800 text-sm font-semibold border border-blue-200">
                  {grupoDetail.estado?.label ??
                    grupoDetail.estado?.nombre ??
                    grupoDetail.estado ??
                    'Sin Estado'}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Observación
                </label>
                <p className="mt-1 text-sm text-gray-700">
                  {grupoDetail.observacion || 'Sin observaciones'}
                </p>
              </div>
            </div>
          </div>

          {/* Banner para agregar acta */}
          <BannerAgregarActa
            grupoId={grupoId}
            onSuccess={fetchDetail}
            setIsLoading={setIsLoading}
          />

          {/* Tabla de Actas del grupo */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-bold mb-4">Actas en este Grupo</h3>
            {grupoDetail.actas && grupoDetail.actas.length > 0 ? (
              <TableBackPagination
                search
                data={actasTableData}
                paginationMode="client"
                rowCount={grupoDetail.actas.length}
                page={actasPage}
                pageSize={pageSize}
                setPage={setActasPage}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Este grupo no contiene actas asignadas actualmente.
              </div>
            )}
          </div>
        </div>
      )}

      {!isLoading && !grupoDetail && (
        <div className="text-center py-8 text-gray-500">
          No se pudo cargar la información del grupo.
        </div>
      )}
    </Container>
  )
}
