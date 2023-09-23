/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './mailPage.css';
import { axiosInstance } from '../../services/axiosInstance';
import { MailType, MessageStatus, MessageTypeImbox } from '../../types/types';
import CardMessage from '../../components/shared/card/cardMessage/CardMessage';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import CardRegisterMessage from '../../components/shared/card/cardRegisterMessage/CardRegisterMessage';
import Button from '../../components/shared/button/Button';
import SelectOptions from '../../components/shared/select/Select';
import { listStatusMsg, listTypeMsg } from '../../utils/files/files.utils';

const InitTMail: MailType['type'] = 'RECEIVER';

const MailPage = () => {
  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  const [typeMsg, setTypeMsg] = useState<MessageTypeImbox | null>(null);
  const [typeMail, setTypeMail] = useState<MailType['type'] | null>(InitTMail);
  const [statusMsg, setStatusMsg] = useState<MessageStatus | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const size = searchParams.get('size') === 'true' ? true : false;
  const [isNewMessage, setIsNewMessage] = useState(false);
  const viewMessage = (id: number, type: MailType['type']) =>
    navigate(`${id}?size=true&type=${type}`);

  useEffect(() => getMessages(), [typeMail, typeMsg, statusMsg]);

  const handleNewMessage = () => setIsNewMessage(true);
  const handleCloseMessage = () => setIsNewMessage(false);
  const handleSaveMessage = () => {
    getMessages();
    setIsNewMessage(false);
  };

  const getMessages = () => {
    const type = (typeMail && `&type=${typeMail}`) || '';
    const status = (statusMsg && `&status=${statusMsg}`) || '';
    const typeMessage = (typeMsg && `&typeMessage=${typeMsg}`) || '';
    const query = `/mail?${type}${status}${typeMessage}`;
    axiosInstance.get(query).then(res => setListMessage(res.data.mail));
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
  return (
    <div className="mail-main container">
      <div className="mail-main-master-container">
        <div className="mail-messages-container">
          <div className={`message-container-header`}>
            <h2>Trámites</h2>
            <div className="message-options-filter">
              <div className="mail-main-options-container">
                <Button
                  icon="inbox"
                  text={(!size && 'Bandeja de entrada') || undefined}
                  className={`mail-main-options-btn
                  ${typeMail === 'RECEIVER' && 'options-main-selected'} `}
                  onClick={handleSelectReceiver}
                />
                <Button
                  icon="tabler"
                  text={(!size && 'Enviados') || undefined}
                  className={`mail-main-options-btn
                  ${typeMail === 'SENDER' && 'options-main-selected'} `}
                  onClick={handleSelectSender}
                />
                <Button
                  icon="archiver-box"
                  text={(!size && 'Archivados') || undefined}
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
                <SelectOptions
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
                <SelectOptions
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
                <span>DOCUMENTO</span>
              </div>
              <div className="message-header-item">
                <span>DESTINATARIO</span>
              </div>
              <div className="message-header-item mail-grid-col-2">
                <span>ASUNTO</span>
              </div>
              {!size && (
                <>
                  <div className="message-header-item">
                    <span>ESTADO</span>
                  </div>
                  <div className="message-header-item">
                    <span>FECHA DE ENVÍO</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mail-grid-container">
            {listMessage &&
              listMessage.map(({ message, messageId, type }) => (
                <CardMessage
                  isActive={size}
                  key={messageId}
                  type={type}
                  onClick={() => viewMessage(messageId, type)}
                  message={message}
                />
              ))}
          </div>
        </div>
      </div>
      <div className={`mail-messages-details mail-m-size-${size}`}>
        <Outlet />
      </div>
      {isNewMessage && (
        <CardRegisterMessage
          onClosing={handleCloseMessage}
          onSave={handleSaveMessage}
        />
      )}
    </div>
  );
};

export default MailPage;
