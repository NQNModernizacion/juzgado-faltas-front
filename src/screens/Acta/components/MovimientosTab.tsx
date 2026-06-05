import { useEffect, useState } from 'react'
import { Table } from '@/components/Table'
import { GridColDef } from '@mui/x-data-grid'
import { getMovimientosActa, postMoverCausa } from '@/services/ActaService'

interface Props {
  actaId: string | undefined
  oficinas: any[]
  setIsLoadingGlobal: (val: boolean) => void
}

export const MovimientosTab = ({ actaId, oficinas, setIsLoadingGlobal }: Props) => {
  const [movimientos, setMovimientos] = useState<any[]>([])
  const [isLoadingMovimientos, setIsLoadingMovimientos] = useState(false)

  // Estados para nuevo movimiento
  const [oficinaDestino, setOficinaDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [fojas, setFojas] = useState('')

  // Cargar historial al montar el tab
  useEffect(() => {
    if (actaId) {
      getMovimientosActa(actaId, setMovimientos, setIsLoadingMovimientos)
    }
  }, [actaId])

  const handleMoverCausa = () => {
    if (!oficinaDestino) return
    const payload = {
      acta_id: actaId,
      oficina_id_destino: oficinaDestino,
      motivo,
      fojas,
    }
    
    // Usamos el loading global para que se bloquee la pantalla al guardar
    postMoverCausa(
      payload,
      () => {
        // Limpiamos form
        setOficinaDestino('')
        setMotivo('')
        setFojas('')
        // Recargamos grilla (con el loader interno de la tabla)
        getMovimientosActa(actaId, setMovimientos, setIsLoadingMovimientos)
      },
      setIsLoadingGlobal
    )
  }

  const columnsMovimientos: GridColDef[] = [
    { field: 'fecha_movimiento', headerName: 'Fecha', flex: 1 },
    { field: 'oficina_origen_desc', headerName: 'Origen', flex: 1.5 },
    { field: 'oficina_destino_desc', headerName: 'Destino', flex: 1.5 },
    { field: 'motivo', headerName: 'Motivo', flex: 2 },
    { field: 'fojas', headerName: 'Fojas', flex: 0.5 },
  ]

  const movimientosFilas = movimientos.map((mov) => ({
    id: mov.id,
    fecha_movimiento: mov.fecha_movimiento
      ? mov.fecha_movimiento.split(' ')[0]
      : '-',
    oficina_origen_desc: mov.oficina_origen?.descripcion || '-',
    oficina_destino_desc: mov.oficina_destino?.descripcion || '-',
    motivo: mov.motivo || '-',
    fojas: mov.fojas || '-',
  }))

  return (
    <div className="space-y-8">
      {/* HISTORIAL */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Historial de Movimientos</h3>
        <div className="w-full">
          <Table
            data={{ rows: movimientosFilas, columns: columnsMovimientos }}
            loading={isLoadingMovimientos}
            height={400}
          />
        </div>
      </div>

      {/* MOVER CAUSA */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Realizar Movimiento (Mover Causa)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oficina Destino
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={oficinaDestino}
              onChange={(e) => setOficinaDestino(e.target.value)}
            >
              <option value="">Seleccione destino...</option>
              {oficinas?.map((oficina: any) => (
                <option key={oficina.id} value={oficina.id}>
                  {oficina.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fojas
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={fojas}
              onChange={(e) => setFojas(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo / Observación
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            ></textarea>
          </div>
        </div>
        <button
          type="button"
          onClick={handleMoverCausa}
          disabled={!oficinaDestino}
          className={`px-6 py-2 text-white rounded font-semibold transition-colors ${
            oficinaDestino
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Confirmar Movimiento
        </button>
      </div>
    </div>
  )
}
