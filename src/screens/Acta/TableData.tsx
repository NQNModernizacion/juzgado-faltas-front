
export const TableData = (data: any, nav: any) => {
    // console.log("data table", data);
    const columns = [
        {
            field: "id",
            headerName: "ID",
            minWidth: 1,
            flex: 0.5,
        },
        {
            field: "numero_acta",
            headerName: "Número de Acta",
            minWidth: 100,
            flex: 1.1,
        },
        {
            field: "oficina",
            headerName: "Oficina",
            minWidth: 50,
            flex: 1,
        },
        {
            field: "fecha_labrada",
            headerName: "Fecha Labrada",
            minWidth: 100,
            flex: 1,
        },
       
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
            field: "actions",
            headerName: "Acciones",
            minWidth: 20,
            flex: 1,
            renderCell: (params: any) => {
                const btn = (
                    <>
                        <div className="" >
                            <button
                                onClick={() => nav(`/titular/estado-solicitud/${params.row.id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow-sm transition"
                            >
                                Ver
                            </button>

                        </div>
                    </>
                );

                return btn;
            },
        },
    ];

    const rows = data.map((d: any) => {
        return {
            id: d.id,
            numero_acta: d.numero_acta,
            oficina: d.oficina,
            fecha_labrada: d.fecha_labrada,
            // fecha_labrada: d.created_at?.slice(0, 16),
            event: d.event,
        };
    });

    const filter = (d: any, value: any) => {
        value = value.toLowerCase();

        return (
            String(d.id)?.toString().toLowerCase().includes(value) ||
            String(d.numero_acta)?.toString().toLowerCase().includes(value) ||
            String(d.oficina)?.toString().toLowerCase().includes(value) ||
            String(d.fecha_labrada)?.toString().toLowerCase().includes(value) ||
            String(d.event)?.toString().toLowerCase().includes(value)
        );
    };

    return { columns, rows, filter };
};
