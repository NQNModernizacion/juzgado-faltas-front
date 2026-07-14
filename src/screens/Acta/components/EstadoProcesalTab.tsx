import { useEffect, useState } from 'react'
import { Table } from '@/components/Table'
import { GridColDef } from '@mui/x-data-grid'
import { getEstadosProcesalesActa, postEstadoProcesal } from '@/services/ActaService'

interface Option {
  value: string | number
  label: string
}

interface Props {
  actaId: string | undefined
  estadosProcesales: Option[]
  setIsLoadingGlobal: (val: boolean) => void
}

export const EstadoProcesalTab = ({ actaId, estadosProcesales, setIsLoadingGlobal }: Props) => {
  const [estados, setEstados] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [estadoProcesalId, setEstadoProcesalId] = useState('')
  const [observacion, setObservacion] = useState('')

  useEffect(() => {
    if (actaId) {
      getEstadosProcesalesActa(actaId, setEstados, setIsLoading)
    }
  }, [actaId])

  const handleRegistrarEstadoProcesal = () => {
    if (!estadoProcesalId) return
    postEstadoProcesal(
      {
        acta_id: actaId,
        estado_procesal_id: estadoProcesalId,
        observacion,
      },
      () => {
        setEstadoProcesalId('')
        setObservacion('')
        getEstadosProcesalesActa(actaId, setEstados, setIsLoading)
      },
      setIsLoadingGlobal
    )
  }

  const columns: GridColDef[] = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1.5 },
    { field: 'observacion', headerName: 'Observación', flex: 2 },
  ]

  const filas = estados.map((estado: any, index: number) => ({
    id: estado.id ?? index,
    fecha: estado.fecha ? estado.fecha.split(' ')[0] : '-',
    estado: `${estado.estado} - ${estado.descripcion}` || '-',
    observacion: estado.observacion || estado.observaciones || '-',
  }))

  return (
    <div className="space-y-8">
      {/* HISTORIAL */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Estados Procesales</h3>
        <div className="w-full">
          <Table data={{ rows: filas, columns }} loading={isLoading} height={400} />
        </div>
      </div>

      {/* REGISTRAR NUEVO ESTADO PROCESAL */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Registrar Nuevo Estado Procesal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado Procesal</label>
            <select className="w-full border rounded-lg px-3 py-2" value={estadoProcesalId} onChange={(e) => setEstadoProcesalId(e.target.value)}>
              <option value="">Seleccione un estado...</option>
              {estadosProcesales?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
            <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={observacion} onChange={(e) => setObservacion(e.target.value)} />
          </div>
        </div>
        <button
          type="button"
          onClick={handleRegistrarEstadoProcesal}
          disabled={!estadoProcesalId}
          className={`px-6 py-2 text-white rounded font-semibold transition-colors ${estadoProcesalId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Confirmar Estado Procesal
        </button>
      </div>
    </div>
  )
}
