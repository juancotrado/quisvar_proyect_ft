import { ChangeEvent, useEffect, useState } from 'react';
import './mailPage.css';
import {
  MailType,
  MessageSender,
  MessageStatus,
  MessageTypeImbox,
} from '../../../../types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { listStatusMsg, listTypeMsg } from '../../../../utils';
import {
  Button,
  CardGenerateReport,
  HeaderOptionBtn,
  IconAction,
  Select,
} from '../../../../components';
import { CardMessage } from './components';
import { CardRegisterMessage } from './views';
import { axiosInstance } from '../../../../services/axiosInstance';
import { CardMessageHeader } from '../../components';
import { useRole } from '../../../../hooks';
import { MessageFunction } from '../../models';
import { ReceptionView } from '../../views/reception';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';

const InitTMail: MailType['type'] = 'RECEIVER';

export const MailPage = () => {
  const navigate = useNavigate();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');

  const [searchParams] = useSearchParams();
  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  const [totalMail, setTotalMail] = useState(0);
  const [skip, setSkip] = useState(0);

  const { isAccessReception } = useSelector(
    (state: RootState) => state.userSession
  );

  //-----------------------------QUERIES-----------------------------------
  const [typeMail, setTypeMail] = useState<MessageSender>(InitTMail);
  const [typeMsg, setTypeMsg] = useState<MessageTypeImbox | null>(null);
  const [statusMsg, setStatusMsg] = useState<MessageStatus | null>(null);
  //-----------------------------------------------------------------------
  const refresh = !!searchParams.get('refresh') || false;
  const [isNewMessage, setIsNewMessage] = useState(false);
  //-----------------------------------------------------------------------

  useEffect(() => {
    getMessages({ typeMail });
  }, [refresh]);

  const handleNewMessage = () => {
    setIsNewMessage(true);
  };
  const handleCloseMessage = () => {
    setIsNewMessage(false);
  };
  const handleSaveMessage = () => {
    getMessages({ typeMail: typeMail || 'RECEIVER', statusMsg, typeMsg });
    setIsNewMessage(false);
  };
  const getMessages = ({
    typeMail,
    statusMsg,
    typeMsg,
    skip,
  }: MessageFunction) => {
    const type = (typeMail && `&type=${typeMail}`) || '';
    const status = (statusMsg && `&status=${statusMsg}`) || '';
    const typeMessage = (typeMsg && `&typeMessage=${typeMsg}`) || '';
    const offset = skip ? `&skip=${skip}` : '';
    const query = `/paymail?${type}${status}${typeMessage}${offset}`;
    axiosInstance.get(query).then(res => {
      setListMessage(res.data.mail);
      setTotalMail(res.data.total);
    });
  };

  const handleViewMessage = (id: number, type: MailType['type']) => {
    setIsNewMessage(false);
    navigate(`${id}?type=${type}`);
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
    setTypeMail(option);
    setTypeMsg(null);
    setStatusMsg(null);
    if (option === 'RECEPTION') return;
    if (option === 'ARCHIVER') return getMessages({ statusMsg: 'ARCHIVADO' });
    getMessages({ typeMail: option });
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

  const handleFilter = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = target;
    if (!value) return;
    if (name === 'status') {
      const statusMsg = value as MessageStatus;
      setStatusMsg(statusMsg);
      getMessages({
        statusMsg,
        typeMail,
        typeMsg,
      });
    }
    if (name === 'type') {
      const typeMsg = value as MessageTypeImbox;
      setTypeMsg(typeMsg);
      getMessages({
        typeMsg,
        typeMail,
        statusMsg,
      });
    }
  };
  return (
    <>
      <div className="mail-main-master-container">
        <div className={`message-container-header`}>
          <IconAction
            icon="refresh"
            onClick={() => getMessages({})}
            right={0.9}
            top={3.7}
          />
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
              <Select
                value={statusMsg || ''}
                data={listStatusMsg}
                placeholder="Estado"
                onChange={handleFilter}
                name="status"
                itemKey="id"
                textField="label"
                styleVariant="secondary"
              />
              <Select
                value={typeMsg || ''}
                styleVariant="secondary"
                placeholder="Documento"
                data={listTypeMsg}
                onChange={handleFilter}
                name="type"
                itemKey="id"
                textField="id"
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
          {typeMail !== 'RECEPTION' ? (
            <>
              <CardMessageHeader option="payProcedure" typeMail={typeMail} />
              {listMessage &&
                listMessage.map(({ paymessage, paymessageId, type }) => (
                  <CardMessage
                    isActive={false}
                    key={paymessageId}
                    type={type}
                    onArchiver={handleSaveMessage}
                    typeMail={typeMail}
                    onClick={() => handleViewMessage(paymessageId, type)}
                    message={paymessage}
                    option="payProcedure"
                    hasAccess={hasAccess}
                  />
                ))}
            </>
          ) : (
            <ReceptionView />
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
