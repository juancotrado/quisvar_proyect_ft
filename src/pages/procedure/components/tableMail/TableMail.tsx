import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MessageType } from '../../../../types';
import { formatDateTimeUtc } from '../../../../utils/dayjsSpanish';
import './tableMail.css';
import { axiosInstance } from '../../../../services/axiosInstance';
import { IconAction } from '../../../../components';
import { HTMLProps, useEffect, useRef } from 'react';
interface tableMailProps {
  data: MessageType[];
  onArchiver?: () => void;
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
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}

const tableMail = ({ data, onArchiver }: tableMailProps) => {
  const columnHelper = createColumnHelper<MessageType>();

  const handleArchiverAction = (id: number) => {
    axiosInstance.patch(`/paymail/archived/${id}`).then(onArchiver);
  };

  const columns = [
    columnHelper.accessor('id', {
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('title', {
      header: () => 'Documento',
    }),
    columnHelper.accessor(
      ({ users }) => users.find(user => user.type === 'SENDER')?.user,
      {
        id: 'lastName',
        cell: ({ getValue }) =>
          getValue()?.profile
            ? getValue()?.profile.firstName + ' ' + getValue()?.profile.lastName
            : '',
        header: () => 'Remitente',
      }
    ),
    columnHelper.accessor('header', {
      header: () => 'Asunto',
    }),
    columnHelper.accessor('status', {
      header: () => 'Estado',
      cell: info => (
        <span className={` tableMail-status status-${info.getValue()}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor(({ userInit }) => userInit.user, {
      header: 'Tramitante',
      cell: ({ getValue }) =>
        getValue()?.profile.firstName + ' ' + getValue()?.profile.lastName,
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Fecha de envio',
      cell: ({ getValue }) => formatDateTimeUtc(getValue()),
    }),
    columnHelper.accessor('id', {
      header: 'Archivar',
      cell: ({ getValue }) => (
        <i
          onClick={() => handleArchiverAction(getValue())}
          className="tableMail-archiver"
        >
          <IconAction icon="archiver-action" position="none" />
          Archivar
        </i>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
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
          <tr
            key={row.id}
            className="tableMail-body-row"
            onClick={() => {
              console.log(row.original.id);
            }}
          >
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
};

export default tableMail;
