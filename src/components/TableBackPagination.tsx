import { DataGrid, esES, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState, ChangeEvent } from "react";

interface DataType {
  rows: any[];
  columns: GridColDef[];
  filter?: any;
}

interface TableBackPaginationProps {
  paginationMode?: "client" | "server";
  rowCount?: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  data: DataType;
  rowClick?: (params: GridRowParams) => void;
  loading?: boolean;
  render?: () => React.ReactNode;
  getRowClassName?: (params: GridRowParams) => string;
  search?: boolean;
  height?: number;
  msAutoSerach?: boolean;
  onSelectionModelChange?: (selectionModel: any) => void;
}

const TableBackPagination = ({
  paginationMode = "client",
  rowCount = 0,
  page,
  setPage,
  pageSize,
  data,
  rowClick,
  loading = false,
  render,
  getRowClassName,
  search = false,
  height = 400,
  msAutoSerach = true,
  onSelectionModelChange,
}: TableBackPaginationProps) => {
  const { rows, columns } = data;

  const [state, setState] = useState<string>("");

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };

  return (
    <>
      {search && (
        <div className="mb-1 d-flex flex-row float-start">
          {render && render()}

          <div
            className={`d-flex flex-row p-2 ${
              msAutoSerach ? "ms-auto" : ""
            }`}
          >
            <input
              id="search"
              type="search"
              className="form-control"
              value={state}
              placeholder="Buscar..."
              onChange={changeValue}
            />
          </div>
        </div>
      )}

      <div style={{ height, width: "100%" }} className="d-flex">
        <DataGrid
          rowCount={rowCount}
          pagination
          paginationMode={paginationMode}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => setPage(model.page)}
          onRowClick={rowClick ?? (() => {})}
          rows={rows}
          columns={columns}
          pageSizeOptions={[pageSize]}
          loading={loading}
          disableRowSelectionOnClick
          density="compact"
          disableColumnMenu
          hideFooterSelectedRowCount
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          keepNonExistentRowsSelected
          checkboxSelection={!!onSelectionModelChange}
          onRowSelectionModelChange={
            onSelectionModelChange ?? (() => {})
          }
          getRowClassName={getRowClassName ?? (() => "")}
        />
      </div>
    </>
  );
};

export default TableBackPagination;