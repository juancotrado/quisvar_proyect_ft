/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
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

const InitTMail: MailType['type'] = 'RECEIVER';

export const MailPage = () => {
  const navigate = useNavigate();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');

  const [searchParams] = useSearchParams();
  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  // const [isResizing, setIsResizing] = useState(false);
  const [totalMail, setTotalMail] = useState(0);
  const [skip, setSkip] = useState(0);
  //-----------------------------QUERIES-----------------------------------
  const [typeMsg, setTypeMsg] = useState<MessageTypeImbox | null>(null);
  const [typeMail, setTypeMail] = useState<MessageSender | null>(InitTMail);
  const [statusMsg, setStatusMsg] = useState<MessageStatus | null>(null);
  //-----------------------------------------------------------------------
  const refresh = !!searchParams.get('refresh') || false;
  const [isNewMessage, setIsNewMessage] = useState(false);
  //-----------------------------------------------------------------------

  useEffect(() => getMessages(), [typeMail, typeMsg, statusMsg, refresh]);

  const handleNewMessage = () => {
    setIsNewMessage(true);
  };
  const handleCloseMessage = () => {
    setIsNewMessage(false);
  };
  const handleSaveMessage = () => {
    getMessages();
    setIsNewMessage(false);
  };
  const getMessages = () => {
    const type = (typeMail && `&type=${typeMail}`) || '';
    const status = (statusMsg && `&status=${statusMsg}`) || '';
    const typeMessage = (typeMsg && `&typeMessage=${typeMsg}`) || '';
    const offset = `&skip=${skip}`;
    const query = `/paymail?${type}${status}${typeMessage}${offset}`;
    if (typeMail !== 'LICENSE') {
      axiosInstance.get(query).then(res => {
        setListMessage(res.data.mail);
        setTotalMail(res.data.total);
      });
    }
  };
  const handleSelectReceiver = () => {
    setTypeMail('RECEIVER');
    setStatusMsg(null);
    setTypeMsg(null);
  };
  const handleSelectSender = () => {
    setTypeMail('SENDER');
    setStatusMsg(null);
    setTypeMsg(null);
  };
  const handleArchived = () => {
    setTypeMail(null);
    setStatusMsg('ARCHIVADO');
    setTypeMsg(null);
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

  const optionsMailHeader = [
    {
      iconOn: 'inbox',
      iconOff: 'inbox-black',
      text: 'RECIBIDOS',
      isActive: typeMail === 'RECEIVER',
      funcion: handleSelectReceiver,
    },
    {
      iconOn: 'tabler',
      iconOff: 'tabler-black',
      text: 'ENVIADOS',
      isActive: typeMail === 'SENDER',
      funcion: handleSelectSender,
    },
    {
      iconOn: 'archiver-box',
      iconOff: 'archiver-box-black',
      text: 'ARCHIVADOS',
      isActive: !typeMail,
      funcion: handleArchived,
    },
  ];

  return (
    <>
      <div className="mail-main-master-container">
        <div className={`message-container-header`}>
          <IconAction
            icon="refresh"
            onClick={getMessages}
            right={0.9}
            top={3.7}
          />
          <div className="message-options-filter">
            <div className="message-header-option">
              {optionsMailHeader.map(
                ({ funcion, iconOff, iconOn, text, isActive }) => (
                  <HeaderOptionBtn
                    key={text}
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
              <Select
                data={listStatusMsg}
                className="mail-option-select"
                placeholder="Estado"
                onChange={({ target }) =>
                  target.value !== '0' &&
                  setStatusMsg(target.value as MessageStatus)
                }
                name="Status"
                itemKey="id"
                textField="id"
              />
              <Select
                className="mail-option-select"
                placeholder="Documento"
                data={listTypeMsg}
                onChange={({ target }) =>
                  target.value !== '0' &&
                  setTypeMsg(target.value as MessageTypeImbox)
                }
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
          <CardMessageHeader option="payProcedure" typeMail={typeMail} />
          {listMessage &&
            listMessage.map(({ paymessage, paymessageId, type }) => (
              <CardMessage
                isActive={false}
                key={paymessageId}
                type={type}
                onArchiver={handleSaveMessage}
                onClick={() => handleViewMessage(paymessageId, type)}
                message={paymessage}
                option="payProcedure"
                hasAccess={hasAccess}
              />
            ))}
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
