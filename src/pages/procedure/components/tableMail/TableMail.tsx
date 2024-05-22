import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import './tableMail.css';
import { useEffect, useRef, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PaginationTable } from '../../../../types';
import { useSearchParams } from 'react-router-dom';
// interface FilterData<T> {
//   rows: T[];
//   pageCount: number;
//   rowCount: number;
// }
interface TableMailProps<T> {
  data: T[];
  total: number;
  columns: ColumnDef<T, any>[];
  rowSelectionData?: ((data: T[]) => void) | null;
  fetchData?: (pagination: PaginationTable) => void;
}

function tableMail<T>({
  data,
  columns,
  rowSelectionData,
  fetchData,
  total,
}: TableMailProps<T>) {
  const [searchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationTable>({
    pageIndex: +(searchParams.get('offset') ?? 0),
    pageSize: +(searchParams.get('limit') ?? 10),
  });

  const dataQuery = useQuery({
    queryKey: ['data', pagination],
    queryFn: () => fetchData?.(pagination),
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    data: data,
    columns,
    rowCount: total,
    state: {
      pagination,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });
  // const table = rowSelectionData
  //   ? useReactTable({
  //       data,
  //       columns: columnsTable,
  //       getCoreRowModel: getCoreRowModel(),
  //       state: {
  //         rowSelection,
  //       },
  //       enableRowSelection: true,
  //       onRowSelectionChange: setRowSelection,
  //     })
  //   : useReactTable({
  //       data,
  //       columns,
  //       getCoreRowModel: getCoreRowModel(),
  //     });

  useEffect(() => {
    if (!rowSelectionData) return;
    const dataSelection: T[] = table
      .getSelectedRowModel()
      .flatRows.map(({ original }) => original);
    rowSelectionData(dataSelection);
  }, [rowSelection]);

  console.log('table', table.getRowModel().rows);
  return (
    <>
      <div className="tableWrap">
        <table className="tableMail">
          <thead className="tableMail-header">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="tableMail-header-row">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="tableMail-header-item">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="tableMail-body-row">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="tableMail-body-item">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div className="tableMail-pagination-container">
          <div className="tableMail-pagination">
            <button
              className="tableMail-pagination-btn"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="tableMail-pagination-btn"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="tableMail-pagination-btn"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="tableMail-pagination-btn"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="tableMail-pagination-text">
              Pagina
              <strong>
                {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount().toLocaleString()}{' '}
              </strong>
            </span>
            <span>| </span>
            <span className="tableMail-pagination-text">
              Ir a la pagina:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onBlur={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="tableMail-pagination-input"
              />
            </span>
            <span>
              <strong>{dataQuery.isLoading && 'Cargando...'}</strong>
            </span>
          </div>
          <div className="tableMail-pagination-more-info">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="tableMail-pagination-select"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>

            <p>
              Ver {table.getRowModel().rows.length.toLocaleString()} de {total}{' '}
              filas
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default tableMail;
