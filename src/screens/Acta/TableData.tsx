export const TableData = (data: any, nav: any) => {
  console.log('data table', data)
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
    // {
    //     field: "fecha_labrada",
    //     headerName: "Fecha Labrada",
    //     minWidth: 100,
    //     flex: 1,
    // },

    // {
    //     field: "estado",
    //     headerName: "Estado",
    //     minWidth: 100,
    //     flex: 1,
    //     renderCell: (params: any) => {

    //         let clase =
    //             "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-blue-500";

    //         if (params.row.estado.id === 21)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-blue-500";
    //         if (params.row.estado.id === 19)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-orange-500";
    //         if (params.row.estado.id === 20)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-green-500";
    //         if (params.row.estado.id === 22)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-red-500";
    //         if (params.row.estado.id === 23)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-orange-500";
    //         if (params.row.estado.id === 24)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-green-500";
    //         if (params.row.estado.id === 25)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-orange-500";
    //         if (params.row.estado.id === 26)
    //             clase =
    //                 "mb-0 inline-block px-3 py-1 rounded text-xs font-medium text-white bg-blue-500";

    //         return <p className={clase}>{params.row.estado.label}</p>;

    //     },
    // },

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
