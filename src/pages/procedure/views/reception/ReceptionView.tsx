import './receptionView.css';
import { Reception, TypeProcedure } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SetURLSearchParams, useNavigate } from 'react-router-dom';
import { TYPE_PROCEDURE } from '../../pages/paymentProcessing/models';
import { SnackbarUtilities, getFullName } from '../../../../utils';
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  IconAction,
  IndeterminateCheckbox,
  LoaderForComponent,
} from '../../../../components';
import { formatDateTimeUtc } from '../../../../utils/dayjsSpanish';
import { TableMail } from '../../components/tableMail';
import { LabelStatus } from '../../components';
import {
  PaginationTable,
  PayMailNumeration,
  ReceptionMailNumeration,
} from '../../../../types';

interface ReceptionViewProps {
  // listReception: Reception[];
  setSearchParams: SetURLSearchParams;
  searchParams: URLSearchParams;
  type: TypeProcedure;
  onSave: () => void;
}
const ReceptionView = ({
  onSave,
  type,
  searchParams,
  setSearchParams,
}: ReceptionViewProps) => {
  const navigate = useNavigate();

  const [receptionMail, setReceptionMail] =
    useState<ReceptionMailNumeration | null>(null);
  const [selectData, setSelectData] = useState<Reception[] | null>(null);

  useEffect(() => {
    getReceptionMsgByQuery();
  }, [searchParams]);

  const getReceptionMsgByQuery = async (
    queryParam: string = searchParams.toString()
  ) => {
    const { data } = await axiosInstance.get<ReceptionMailNumeration>(
      `/paymail/holding?${queryParam}`,
      {
        headers: {
          noLoader: true,
        },
      }
    );
    setReceptionMail(data);
  };

  const getMessagesPagination = async ({
    pageIndex,
    pageSize,
  }: PaginationTable) => {
    searchParams.set('offset', String(pageIndex));
    searchParams.set('limit', String(pageSize));
    setSearchParams(searchParams);
    await getReceptionMsgByQuery(searchParams.toString());
  };

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
    ...(!(searchParams.get('onHolding') === 'false') ? columnPagination : []),
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
    }),
    columnHelper.accessor('status', {
      header: () => 'Estado',
      cell: ({ getValue }) => <LabelStatus status={getValue()} />,
    }),

    columnHelper.accessor('office', {
      header: 'Destinatario/Dependencia actual',
      cell: ({ getValue, row: { original } }) => {
        const userReceiver = original.users.find(
          user => user.type === 'RECEIVER'
        )?.user;
        return original.onHolding
          ? 'Mesa de Partes'
          : getValue()?.name || getFullName(userReceiver);
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
      {selectData && selectData.length > 0 && (
        <span
          style={{
            fontWeight: '700',
            fontSize: '0.6rem',
            cursor: 'pointer',
          }}
          onClick={handleApprove}
        >
          Aprobar
        </span>
      )}
      {receptionMail ? (
        <TableMail
          data={receptionMail.mailList}
          total={receptionMail.total}
          columns={columns}
          rowSelectionData={
            searchParams.get('onHolding') === 'false' ? null : setSelectData
          }
          fetchData={getMessagesPagination}
        />
      ) : (
        <LoaderForComponent />
      )}
    </>
  );
};

export default ReceptionView;
