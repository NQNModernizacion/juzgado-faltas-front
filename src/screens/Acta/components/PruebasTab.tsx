import { useEffect, useState } from 'react'
import { Table } from '@/components/Table'
import { GridColDef } from '@mui/x-data-grid'
import { getPruebasActa } from '@/services/ActaService'

interface Props {
  actaId: string | undefined
}

export const PruebasTab = ({ actaId }: Props) => {
  const [pruebas, setPruebas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (actaId) {
      getPruebasActa(actaId, setPruebas, setIsLoading)
    }
  }, [actaId])

  const columns: GridColDef[] = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'tipo', headerName: 'Tipo', flex: 1.5 },
    { field: 'descripcion', headerName: 'Descripción', flex: 2 },
    { field: 'archivo', headerName: 'Archivo', flex: 1 },
  ]

  const filas = pruebas.map((prueba: any, index: number) => ({
    id: prueba.id ?? index,
    fecha: prueba.fecha ? prueba.fecha.split(' ')[0] : '-',
    tipo: prueba.tipo_prueba || prueba.tipo || '-',
    descripcion: prueba.descripcion || '-',
    archivo: prueba.archivo || prueba.nombre_archivo || '-',
  }))

  return (
    <div className="space-y-8">
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
    </div>
  )
}
