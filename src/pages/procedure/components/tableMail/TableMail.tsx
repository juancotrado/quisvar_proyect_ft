import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import './tableMail.css';
import { HTMLProps, useEffect, useRef, useState } from 'react';
interface tableMailProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  rowDataSelection: (data: T[]) => void;
}
// {
//   "id": 95,
//   "header": "ya lo corregi mi king kong",
//   "status": "FINALIZADO",
//   "type": "MEMORANDUM",
//   "title": "MEMORANDUM N°6 DHYRIUM-JC-2024",
//   "createdAt": "2024-05-17T00:44:25.973Z",
//   "updatedAt": "2024-05-17T05:32:58.272Z",
//   "onHolding": false,
//   "historyOfficesIds": [],
//   "office": null,
//   "onHoldingDate": "2024-05-17T05:15:14.602Z",
//   "users": []
// }
function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + 'cursor-pointer'}
      {...rest}
    />
  );
}

function tableMail<T>({ data, columns, rowDataSelection }: tableMailProps<T>) {
  const [rowSelection, setRowSelection] = useState({});

  const columnHelper = createColumnHelper<T>();

  const columnsTable = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    ...columns,
  ];

  const table = useReactTable({
    data,
    columns: columnsTable,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    const dataSelection: T[] = table
      .getSelectedRowModel()
      .flatRows.map(({ original }) => original);
    rowDataSelection(dataSelection);
  }, [rowSelection]);

  return (
    <table className="tableMail">
      <thead>
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
  );
}

export default tableMail;
