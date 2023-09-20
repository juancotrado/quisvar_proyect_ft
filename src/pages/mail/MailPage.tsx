import { useEffect, useState } from 'react';
import './mailPage.css';
import { axiosInstance } from '../../services/axiosInstance';
import { MailType } from '../../types/types';
import CardMessage from '../../components/shared/card/cardMessage/CardMessage';
import CardRegisterMessage from '../../components/shared/card/cardRegisterMessage/CardRegisterMessage';

const MailPage = () => {
  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  useEffect(() => {
    getMessages();
    axiosInstance
      .get('/mail/imbox/quantity')
      .then(res => console.log(res.data));
  }, []);

  const getMessages = () => {
    axiosInstance.get(`/mail`).then(res => setListMessage(res.data));
  };
  return (
    <div className="mail-main container">
      <h2>Trámites</h2>
      <div className="mail-messages-container">
        <div className="mail-grid">
          <div className=" message-container-header">
            <div className="message-header-item">
              <span>TIPO DE SOLICITUD</span>
            </div>
            <div className="message-header-item">
              <span>REMITENTE</span>
            </div>
            <div className="message-header-item mail-grid-col-2">
              <span>ASUNTO</span>
            </div>
            <div className="message-header-item">
              <span>ESTADO</span>
            </div>
            <div className="message-header-item">
              <span>FECHA DE ENVÍO</span>
            </div>
          </div>
          {listMessage &&
            listMessage.map(({ message, messageId, type }) => (
              <CardMessage
                key={messageId}
                type={type}
                // onClick={() => taskNavigate(subtask.id)}
                message={message}
              />
            ))}
        </div>
      </div>
      <div className="mail-messages-details">
        <CardRegisterMessage />
      </div>
    </div>
  );
};

export default MailPage;
