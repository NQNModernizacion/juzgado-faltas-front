import { useEffect, useState } from 'react'

import {
  DataGrid,
  GridCallbackDetails as GCD,
  GridColDef,
  GridEventListener,
  GridRowClassNameParams as GCNP,
  GridRowSelectionModel as GRSM,
  esES,
  GridRowClassNameParams,
  GridRowHeightParams,
  GridRowHeightReturnValue,
} from '@mui/x-data-grid'

interface TableProps {
  data: {
    rows: any[]
    columns: GridColDef[]
  }
  onRowClick?: GridEventListener<'rowClick'> | undefined | null
  onCellClick?: GridEventListener<'cellClick'> | undefined
  loading?: boolean
  render?: () => JSX.Element
  getRowClassName?: ((params: GCNP<any>) => string) | undefined
  search?: boolean
  height?: string | number
  msAutoSerach?: boolean
  onRowSelectionModelChange?: ((rowSelectionModel: GRSM, details: GCD<any>) => void) | undefined
  onSelectionModelChange?: (params: any) => void
  disabledSearch?: boolean
  sx?: any
  getRowHeight?: (params: GridRowHeightParams) => GridRowHeightReturnValue
  trigger?: boolean
}

const Table: React.FC<TableProps> = ({
  data,
  onRowClick,
  onCellClick,
  loading,
  render,
  getRowClassName,
  search,
  height = 400,
  disabledSearch = false,
  onSelectionModelChange,
  sx = {},
  getRowHeight,
  trigger = true,
}) => {
  const { rows, columns } = data
  const [state, setState] = useState('')

  const arrayValue = state.toLowerCase().trim().split(' ')

  const newFilter = (arrayValue: string[], data: any[]) => {
    arrayValue = arrayValue.filter((elemento) => elemento !== '')

    while (arrayValue.length) {
      data = data.filter((el) => fiterByProperty(el, arrayValue))
      arrayValue.splice(0, 1)
    }

    return data
  }

  useEffect(() => {
    setState('')
  }, [trigger])

  const fiterByProperty = (el: any, a: any) => {
    for (const key in el) {
      if (el.hasOwnProperty!(key) && el[key]) {
        const attribute = el[key].toString().toLowerCase()
        if (attribute.includes(a[0])) return true
      }
    }
    return false
  }

  return (
    <>
      {search && (
        <div className="card mb-1 d-flex flex-row">
          {render && render()}
          <div className="d-flex flex-row p-2 ms-auto">
            <input
              id="search"
              type="search"
              className="form-control"
              disabled={disabledSearch}
              value={state}
              placeholder="Buscar..."
              onChange={(e: any) => setState(e.target.value)}
            />
          </div>
        </div>
      )}

      <div style={{ height, width: '100%', padding: 0 }} className="d-flex">
        <DataGrid
          onRowClick={onRowClick ? onRowClick : () => {}}
          rows={disabledSearch ? rows : newFilter(arrayValue, rows ? rows : [])}
          /* rows={rows.filter((el) => filter(el, state))} */
          columns={columns}
          loading={loading}
          density="compact"
          disableColumnMenu
          hideFooterSelectedRowCount
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          onCellClick={onCellClick ? onCellClick : () => {}}
          sx={{
            '.MuiDataGrid-cell': {
              padding: '0 5px',
            },
            // disable cell selection style
            '.MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row.oddRow': {
              background: '#F2F2F2',
            },
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
              background: `#a29f9f !important`,
              color: 'black !important',
            },
            /* "& .MuiDataGrid-cell": {
                            borderRight: "1px solid #ccc",
                        },
                        "& .MuiDataGrid-cell:last-child": {
                            borderRight: "none",
                        }, */
            ...sx,
          }}
          checkboxSelection={onSelectionModelChange ? true : false}
          onRowSelectionModelChange={onSelectionModelChange ? onSelectionModelChange : () => {}}
          getRowHeight={getRowHeight}
          getRowClassName={
            getRowClassName ? getRowClassName : (params: GridRowClassNameParams<any>) => (params.indexRelativeToCurrentPage % 2 ? '' : 'oddRow')
          }
        />
      </div>
    </>
  )
}

export default Table
// import { useEffect, useState } from 'react'
// import {
//   DataGrid,
//   GridCallbackDetails as GCD,
//   GridColDef,
//   GridEventListener,
//   GridRowClassNameParams as GCNP,
//   GridRowSelectionModel as GRSM,
//   esES,
//   GridRowClassNameParams,
//   GridRowHeightParams,
//   GridRowHeightReturnValue,
// } from '@mui/x-data-grid'

// interface TableProps {
//   data: { rows: any[]; columns: GridColDef[] }
//   onRowClick?: GridEventListener<'rowClick'> | undefined | null
//   onCellClick?: GridEventListener<'cellClick'> | undefined
//   loading?: boolean
//   render?: () => JSX.Element
//   getRowClassName?: ((params: GCNP<any>) => string) | undefined
//   search?: boolean
//   height?: string | number
//   onRowSelectionModelChange?: ((rowSelectionModel: GRSM, details: GCD<any>) => void) | undefined
//   onSelectionModelChange?: (params: any) => void
//   disabledSearch?: boolean
//   sx?: any
//   getRowHeight?: (params: GridRowHeightParams) => GridRowHeightReturnValue
//   trigger?: boolean
// }

// const Table: React.FC<TableProps> = ({
//   data,
//   onRowClick,
//   onCellClick,
//   loading,
//   render,
//   getRowClassName,
//   search,
//   height = 400,
//   disabledSearch = false,
//   onSelectionModelChange,
//   sx = {},
//   getRowHeight,
//   trigger = true,
// }) => {
//   const { rows, columns } = data
//   const [state, setState] = useState('')

//   const arrayValue = state.toLowerCase().trim().split(' ')

//   const newFilter = (arrayValue: string[], data: any[]) => {
//     arrayValue = arrayValue.filter((elemento) => elemento !== '')
//     while (arrayValue.length) {
//       data = data.filter((el) => fiterByProperty(el, arrayValue))
//       arrayValue.splice(0, 1)
//     }
//     return data
//   }

//   useEffect(() => setState(''), [trigger])

//   const fiterByProperty = (el: any, a: any) => {
//     for (const key in el) {
//       if (el.hasOwnProperty!(key) && el[key]) {
//         const attribute = el[key].toString().toLowerCase()
//         if (attribute.includes(a[0])) return true
//       }
//     }
//     return false
//   }

//   return (
//     <>
//       {search && (
//         <div className="mx-section mb-2">
//           <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex flex-wrap items-center gap-2">{render && render()}</div>

//             <div className="w-full sm:w-[280px]">
//               <input
//                 id="search"
//                 type="search"
//                 className={[
//                   'w-full rounded-lg border border-border bg-surface px-3 py-2',
//                   'text-text placeholder:text-muted',
//                   'focus:outline-none focus:ring-4 focus:ring-primary-600/15 focus:border-primary-600',
//                   disabledSearch ? 'opacity-60' : '',
//                 ].join(' ')}
//                 disabled={disabledSearch}
//                 value={state}
//                 placeholder="Buscar..."
//                 onChange={(e: any) => setState(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <div style={{ height, width: '100%' }}>
//         <DataGrid
//           onRowClick={onRowClick ? onRowClick : () => {}}
//           rows={disabledSearch ? rows : newFilter(arrayValue, rows ? rows : [])}
//           columns={columns}
//           loading={loading}
//           density="compact"
//           disableColumnMenu
//           hideFooterSelectedRowCount
//           localeText={esES.components.MuiDataGrid.defaultProps.localeText}
//           onCellClick={onCellClick ? onCellClick : () => {}}
//           sx={{
//             border: '1px solid rgb(var(--mx-border))',
//             borderRadius: '18px',

//             '& .MuiDataGrid-columnHeaders': {
//               backgroundColor: 'rgb(var(--mx-surface))',
//               color: 'rgb(var(--mx-text))',
//               borderBottom: '1px solid rgb(var(--mx-border))',
//             },

//             '& .MuiDataGrid-cell': {
//               padding: '0 8px',
//               color: 'rgb(var(--mx-text))',
//               borderBottom: '1px solid rgb(var(--mx-border))',
//             },

//             // disable cell selection outline
//             '& .MuiDataGrid-cell:focus': {
//               outline: 'none',
//             },

//             // zebra: suave y neutro
//             '& .MuiDataGrid-row.oddRow': {
//               backgroundColor: 'rgba(var(--mx-overlay), 0.03)',
//             },

//             // hover: suave y neutro
//             '& .MuiDataGrid-row:hover': {
//               cursor: 'pointer',
//               backgroundColor: 'rgba(var(--mx-overlay), 0.06)',
//             },

//             '& .MuiDataGrid-footerContainer': {
//               borderTop: '1px solid rgb(var(--mx-border))',
//               backgroundColor: 'rgb(var(--mx-surface))',
//             },

//             ...sx,
//           }}
//           checkboxSelection={!!onSelectionModelChange}
//           onRowSelectionModelChange={onSelectionModelChange ? onSelectionModelChange : () => {}}
//           getRowHeight={getRowHeight}
//           getRowClassName={
//             getRowClassName
//               ? getRowClassName
//               : (params: GridRowClassNameParams<any>) =>
//                   params.indexRelativeToCurrentPage % 2 ? '' : 'oddRow'
//           }
//         />
//       </div>
//     </>
//   )
// }

// export default Table
