import { useNavigate } from 'react-router-dom'
import { Table } from '@/components/Table'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getGrupoActa } from '@/services/ActaService'

interface Props {
  actaId: any
  grupo: any
}

export const GrupoTab = ({ actaId, grupo }: Props) => {
  const nav = useNavigate()
  const [grupoState, setGrupoState] = useState<any>(grupo)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getGrupoActa(actaId, setIsLoading, setGrupoState)
  }, [actaId])

  if (!grupo) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        <p>Esta acta no pertenece a ningún grupo.</p>
      </div>
    )
  }

  // Asumimos que el backend envía la relación actas dentro del objeto grupo
  const actasDelGrupo = grupo.actas || []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Causa', width: 100, align: 'center' },
    { field: 'numero_acta', headerName: 'Nº Acta', width: 80, flex: 1 },
    { field: 'juzgado', headerName: 'Juzgado', width: 180, flex: 1 },
    { field: 'year', headerName: 'Año', flex: 1, width: 180 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            nav(`/acta/visualizar/${params.row.id}`)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow-sm transition"
        >
          Ver Acta
        </button>
      ),
    },
  ]

  const filas = actasDelGrupo.map((acta: any) => ({
    id: acta.id,
    numero_acta: acta.numero_acta || '-',
    juzgado: acta.juzgado?.descripcion || acta.juzgado || '-',
    year: acta.year || '-',
  }))

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Grupo # {grupo.id}
          </h3>
          {grupo.observacion && (
            <p className="text-sm text-gray-600 mt-1">
              Observación: {grupo.observacion}
            </p>
          )}
        </div>

        <div className="w-full">
          {/* {grupoState?.actas?.length > 0 ? ( */}
          <Table
            data={{ rows: grupoState?.actas, columns }}
            height={400}
            loading={isLoading}
            noResultsMessage="No se encontraron actas relacionadas en este grupo o no se cargaron correctamente."
          />
          {/* ) : (
            <p className="text-sm text-gray-500 py-4 text-center">
              No se encontraron actas relacionadas en este grupo o no se
              cargaron correctamente.
            </p>
          )} */}
        </div>
      </div>
    </div>
  )
}
