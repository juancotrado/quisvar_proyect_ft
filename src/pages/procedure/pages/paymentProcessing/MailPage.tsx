import { ChangeEvent, useEffect, useState } from 'react';
import './mailPage.css';
import {
  MailType,
  MessageSender,
  MessageType,
  PaginationTable,
  PayMailNumeration,
} from '../../../../types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import {
  SnackbarUtilities,
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
  LoaderForComponent,
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
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const InitTMail: MailType['type'] = 'RECEIVER';

const InitPaginationValue = { offset: '0', limit: '30' };

export const MailPage = () => {
  const navigate = useNavigate();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');

  const [searchParams, setSearchParams] = useSearchParams({
    type: InitTMail,
    ...InitPaginationValue,
  });
  const { offices } = useSelector((state: RootState) => state.userSession);

  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  const [selectData, setSelectData] = useState<MessageType[] | null>(null);
  const [totalMail, setTotalMail] = useState(0);

  const { isAccessReception } = useSelector(
    (state: RootState) => state.userSession
  );

  //-----------------------------QUERIES-----------------------------------
  const [typeMail, setTypeMail] = useState<MessageSender>(InitTMail);

  //-----------------------------------------------------------------------
  const refresh = searchParams.get('refresh');
  const [isNewMessage, setIsNewMessage] = useState(false);
  //-----------------------------------------------------------------------

  useEffect(() => {
    if (refresh) {
      getMessagesByQuery();
    }
  }, [refresh]);

  const handleNewMessage = () => {
    setIsNewMessage(true);
  };
  const handleCloseMessage = () => {
    setIsNewMessage(false);
  };
  const handleSaveMessage = () => {
    getMessagesByQuery();
    handleCloseMessage();
  };
  const getMessagesByQuery = async (
    queryParam: string = searchParams.toString()
  ) => {
    const query = `/paymail?${queryParam}`;
    const res = await axiosInstance.get<PayMailNumeration>(query, {
      headers: {
        noLoader: true,
      },
    });
    const { mailList, total } = res.data;
    setListMessage(mailList);
    setTotalMail(total);
  };
  const dataQuery = useQuery({
    queryKey: ['payListMessage'],
    queryFn: getMessagesByQuery,
    placeholderData: keepPreviousData,
  });

  const getMessagesPagination = async ({
    pageIndex,
    pageSize,
  }: PaginationTable) => {
    searchParams.set('offset', String(pageIndex));
    searchParams.set('limit', String(pageSize));
    setSearchParams(searchParams);
    await getMessagesByQuery(searchParams.toString());
  };

  const handleViewMessage = (id: number) => {
    setIsNewMessage(false);

    navigate(`${id}?${searchParams}`);
  };

  const handleSelectOption = (option: MessageSender) => {
    const keyParam = option === 'ARCHIVER' ? 'status' : 'type';
    const value = option === 'ARCHIVER' ? 'ARCHIVADO' : option;
    const { limit, offset } = InitPaginationValue;
    setSearchParams({
      ...InitPaginationValue,
      [keyParam]: value,
    });
    const query = `${keyParam}=${value}&offset=${offset}&limit=${limit}`;
    setTypeMail(option);

    if (option === 'RECEPTION') return;
    setListMessage(null);
    getMessagesByQuery(query);
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
      isActive: typeMail === 'ARCHIVER',
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
      cell: ({ getValue }) => <LabelStatus status={getValue()} />,
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

  const handleFilter = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = target;
    value ? searchParams.set(name, value) : searchParams.delete(name);
    setSearchParams(searchParams);
    if (typeMail === 'RECEPTION') return;
    getMessagesByQuery(searchParams.toString());
  };

  const handleArchive = () => {
    if (!selectData) return;
    const ids = selectData.map(el => el.id);
    const body = { ids };
    axiosInstance.patch(`paymail/archived/list`, body).then(() => {
      SnackbarUtilities.success('Tramite archivado.');
      getMessagesByQuery();
    });
  };

  console.log('listMessage', listMessage);
  return (
    <>
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
              {typeMail !== 'ARCHIVER' && (
                <Select
                  value={searchParams.get('status') ?? ''}
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
                value={searchParams.get('typeMessage') ?? ''}
                styleVariant="tertiary"
                placeholder="Documento"
                data={listTypeMsg}
                onChange={handleFilter}
                name="typeMessage"
                extractValue={({ id }) => id}
                renderTextField={({ id }) => id}
              />

              <Select
                value={searchParams.get('office') ?? ''}
                styleVariant="tertiary"
                placeholder="Oficina"
                data={offices}
                onChange={handleFilter}
                name="office"
                extractValue={({ officeId }) => officeId}
                renderTextField={({ office }) => office.name}
              />
              {typeMail === 'RECEPTION' && (
                <Select
                  value={searchParams.get('onHolding') ?? ''}
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
                onClick={getMessagesByQuery}
                size={4}
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
          listMessage ? (
            <>
              {selectData && selectData?.length > 0 && (
                <span
                  style={{
                    fontWeight: '700',
                    fontSize: '0.6rem',
                    cursor: 'pointer',
                  }}
                  onClick={handleArchive}
                >
                  Archivar
                </span>
              )}
              <TableMail
                key={typeMail}
                data={listMessage.map(({ paymessage }) => paymessage)}
                columns={columns}
                total={totalMail}
                rowSelectionData={
                  typeMail === 'ARCHIVER' ? null : setSelectData
                }
                fetchData={getMessagesPagination}
              />
            </>
          ) : (
            <LoaderForComponent />
          )
        ) : (
          <ReceptionView
            setSearchParams={setSearchParams}
            type="payProcedure"
            searchParams={searchParams}
            onSave={() => handleSelectOption(typeMail)}
          />
        )}
      </div>
      <Outlet />
      <CardGenerateReport />
      {isNewMessage && (
        <CardRegisterMessage
          onClosing={handleCloseMessage}
          onSave={handleSaveMessage}
        />
      )}
    </>
  );
};
