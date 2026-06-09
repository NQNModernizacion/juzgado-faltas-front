import { Container } from '@nqnmodernizacion/muni-ui'
import { useEffect, useState } from 'react'
import { TableData } from './TableData'
import { useNavigate } from 'react-router-dom'
import MuniSpinner from '@/components/MuniSpinner'
import { getActas, postAgruparActas } from '@/services/ActaService'
import TableBackPagination from '@/components/TableBackPagination'

export const ListadoActas = () => {
  const nav = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [actas, setActas] = useState([])
  const [selectedActas, setSelectedActas] = useState<any[]>([])

  const [filtro, setFiltro] = useState({
    estado_id: null,
    busqueda: '',
    oficina: '',
    juzgado: '',
    ultimo_movimiento: '',
  })
  const [page, setPage] = useState(0)
  const pageSize = 100 // Cantidad de filas por página

  const oficinas = actas
    .map((acta: any) => acta.oficina)
    .filter(Boolean)
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index
    )

  const juzgados = actas
    .map((acta: any) => acta.juzgado)
    .filter(Boolean)
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index
    )

  const ultimosMovimientos = actas
    .map((acta: any) => acta.ultimo_movimiento)
    .filter(Boolean)
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index
    )

  const filteredActas = actas.filter((acta: any) => {
    if (
      filtro.oficina &&
      String(acta.oficina).toLowerCase() !==
        String(filtro.oficina).toLowerCase()
    ) {
      return false
    }
    if (
      filtro.juzgado &&
      String(acta.juzgado).toLowerCase() !==
        String(filtro.juzgado).toLowerCase()
    ) {
      return false
    }
    if (
      filtro.ultimo_movimiento &&
      String(acta.ultimo_movimiento).toLowerCase() !==
        String(filtro.ultimo_movimiento).toLowerCase()
    ) {
      return false
    }
    return true
  })

  useEffect(() => {
    getActas(setActas, setIsLoading)
  }, [])

  const handleAgruparActas = () => {
    // if (selectedActas.length < 2) {
    //   alert("Debe seleccionar al menos 2 actas para agrupar")
    //   return
    // }
    postAgruparActas(
      selectedActas,
      () => {
        setSelectedActas([])
        getActas(setActas, setIsLoading)
      },
      setIsLoading
    )
  }

  return (
    <Container title={'Listado de Actas'} linkBack="#/">
      {isLoading ? (
        <MuniSpinner file="muniexpress.svg" />
      ) : (
        <>
          <div className="mb-4 d-flex align-items-center gap-3 p-3 border rounded-3 bg-light shadow-sm">
            <label className="mb-0 fw-semibold">Filtrar:</label>

            <select
              id="filter-oficina"
              className="form-select w-auto rounded-pill px-3"
              value={filtro.oficina}
              onChange={(e) =>
                setFiltro((prev) => ({
                  ...prev,
                  oficina: e.target.value,
                }))
              }
            >
              {/* <option value="">🏢 Todas las oficinas</option> */}
              <option value="">Todas las oficinas</option>

              {oficinas.map((oficina: string) => (
                <option key={oficina} value={oficina}>
                  {oficina}
                </option>
              ))}
            </select>

            <select
              id="filter-juzgado"
              className="form-select w-auto rounded-pill px-3"
              value={filtro.juzgado}
              onChange={(e) =>
                setFiltro((prev) => ({
                  ...prev,
                  juzgado: e.target.value,
                }))
              }
            >
              <option value="">Todos los juzgados</option>
              {/* <option value="">⚖️ Todos los juzgados</option> */}

              {juzgados.map((juzgado: string) => (
                <option key={juzgado} value={juzgado}>
                  {juzgado}
                </option>
              ))}
            </select>

            <select
              id="filter-ultimo-movimiento"
              className="form-select w-auto rounded-pill px-3"
              value={filtro.ultimo_movimiento}
              onChange={(e) =>
                setFiltro((prev) => ({
                  ...prev,
                  ultimo_movimiento: e.target.value,
                }))
              }
            >
              <option value="">Todos últimos movimientos</option>
              {ultimosMovimientos.map((movimiento: string) => (
                <option key={movimiento} value={movimiento}>
                  {movimiento}
                </option>
              ))}
            </select>
          </div>

          <TableBackPagination
            search
            data={TableData(filteredActas, nav)}
            // name="actas"
            paginationMode="server"
            rowCount={filteredActas.length}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            // loading={isLoading}
            onSelectionModelChange={setSelectedActas}
            render={() =>
              selectedActas.length > 0 ? (
                <button
                  onClick={handleAgruparActas}
                  className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill font-semibold"
                >
                  Agrupar {selectedActas.length} actas
                </button>
              ) : (
                <span />
              )
            }
          />
        </>
      )}
    </Container>
  )
}
