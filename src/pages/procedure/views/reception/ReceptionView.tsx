import './receptionView.css';
import { Reception, TypeProcedure } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { TYPE_PROCEDURE } from '../../pages/paymentProcessing/models';
import { SnackbarUtilities, getFullName } from '../../../../utils';
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { IconAction } from '../../../../components';
import { formatDateTimeUtc } from '../../../../utils/dayjsSpanish';
import { TableMail } from '../../components/tableMail';

interface ReceptionViewProps {
  // listReception: Reception[];
  searchParams: URLSearchParams;
  type: TypeProcedure;
  onSave: () => void;
}
const ReceptionView = ({ onSave, type, searchParams }: ReceptionViewProps) => {
  const navigate = useNavigate();

  const [listReception, setListReception] = useState<Reception[] | null>(null);

  useEffect(() => {
    getReceptionMsgByQuery();
  }, [searchParams]);

  const getReceptionMsgByQuery = (
    queryParam: string = searchParams.toString()
  ) => {
    axiosInstance
      .get<Reception[]>(`/paymail/holding?${queryParam}`)
      .then(({ data }) => {
        setListReception(data);
      });
  };

  const columnHelper = createColumnHelper<Reception>();

  const columns = [
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
      cell: info => (
        <span className={` tableMail-status status-${info.getValue()}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor(
      ({ users }) => users.find(user => user.type === 'RECEIVER')?.user,
      {
        header: 'Destinatario',
        cell: ({ getValue }) => getFullName(getValue()),
      }
    ),
    columnHelper.accessor(
      ({ users }) => users.find(user => user.type === 'RECEIVER')?.user,
      {
        header: 'Dependencia actual',
        cell: ({ getValue }) => getFullName(getValue()),
      }
    ),
    columnHelper.accessor('updatedAt', {
      header: 'Fecha de envio',
      cell: ({ getValue }) => formatDateTimeUtc(getValue()),
    }),
    columnHelper.accessor('id', {
      header: 'Visualizar',

      cell: ({ row, getValue }) =>
        row.original.onHolding ? (
          <i
            onClick={() => handleApprove([getValue()])}
            className="tableMail-archiver"
          >
            <IconAction icon="eye" position="none" />
            Aprobar
          </i>
        ) : (
          'Aprobado'
        ),
    }),
  ];

  const handleViewMessage = (id: number) => {
    navigate(`${id}`, { state: { isReception: true } });
  };
  const handleApprove = (ids: number[]) => {
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
      {listReception && (
        <TableMail
          data={listReception}
          columns={columns}
          rowDataSelection={data => console.log('esta es mi data', data)}
        />
      )}
    </>
  );
};

export default ReceptionView;
