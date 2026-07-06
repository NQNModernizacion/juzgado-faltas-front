import { useEffect, useState } from 'react'
import { Table } from '@/components/Table'
import { GridColDef } from '@mui/x-data-grid'
import { getEstadosProcesalesActa } from '@/services/ActaService'

interface Props {
  actaId: string | undefined
}

export const EstadoProcesalTab = ({ actaId }: Props) => {
  const [estados, setEstados] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (actaId) {
      getEstadosProcesalesActa(actaId, setEstados, setIsLoading)
    }
  }, [actaId])

  const columns: GridColDef[] = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1.5 },
    { field: 'observacion', headerName: 'Observación', flex: 2 },
  ]

  const filas = estados.map((estado: any, index: number) => ({
    id: estado.id ?? index,
    fecha: estado.fecha ? estado.fecha.split(' ')[0] : '-',
    estado: estado.estado || estado.nombre || '-',
    observacion: estado.observacion || estado.observaciones || '-',
  }))

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Estados Procesales</h3>
        <div className="w-full">
          <Table
            data={{ rows: filas, columns }}
            loading={isLoading}
            height={400}
          />
        </div>
      </div>
    </div>
  )
}
