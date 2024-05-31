import './receptionView.css';
import { Reception, TypeProcedure } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  TYPE_PROCEDURE,
  TYPE_STATUS_REGULAR_PROCEDURE,
} from '../../pages/paymentProcessing/models';
import { SnackbarUtilities, getFullName } from '../../../../utils';
import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  FloatingText,
  IconAction,
  IndeterminateCheckbox,
} from '../../../../components';
import { formatDateTimeUtc } from '../../../../utils/dayjsSpanish';
import { TableMail } from '../../components/tableMail';
import { LabelStatus } from '../../components';
import { PaginationTable } from '../../../../types';

interface ReceptionViewProps {
  searchParams: URLSearchParams;
  type: TypeProcedure;
  onSave: () => void;
  receptionMail?: Reception[];
  totalMail?: number;
  getMessagesPagination?: (data: PaginationTable) => void;
  isLoading: boolean;
}
const ReceptionView = ({
  onSave,
  type,
  searchParams,
  receptionMail,
  totalMail,
  isLoading,
  getMessagesPagination,
}: ReceptionViewProps) => {
  const navigate = useNavigate();

  const [selectData, setSelectData] = useState<Reception[] | null>(null);

  const handleViewMessage = (id: number) => {
    navigate(`${id}?${searchParams}`, { state: { isReception: true } });
  };
  const columnHelper = createColumnHelper<Reception>();

  const columnPagination = [
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
          key={row.original.id}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
  ];

  const columns = [
    ...(!(searchParams.get('onHolding') === 'true') ? [] : columnPagination),
    columnHelper.accessor('title', {
      header: () => 'Documento',
    }),
    columnHelper.accessor(
      ({ users }) => users.find(user => user.type === 'SENDER')?.user,
      {
        header: 'Tramitante',
        cell: ({ getValue }) => getFullName(getValue()),
      }
    ),
    columnHelper.accessor('header', {
      header: () => 'Asunto',
      cell: ({ getValue }) => (
        <FloatingText text={getValue()} yPos={10}>
          <div className="text-ellipsis">{getValue()}</div>
        </FloatingText>
      ),
    }),
    columnHelper.accessor('status', {
      header: () => 'Estado',
      cell: ({ getValue, row: { original } }) => (
        <LabelStatus
          status={
            original.onHolding
              ? 'EN_ESPERA'
              : TYPE_STATUS_REGULAR_PROCEDURE[getValue()]
          }
        />
      ),
    }),

    columnHelper.accessor('office', {
      id: 'office-sender',
      header: 'Dependencia previa',
      cell: ({ row: { original } }) => {
        const userReceiver = original.users.find(
          user => user.type === 'SENDER'
        )?.user;
        return getFullName(userReceiver);
      },
    }),
    columnHelper.accessor('office', {
      id: 'office-receiver',
      header: 'Dependencia actual',
      cell: ({ getValue, row: { original } }) => {
        const userReceiver = original.users.find(
          user => user.type === 'RECEIVER'
        )?.user;
        return getValue()?.name || getFullName(userReceiver);
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Fecha de envio',
      cell: ({ getValue }) => formatDateTimeUtc(getValue()),
    }),
    columnHelper.accessor('id', {
      header: 'Visualizar',

      cell: ({ getValue }) => (
        <i
          onClick={() => handleViewMessage(getValue())}
          className="tableMail-archiver"
        >
          <IconAction icon="eye" position="none" />
          Ver
        </i>
      ),
    }),
  ];

  const handleApprove = () => {
    if (!selectData) return;
    const ids = selectData.map(el => el.id);
    const body = { ids };
    axiosInstance
      .put(`${TYPE_PROCEDURE[type].provied}/holding`, body)
      .then(() => {
        SnackbarUtilities.success('Tramite aprobado exitosamente');
        onSave();
      });
  };

  return (
    <>
      <div className="mail-options">
        {selectData && selectData.length > 0 && (
          <IconAction
            icon="check-black-blue"
            text="Aprobar"
            onClick={handleApprove}
          />
        )}
      </div>
      <TableMail
        data={receptionMail}
        total={totalMail}
        columns={columns}
        rowSelectionData={
          searchParams.get('onHolding') === 'true' ? setSelectData : null
        }
        getPagination={getMessagesPagination}
        isLoading={isLoading}
      />
    </>
  );
};

export default ReceptionView;
