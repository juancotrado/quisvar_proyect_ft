import { useEffect, useState } from 'react';
import './mailPage.css';
import { axiosInstance } from '../../services/axiosInstance';
import { MailType } from '../../types/types';
import CardMessage from '../../components/shared/card/cardMessage/CardMessage';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

const MailPage = () => {
  const [listMessage, setListMessage] = useState<MailType[] | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const size = searchParams.get('size');
  const viewMessage = (id: number) => navigate(`${id}?size=true`);

  useEffect(() => getMessages(), []);
  const getMessages = () => {
    axiosInstance.get(`/mail`).then(res => setListMessage(res.data));
  };
  return (
    <div className="mail-main container">
      <div className="mail-main-master-container">
        <div className="mail-messages-container">
          <div className="message-container-header">
            <h2>Trámites</h2>
            <div className="message-options-filter">Otras opciones</div>
            <div className=" message-container-header-titles">
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
          </div>
          <div className="mail-grid-container">
            {listMessage &&
              listMessage.map(({ message, messageId, type }) => (
                <CardMessage
                  key={messageId}
                  type={type}
                  onClick={() => viewMessage(messageId)}
                  message={message}
                />
              ))}
          </div>
        </div>
      </div>
      <div className={`mail-messages-details mail-m-size-${size}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default MailPage;
