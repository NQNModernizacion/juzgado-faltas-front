import { GridColDef } from '@mui/x-data-grid'

export const dataTable = (data: any[] /* , d: DispachState */) => {
  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: () => {
        return <h2 className="m-0">H2</h2>
      },
    },
    { field: 'name', headerName: 'Name', flex: 0.5 },
    { field: 'label', headerName: 'label', flex: 0.5 },
  ]

  return { columns, rows: data }
}
import type { TableColumn } from "@nqnmodernizacion/muni-ui";

export const dataTableMx = (data: any[]) => {
  const columns: TableColumn<any>[] = [
    {
      id: "avatar",
      header: "",
      render: () => <h2 className="m-0">H2</h2>,
    },
    {
      id: "name",
      header: "Name",
      render: (row) => row.name,
    },
    {
      id: "label",
      header: "label",
      render: (row) => row.label,
    },
  ];

  return { columns, rows: data };
};
