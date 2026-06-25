export const TableData = (data: any, nav: any) => {
  const columns = [
    {
      field: 'id',
      // headerName: 'ID',
      headerName: 'N° Causa',
      minWidth: 1,
      flex: 0.5,
      align: 'center',
    },
    {
      field: 'numero_acta',
      headerName: 'N° Acta',
      minWidth: 20,
      flex: 0.5,
      align: 'center',
    },
    {
      field: 'oficina',
      headerName: 'Oficina',
      minWidth: 50,
      flex: 1,
    },
    {
      field: 'ultimo_movimiento',
      headerName: 'Último Movimiento',
      minWidth: 50,
      flex: 0.8,
    },
    {
      field: 'juzgado',
      headerName: 'Juzgado',
      minWidth: 50,
      flex: 0.8,
    },
    {
      field: 'grupo_acta_id',
      headerName: 'Grupo',
      minWidth: 50,
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => {
        let clase = params.row.grupo_acta_id
          ? 'px-3 py-1 rounded text-xs font-medium text-white bg-teal-500'
          : ''
        return (
          <span className={clase}>
            {params.row.grupo_acta_id ?? 'Sin Grupo'}
          </span>
        )
      },
    },
    {
      field: 'year',
      headerName: 'Año',
      minWidth: 1,
      flex: 0.5,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      minWidth: 20,
      flex: 0.5,
      renderCell: (params: any) => {
        const btn = (
          <>
            <div className="">
              <button
                onClick={() => nav(`/acta/visualizar/${params.row.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow-sm transition"
              >
                Ver
              </button>
            </div>
          </>
        )

        return btn
      },
    },
  ]

  const rows = data.map((d: any) => {
    return {
      id: d.id,
      numero_acta: d.numero_acta,
      oficina: d.oficina,
      ultimo_movimiento: d.ultimo_movimiento,
      juzgado: d.juzgado,
      year: d.year,
      grupo_acta_id: d.grupo_acta_id,
      // fecha_labrada: d.fecha_labrada,
      // fecha_labrada: d.created_at?.slice(0, 16),
      event: d.event,
    }
  })

  const filter = (d: any, value: any) => {
    value = value.toLowerCase()

    return (
      String(d.id)?.toString().toLowerCase().includes(value) ||
      String(d.numero_acta)?.toString().toLowerCase().includes(value) ||
      String(d.oficina)?.toString().toLowerCase().includes(value) ||
      String(d.ultimo_movimiento)?.toString().toLowerCase().includes(value) ||
      String(d.juzgado)?.toString().toLowerCase().includes(value) ||
      String(d.year)?.toString().toLowerCase().includes(value) ||
      String(d.grupo_acta_id)?.toString().toLowerCase().includes(value) ||
      String(d.event)?.toString().toLowerCase().includes(value)
    )
  }

  return { columns, rows, filter }
}
