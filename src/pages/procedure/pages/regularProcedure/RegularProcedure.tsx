import './regularProcedure.css';
import {
  Button,
  FloatingText,
  HeaderOptionBtn,
  IconAction,
  IndeterminateCheckbox,
  Select,
} from '../../../../components';
import { CardRegisterProcedureGeneral } from '../../views';
import { LabelStatus } from '../../components';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useState } from 'react';
import { useRole } from '../../../../hooks';
import { ReceptionView } from '../../views/reception';
import { OptionsMailHeader, Reception } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import {
  SnackbarUtilities,
  getFullName,
  holdingOptions,
  listStatusMsg,
  listTypeMsg,
} from '../../../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useRegularMail } from './hooks';
import { TableMail } from '../../components/tableMail';
import { createColumnHelper } from '@tanstack/react-table';
import { MessageType } from '../../../../types';
import { formatDateTimeUtc } from '../../../../utils/dayjsSpanish';
import { TYPE_STATUS_REGULAR_PROCEDURE } from '../paymentProcessing/models';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const RegularProcedure = () => {
  const { offices } = useSelector((state: RootState) => state.userSession);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [searchParams] = useSearchParams();
  const { messageId } = useParams();

  const navigate = useNavigate();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-regular');

  const {
    status,
    handleFilter,
    typeMessage,
    getMessagesPagination,
    handleSelectOption,
    office,
    onHolding,
    regularMailQuery,
    typeMail,
  } = useRegularMail();

  const handleMessage = () => setIsNewMessage(!isNewMessage);

  const [selectData, setSelectData] = useState<MessageType[] | null>(null);

  // const { optionsMailHeader, typeMail } = useSelectReceiver();
  const optionsMailHeader: OptionsMailHeader[] = [
    {
      id: 1,
      iconOn: 'inbox',
      iconOff: 'inbox-black',
      text: 'RECIBIDOS',
      isActive: typeMail === 'RECEIVER',
      funcion: () => handleSelectOption('RECEIVER'),
    },
    {
      id: 2,
      iconOn: 'tabler',
      iconOff: 'tabler-black',
      text: 'ENVIADOS',
      isActive: typeMail === 'SENDER',
      funcion: () => handleSelectOption('SENDER'),
    },
    {
      id: 3,
      iconOn: 'archiver-box',
      iconOff: 'archiver-box-black',
      text: 'ARCHIVADOS',
      isActive: status === 'ARCHIVADO',
      funcion: () => handleSelectOption('ARCHIVER'),
    },
    {
      id: 4,
      iconOn: 'desk-filled',
      iconOff: 'desk-regular',
      text: 'MESA DE PARTES',
      isActive: typeMail === 'RECEPTION',
      funcion: () => handleSelectOption('RECEPTION'),
    },
  ];

  const handleSaveMessage = () => {
    regularMailQuery.refetch();
    handleMessage();
  };

  const handleArchive = () => {
    if (!selectData) return;
    const ids = selectData.map(el => el.id);
    const body = { ids };
    axiosInstance.patch(`mail/archived/list`, body).then(() => {
      SnackbarUtilities.success('Tramite archivado.');
      regularMailQuery.refetch();
    });
  };

  const handleViewMessage = (id: number) => {
    setIsNewMessage(false);
    navigate(`${id}?${searchParams}`);
  };

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
            ({ users }) =>
              users.find(user => user.type === 'SENDER' && user.role === 'MAIN')
                ?.user,
            {
              id: 'sender',
              cell: ({ getValue, row: { original } }) =>
                original.beforeOffice || getFullName(getValue()),
              header: () => 'Remitente',
            }
          ),
        ]
      : []),
    ...(typeMail !== 'RECEIVER'
      ? [
          columnHelper.accessor(
            ({ users }) =>
              users.find(
                user => user.type === 'RECEIVER' && user.role === 'MAIN'
              )?.user,
            {
              id: 'receiver',
              cell: ({ getValue, row: { original } }) =>
                original.office?.name || getFullName(getValue()),
              header: () => 'Dependencia actual',
            }
          ),
        ]
      : []),
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
    columnHelper.accessor(({ userInit }) => userInit?.user, {
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

  console.log('messageId', messageId);
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={isNewMessage || messageId ? 60 : 100} order={1}>
          <div className="mail-main-master-container">
            <div className={`message-container-header`}>
              <div className="message-options-filter">
                <div className="message-header-option">
                  {optionsMailHeader.map(
                    ({ funcion, id, iconOff, iconOn, text, isActive }) => (
                      <HeaderOptionBtn
                        key={id}
                        iconOff={iconOff}
                        iconOn={iconOn}
                        text={text}
                        isActive={isActive}
                        onClick={funcion}
                        width={10}
                      />
                    )
                  )}
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
                    onClick={regularMailQuery.refetch}
                    position="none"
                  />
                </div>
                <Button
                  onClick={handleMessage}
                  icon="plus-dark"
                  text="Nuevo Trámite"
                  color="lightPrimary"
                  textColor="secondary"
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
                  data={regularMailQuery.data?.listMessage as MessageType[]}
                  total={regularMailQuery.data?.total}
                  columns={columns}
                  rowSelectionData={
                    typeMail === 'ARCHIVER' ? null : setSelectData
                  }
                  getPagination={getMessagesPagination}
                  isLoading={regularMailQuery.isFetching}
                />
              </>
            ) : (
              <ReceptionView
                type="regularProcedure"
                totalMail={regularMailQuery.data?.total}
                searchParams={searchParams}
                onSave={regularMailQuery.refetch}
                receptionMail={
                  regularMailQuery.data?.listMessage as Reception[]
                }
                getMessagesPagination={getMessagesPagination}
                isLoading={regularMailQuery.isFetching}
              />
            )}
          </div>
        </Panel>
        <PanelResizeHandle className="resizable" />
        {!isNewMessage && messageId && (
          <Panel defaultSize={40} order={2}>
            <Outlet />
          </Panel>
        )}

        {isNewMessage && (
          <Panel defaultSize={40} order={2}>
            <CardRegisterProcedureGeneral
              onClosing={handleMessage}
              onSave={handleSaveMessage}
              type={'regularProcedure'}
            />
          </Panel>
        )}
      </PanelGroup>
    </>
  );
};

export default RegularProcedure;
