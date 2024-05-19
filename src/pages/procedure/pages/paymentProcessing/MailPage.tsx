import { ChangeEvent, useEffect, useState } from 'react';
import './mailPage.css';
import {
  MailType,
  MessageSender,
  MessageStatus,
  MessageType,
  MessageTypeImbox,
} from '../../../../types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { holdingOptions, listStatusMsg, listTypeMsg } from '../../../../utils';
import {
  Button,
  CardGenerateReport,
  HeaderOptionBtn,
  IconAction,
  Select,
} from '../../../../components';
import { CardRegisterMessage } from './views';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useRole } from '../../../../hooks';
import { MessageFunction, Reception } from '../../models';
import { ReceptionView } from '../../views/reception';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { TableMail } from '../../components/tableMail';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDateTimeUtc } from '../../../../utils/dayjsSpanish';

const InitTMail: MailType['type'] = 'RECEIVER';

export const MailPage = () => {
  const navigate = useNavigate();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');

  const [searchParams, setSearchParams] = useSearchParams({ type: InitTMail });
  const { offices } = useSelector((state: RootState) => state.userSession);
  const [listReception, setListReception] = useState<Reception[] | null>(null);

  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  const [totalMail, setTotalMail] = useState(0);
  const [skip, setSkip] = useState(0);

  const { isAccessReception } = useSelector(
    (state: RootState) => state.userSession
  );

  //-----------------------------QUERIES-----------------------------------
  const [typeMail, setTypeMail] = useState<MessageSender>(InitTMail);
  const [officeMsg, setOfficeMsg] = useState<string | null>(null);
  const [holdingReception, setHoldingReception] = useState<'yes' | 'no'>('yes');

  //-----------------------------------------------------------------------
  const refresh = searchParams.get('refresh');
  const [isNewMessage, setIsNewMessage] = useState(false);
  //-----------------------------------------------------------------------

  useEffect(() => {
    getMessagesByQuery();
  }, [refresh]);

  const handleNewMessage = () => {
    setIsNewMessage(true);
  };
  const handleCloseMessage = () => {
    setIsNewMessage(false);
  };
  const handleSaveMessage = () => {
    getMessagesByQuery();
    setIsNewMessage(false);
  };
  const getMessagesByQuery = (queryParam: string = searchParams.toString()) => {
    const query = `/paymail?${queryParam}`;
    axiosInstance.get(query).then(res => {
      setListMessage(res.data.mail);
      setTotalMail(res.data.total);
    });
  };
  // const getMessages = ({
  //   typeMail,
  //   statusMsg,
  //   typeMsg,
  //   officeMsg,
  //   holdingReception,
  //   skip,
  // }: MessageFunction) => {
  //   const type = typeMail && typeMail !== 'ARCHIVER' ? `&type=${typeMail}` : '';
  //   const status = (statusMsg && `&status=${statusMsg}`) || '';
  //   const typeMessage = (typeMsg && `&typeMessage=${typeMsg}`) || '';
  //   const offset = skip ? `&skip=${skip}` : '';

  //   const officeId = officeMsg ? `&officeId=${officeMsg}` : '';
  //   if (typeMail === 'RECEPTION') {
  //     const onHolding = holdingReception
  //       ? `&onHolding=${holdingReception === 'yes'}`
  //       : '';
  //     axiosInstance
  //       .get<Reception[]>(
  //         `/paymail/holding?${officeId}${status}${typeMessage}${onHolding}`
  //       )
  //       .then(({ data }) => {
  //         setListReception(data);
  //       });
  //     return;
  //   }
  //   const query = `/paymail?${type}${status}${typeMessage}${offset}${officeId}`;
  //   axiosInstance.get(query).then(res => {
  //     setListMessage(res.data.mail);
  //     setTotalMail(res.data.total);
  //   });
  // };

  const handleViewMessage = (id: number) => {
    setIsNewMessage(false);

    navigate(`${id}?${searchParams}`);
  };
  const handleNextPage = () => {
    const total = Math.floor(totalMail / 20);
    const limit = Math.ceil(skip / 20);
    if (limit < total) setSkip(skip === 0 ? skip + 21 : skip + 20);
  };
  const handlePreviusPage = () => {
    const limit = Math.floor(skip / 20);
    if (0 < limit) setSkip(skip === 21 ? skip - 21 : skip - 20);
  };
  const handleSelectOption = (option: MessageSender) => {
    const keyParam = option === 'ARCHIVER' ? 'status' : 'type';
    const value = option === 'ARCHIVER' ? 'ARCHIVADO' : option;
    setSearchParams({
      [keyParam]: value,
    });
    const query = `${keyParam}=${value}`;
    getMessagesByQuery(query);
    setTypeMail(option);

    // setTypeMail(option);
    // setTypeMsg(null);
    // setStatusMsg(null);
    // setOfficeMsg(null);
    // setHoldingReception('yes');
    // if (option === 'ARCHIVER') {
    //   setStatusMsg('ARCHIVADO');
    //   getMessages({ statusMsg: 'ARCHIVADO' });
    //   return;
    // }
    // getMessages({ typeMail: option });
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
    getMessagesByQuery(searchParams.toString());
    // if (name === 'status') {
    //   const statusMsg = value as MessageStatus;
    //   setStatusMsg(statusMsg);
    //   getMessages({
    //     statusMsg,
    //     typeMail,
    //     officeMsg,
    //     typeMsg,
    //     holdingReception,
    //   });
    // }
    // if (name === 'type') {
    //   const typeMsg = value as MessageTypeImbox;
    //   setTypeMsg(typeMsg);
    //   getMessages({
    //     typeMsg,
    //     typeMail,
    //     statusMsg,
    //     officeMsg,
    //     holdingReception,
    //   });
    // }
    // if (name === 'office') {
    //   const officeMsg = value;
    //   setOfficeMsg(value);
    //   getMessages({
    //     typeMsg,
    //     typeMail,
    //     statusMsg,
    //     officeMsg,
    //     holdingReception,
    //   });
    // }

    // if (name === 'condition') {
    //   const holdingReception = value as 'yes' | 'no';
    //   setHoldingReception(holdingReception);
    //   getMessages({
    //     typeMsg,
    //     typeMail,
    //     statusMsg,
    //     officeMsg,
    //     holdingReception,
    //   });
    // }
  };
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
                  styleVariant="secondary"
                />
              )}
              <Select
                value={searchParams.get('typeMessage') ?? ''}
                styleVariant="secondary"
                placeholder="Documento"
                data={listTypeMsg}
                onChange={handleFilter}
                name="typeMessage"
                extractValue={({ id }) => id}
                renderTextField={({ id }) => id}
              />

              <Select
                style={{ width: '11rem' }}
                value={searchParams.get('office') ?? ''}
                styleVariant="secondary"
                placeholder="Oficina"
                data={offices}
                onChange={handleFilter}
                name="office"
                extractValue={({ officeId }) => officeId}
                renderTextField={({ office }) => office.name}
              />
              {typeMail === 'RECEPTION' && (
                <Select
                  value={searchParams.get('condition') ?? ''}
                  styleVariant="secondary"
                  placeholder="Condición"
                  data={holdingOptions}
                  onChange={handleFilter}
                  name="condition"
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
        <div className="mail-grid-container">
          {typeMail !== 'RECEPTION'
            ? listMessage && (
                <TableMail
                  data={listMessage.map(({ paymessage }) => paymessage)}
                  columns={columns}
                  rowDataSelection={data =>
                    console.log('esta es mi data', data)
                  }
                />
              )
            : listReception && (
                <ReceptionView
                  type="payProcedure"
                  onSave={() => handleSelectOption(typeMail)}
                  listReception={listReception}
                />
              )}
        </div>
        <div className="mail-footer-section">
          <Button
            className="mail-previus-btn-pagination"
            icon="down"
            onClick={handlePreviusPage}
          />
          <span className="mail-pagination-title">
            {skip === 0 && totalMail !== 0 ? 1 : skip}
            {`-${skip + totalMail < 20 ? totalMail : 20}`} de {totalMail}
          </span>
          <Button
            className="mail-next-btn-pagination"
            icon="down"
            onClick={handleNextPage}
          />
        </div>
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
