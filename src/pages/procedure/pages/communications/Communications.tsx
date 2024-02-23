import { useEffect, useState } from 'react';
import { Button, HeaderOptionBtn } from '../../../../components';
import './communications.css';
import { useSelectReceiver } from '../../hooks';
import { CardRegisterProcedureGeneral } from '../../views';
import { axiosInstance } from '../../../../services/axiosInstance';
import { MailTypeComunication } from '../../../../types';
import { CardMessage } from '../paymentProcessing/components';
import { CardMessageHeader } from '../../components';
import { Outlet, useNavigate } from 'react-router-dom';

const Communications = () => {
  const [isNewMessage, setIsNewMessage] = useState(false);
  const navigate = useNavigate();
  const [listMessage, setListMessage] = useState<MailTypeComunication[] | null>(
    null
  );

  useEffect(() => {
    getMessages();
  }, []);

  const { optionsMailHeader, typeMail } = useSelectReceiver(['RECIBIDOS']);
  const handleNewMessage = () => setIsNewMessage(!isNewMessage);
  const handleSaveMessage = () => {
    getMessages();
    setIsNewMessage(false);
  };
  const handleViewMessage = (id: number) => {
    navigate(`${id}`);
  };
  const getMessages = () => {
    axiosInstance.get('/mail').then(res => {
      setListMessage(res.data.mail);
      // setTotalMail(res.data.total);
    });
  };
  return (
    <>
      <div className="procedure-flow-main">
        <div className="procedure-flow-header">
          <div className="procedure-flow-option">
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
          <Button
            onClick={handleNewMessage}
            icon="plus-dark"
            text="Nuevo comunicado"
            styleButton={3}
          />
        </div>
        <div className="mail-grid-container">
          <CardMessageHeader typeMail={typeMail} />

          {listMessage?.map(({ message, messageId, type }) => (
            <CardMessage
              isActive={false}
              key={messageId}
              type={type}
              onArchiver={handleSaveMessage}
              onClick={() => handleViewMessage(messageId)}
              message={message}
              option="comunicado"
            />
          ))}
        </div>
      </div>
      <Outlet />
      {isNewMessage && (
        <CardRegisterProcedureGeneral
          onClosing={handleNewMessage}
          onSave={handleSaveMessage}
        />
      )}
    </>
  );
};

export default Communications;
