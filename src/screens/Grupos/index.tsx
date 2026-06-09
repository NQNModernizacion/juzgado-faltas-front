import { useEffect, useState, useMemo } from 'react'
import { Container } from '@nqnmodernizacion/muni-ui'
import MuniSpinner from '@/components/MuniSpinner'
import TableBackPagination from '@/components/TableBackPagination'
import { getGruposActas } from '@/services/ActaService'
import { DetalleGrupo } from './components/DetalleGrupo'

const Grupos = () => {
  const [grupos, setGrupos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGrupoId, setSelectedGrupoId] = useState<number | null>(null)

  const fetchGrupos = () => {
    getGruposActas(setGrupos, setIsLoading)
  }

  useEffect(() => {
    fetchGrupos()
  }, [])

  // Columns for the Groups table
  const columnsGrupos = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'Número de Grupo',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'estado',
        headerName: 'Estado',
        flex: 1.2,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: any) => {
          const status =
            params.row.estado?.label ??
            params.row.estado?.nombre ??
            params.row.estado ??
            'Sin Estado'
          return (
            <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              {status}
            </span>
          )
        },
      },
      {
        field: 'observacion',
        headerName: 'Observación',
        flex: 2,
        renderCell: (params: any) => params.row.observacion || '-',
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: any) => (
          <button
            onClick={() => setSelectedGrupoId(params.row.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm font-semibold transition"
          >
            Ver Detalle
          </button>
        ),
      },
    ]
  }, [])

  // Prepare table data format for groups
  const tableDataGrupos = useMemo(() => {
    return {
      rows: grupos,
      columns: columnsGrupos,
      filter: (row: any, value: string) => {
        const q = value.toLowerCase()
        const idStr = String(row.id).toLowerCase()
        const estadoStr = String(
          row.estado?.label ?? row.estado?.nombre ?? row.estado ?? ''
        ).toLowerCase()
        const obsStr = String(row.observacion ?? '').toLowerCase()
        return idStr.includes(q) || estadoStr.includes(q) || obsStr.includes(q)
      },
    }
  }, [grupos, columnsGrupos])

  const [page, setPage] = useState(0)
  const pageSize = 10

  if (selectedGrupoId !== null) {
    return (
      <DetalleGrupo
        grupoId={selectedGrupoId}
        onBack={() => {
          setSelectedGrupoId(null)
          fetchGrupos() // refresh list when coming back
        }}
      />
    )
  }

  return (
    <Container title="Listado de Grupos" linkBack="#/">
      {isLoading && grupos.length === 0 ? (
        <MuniSpinner file="muniexpress.svg" />
      ) : (
        <TableBackPagination
          search
          data={tableDataGrupos}
          paginationMode="client"
          rowCount={grupos.length}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          loading={isLoading}
        />
      )}
    </Container>
  )
}

export default Grupos
