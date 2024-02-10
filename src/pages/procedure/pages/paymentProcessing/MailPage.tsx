/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './mailPage.css';
import { MailType, MessageStatus, MessageTypeImbox } from '../../../../types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { listStatusMsg, listTypeMsg } from '../../../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Button, CardGenerateReport, Select } from '../../../../components';
import { CardMessage } from './components';
import { CardRegisterMessage } from './views';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useRole } from '../../../../hooks';

const InitTMail: MailType['type'] = 'RECEIVER';

export const MailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector((state: RootState) => state.userSession);
  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  // const [isResizing, setIsResizing] = useState(false);
  const [totalMail, setTotalMail] = useState(0);
  const [skip, setSkip] = useState(0);
  //-----------------------------QUERIES-----------------------------------
  const [typeMsg, setTypeMsg] = useState<MessageTypeImbox | null>(null);
  const [typeMail, setTypeMail] = useState<MailType['type'] | null>(InitTMail);
  const [statusMsg, setStatusMsg] = useState<MessageStatus | null>(null);
  //-----------------------------------------------------------------------
  const size = !!searchParams.get('size');
  const refresh = !!searchParams.get('refresh') || false;
  const [isNewMessage, setIsNewMessage] = useState(false);
  const { hasAccess: isMod } = useRole('MOD', null, 'tramite-de-pago');
  //-----------------------------------------------------------------------

  useEffect(() => getMessages(), [typeMail, typeMsg, statusMsg]);

  useEffect(() => {
    getMessages();
  }, [refresh]);

  const handleNewMessage = () => {
    setIsNewMessage(true);
  };
  const handleCloseMessage = () => {
    setIsNewMessage(false);
    setContentVisible(true);
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

  //--------------------------------------------------------------------------
  const [contentVisible, setContentVisible] = useState(true);

  return (
    <div className="mail-main ">
      <div className="mail-main-master-container">
        <div className="mail-messages-container">
          <div className={`message-container-header`}>
            <Button
              icon="refresh"
              className={`mail-main-update-btn`}
              onClick={getMessages}
            />
            <div className="message-options-filter">
              <div className="mail-main-options-container">
                <Button
                  icon="inbox"
                  text={(contentVisible && 'Bandeja de entrada') || undefined}
                  className={`mail-main-options-btn
                  ${typeMail === 'RECEIVER' && 'options-main-selected'} `}
                  onClick={handleSelectReceiver}
                />
                <Button
                  icon="tabler"
                  text={(contentVisible && 'Enviados') || undefined}
                  className={`mail-main-options-btn
                  ${typeMail === 'SENDER' && 'options-main-selected'} `}
                  onClick={handleSelectSender}
                />
                <Button
                  icon="archiver-box"
                  text={(contentVisible && 'Archivados') || undefined}
                  className={`mail-main-options-btn
                  ${!typeMail && 'options-main-selected'}`}
                  onClick={handleArchived}
                />
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
                className="mail-new-message-btn"
              />
            </div>
            <div
              className={`message-container-header-titles status-mail-header-${size} `}
            >
              <div className="message-header-item">
                <span>#DOCUMENTO</span>
              </div>
              <div className="message-header-item">
                <span>{`${
                  typeMail === 'RECEIVER' ? 'REMITENTE' : 'DESTINATARIO'
                }`}</span>
              </div>
              <div className="message-header-item mail-grid-col-2">
                <span>ASUNTO</span>
              </div>
              {contentVisible && (
                <>
                  <div className="message-header-item">
                    <span>ESTADO</span>
                  </div>
                  <div className="message-header-item">
                    <span>DEPENDENCIA</span>
                  </div>
                  <div className="message-header-item">
                    <span>FECHA DE ENVÍO</span>
                  </div>
                  {isMod && (
                    <div className="message-header-item message-cursor-none">
                      <span>ARCHIVAR</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mail-grid-container">
            {listMessage &&
              listMessage.map(({ paymessage, paymessageId, type }) => (
                <CardMessage
                  user={user}
                  isActive={!contentVisible}
                  key={paymessageId}
                  type={type}
                  onArchiver={handleSaveMessage}
                  onClick={() => handleViewMessage(paymessageId, type)}
                  message={paymessage}
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
      </div>
      <Outlet />
      <CardGenerateReport />
      {isNewMessage && (
        <CardRegisterMessage
          onClosing={handleCloseMessage}
          onSave={handleSaveMessage}
        />
      )}
    </div>
  );
};
