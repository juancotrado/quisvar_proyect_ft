import { useState } from 'react';
import './mailPage.css';
import { MessageType } from '../../../../types';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  SnackbarUtilities,
  getFullName,
  holdingOptions,
  listStatusMsg,
  listTypeMsg,
} from '../../../../utils';
import {
  Button,
  CardGenerateReport,
  HeaderOptionBtn,
  IconAction,
  IndeterminateCheckbox,
  Select,
} from '../../../../components';
import { CardRegisterMessage } from './views';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useRole } from '../../../../hooks';
import { ReceptionView } from '../../views/reception';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { TableMail } from '../../components/tableMail';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDateTimeUtc } from '../../../../utils/dayjsSpanish';
import { LabelStatus } from '../../components';
import { usePayMail } from './hooks';
import { Reception } from '../../models';
import { TYPE_STATUS } from './models';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export const MailPage = () => {
  const navigate = useNavigate();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');
  const { paymessageId } = useParams();
  const [searchParams] = useSearchParams();
  const { offices } = useSelector((state: RootState) => state.userSession);

  const [selectData, setSelectData] = useState<MessageType[] | null>(null);

  const { isAccessReception } = useSelector(
    (state: RootState) => state.userSession
  );

  const [isNewMessage, setIsNewMessage] = useState(false);
  //-----------------------------------------------------------------------
  const {
    payMailQuery,
    handleSelectOption,
    typeMail,
    getMessagesPagination,
    handleFilter,
    office,
    onHolding,
    status,
    typeMessage,
  } = usePayMail();

  const handleNewMessage = () => {
    setIsNewMessage(true);
  };
  const handleCloseMessage = () => {
    setIsNewMessage(false);
  };
  const handleSaveMessage = () => {
    payMailQuery.refetch();
    handleCloseMessage();
  };

  const handleViewMessage = (id: number) => {
    setIsNewMessage(false);
    navigate(`${id}?${searchParams}`);
  };

  const optionsMailHeader = [
    {
      iconOn: 'inbox',
      iconOff: 'inbox-black',
      text: 'RECIBIDOS',
      isActive: typeMail === 'RECEIVER',
      funcion: () => handleSelectOption('RECEIVER'),
    },
    {
      iconOn: 'tabler',
      iconOff: 'tabler-black',
      text: 'ENVIADOS',
      isActive: typeMail === 'SENDER',
      funcion: () => handleSelectOption('SENDER'),
    },
    {
      iconOn: 'archive-regular',
      iconOff: 'archiver-box-black',
      text: 'ARCHIVADOS',
      isActive: status === 'ARCHIVADO',
      funcion: () => handleSelectOption('ARCHIVER'),
    },
    {
      iconOn: 'desk-filled',
      iconOff: 'desk-regular',
      text: 'MESA DE PARTES',
      isActive: typeMail === 'RECEPTION',
      funcion: () => handleSelectOption('RECEPTION'),
    },
  ];

  const columnHelper = createColumnHelper<MessageType>();
  const columns = [
    ...(hasAccess
      ? [
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
        ]
      : []),
    columnHelper.accessor('title', {
      header: () => 'Documento',
    }),
    ...(typeMail !== 'SENDER'
      ? [
          columnHelper.accessor(
            ({ users }) => users.find(user => user.type === 'SENDER')?.user,
            {
              id: 'sender',
              cell: ({ getValue, row: { original } }) =>
                original.office?.name || getFullName(getValue()),
              header: () => 'Remitente',
              enableHiding: true,
            }
          ),
        ]
      : []),
    ...(typeMail !== 'RECEIVER'
      ? [
          columnHelper.accessor(
            ({ users }) => users.find(user => user.type === 'RECEIVER')?.user,
            {
              id: 'receiver',
              cell: ({ getValue, row: { original } }) =>
                original.office?.name || getFullName(getValue()),
              header: () => 'Destinatario',
            }
          ),
        ]
      : []),
    columnHelper.accessor('header', {
      header: () => 'Asunto',
    }),
    columnHelper.accessor('status', {
      header: () => 'Estado',
      cell: ({ getValue, row: { original } }) => (
        <LabelStatus
          status={original.onHolding ? 'EN_ESPERA' : TYPE_STATUS[getValue()]}
        />
      ),
    }),
    columnHelper.accessor(({ userInit }) => userInit.user, {
      header: 'Tramitante',
      cell: ({ getValue }) => getFullName(getValue()),
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

  const handleArchive = () => {
    if (!selectData) return;
    const ids = selectData.map(el => el.id);
    const body = { ids };
    axiosInstance.patch(`paymail/archived/list`, body).then(() => {
      SnackbarUtilities.success('Tramite archivado.');
      payMailQuery.refetch();
    });
  };

  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={isNewMessage ? 70 : 100} order={1}>
          <div className="mail-main-master-container">
            <div className={`message-container-header`}>
              <div className="message-options-filter">
                <div className="message-header-option">
                  {optionsMailHeader
                    .slice(0, isAccessReception ? 4 : 3)
                    .map(({ funcion, iconOff, iconOn, text, isActive }) => (
                      <HeaderOptionBtn
                        key={text}
                        iconOff={iconOff}
                        iconOn={iconOn}
                        text={text}
                        isActive={isActive}
                        onClick={funcion}
                        width={10}
                      />
                    ))}
                </div>
                <div className="mail-main-options-container">
                  <span className="mail-main-options-title-filter">
                    <img
                      className="mail-mail-options-title-filter-img"
                      src="/svg/filter.svg"
                    />
                    Filtrar
                  </span>
                  {status !== 'ARCHIVADO' && (
                    <Select
                      value={status}
                      data={listStatusMsg}
                      placeholder="Estado"
                      onChange={handleFilter}
                      name="status"
                      extractValue={({ id }) => id}
                      renderTextField={({ label }) => label}
                      styleVariant="tertiary"
                    />
                  )}
                  <Select
                    value={typeMessage}
                    styleVariant="tertiary"
                    placeholder="Documento"
                    data={listTypeMsg}
                    onChange={handleFilter}
                    name="typeMessage"
                    extractValue={({ id }) => id}
                    renderTextField={({ id }) => id}
                  />

                  <Select
                    value={office}
                    styleVariant="tertiary"
                    placeholder="Oficina"
                    data={offices}
                    onChange={handleFilter}
                    name="officeId"
                    extractValue={({ officeId }) => officeId}
                    renderTextField={({ office }) => office.name}
                  />
                  {typeMail === 'RECEPTION' && (
                    <Select
                      value={onHolding}
                      styleVariant="tertiary"
                      placeholder="Condición"
                      data={holdingOptions}
                      onChange={handleFilter}
                      name="onHolding"
                      extractValue={({ id }) => id}
                      renderTextField={({ label }) => label}
                    />
                  )}
                  <IconAction
                    icon="refresh"
                    onClick={payMailQuery.refetch}
                    position="none"
                  />
                </div>
                <Button
                  onClick={handleNewMessage}
                  icon="plus-dark"
                  text="Nuevo Trámite"
                  styleButton={3}
                />
              </div>
            </div>
            {typeMail !== 'RECEPTION' ? (
              <>
                <div className="mail-options">
                  {selectData && selectData?.length > 0 && (
                    <IconAction
                      icon="bx_cabinet"
                      text="Archivar"
                      onClick={handleArchive}
                    />
                  )}
                </div>
                <TableMail
                  key={typeMail}
                  data={payMailQuery.data?.listMessage as MessageType[]}
                  total={payMailQuery.data?.total}
                  columns={columns}
                  rowSelectionData={
                    typeMail === 'ARCHIVER' ? null : setSelectData
                  }
                  getPagination={getMessagesPagination}
                  isLoading={payMailQuery.isFetching}
                />
              </>
            ) : (
              <ReceptionView
                type="payProcedure"
                totalMail={payMailQuery.data?.total}
                searchParams={searchParams}
                onSave={payMailQuery.refetch}
                receptionMail={payMailQuery.data?.listMessage as Reception[]}
                getMessagesPagination={getMessagesPagination}
                isLoading={payMailQuery.isFetching}
              />
            )}
          </div>
        </Panel>
        <PanelResizeHandle className="resizable" />
        {!isNewMessage && paymessageId && (
          <Panel defaultSize={30} order={2}>
            <Outlet />
          </Panel>
        )}
        {isNewMessage && (
          <Panel defaultSize={30} order={2}>
            <CardRegisterMessage
              onClosing={handleCloseMessage}
              onSave={handleSaveMessage}
            />
          </Panel>
        )}
      </PanelGroup>
      <CardGenerateReport />
    </>
  );
};
