import './regularProcedure.css';
import { Button, HeaderOptionBtn, IconAction } from '../../../../components';
import { useMessage, useSelectReceiver } from '../../hooks';
import { CardRegisterProcedureGeneral } from '../../views';
import { CardMessageHeader } from '../../components';
import { CardMessage } from '../paymentProcessing/components';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useRole } from '../../../../hooks';

const RegularProcedure = () => {
  const navigate = useNavigate();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-regular');
  const [params] = useSearchParams();

  const { optionsMailHeader, typeMail } = useSelectReceiver();
  const {
    handleNewMessage,
    handleSaveMessage,
    isNewMessage,
    listMessage,
    getMessages,
  } = useMessage(`/mail?category=DIRECT${typeMail ? `&type=${typeMail}` : ''}`);

  useEffect(() => {
    getMessages();
  }, [typeMail, params]);

  const handleViewMessage = (id: number) => {
    navigate(`${id}`);
  };
  return (
    <>
      <div className="procedure-flow-main">
        <div className="procedure-flow-header">
          <IconAction
            icon="refresh"
            onClick={getMessages}
            right={0.3}
            top={3.3}
          />
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
            text="Nuevo Trámite"
            styleButton={3}
          />
        </div>
        <div className="mail-grid-container">
          <CardMessageHeader option="regularProcedure" typeMail={typeMail} />
          {listMessage?.map(({ message, messageId, type }) => (
            <CardMessage
              isActive={false}
              key={messageId}
              type={type}
              onArchiver={handleSaveMessage}
              onClick={() => handleViewMessage(messageId)}
              message={message}
              option="regularProcedure"
              hasAccess={hasAccess}
            />
          ))}
        </div>
      </div>
      <Outlet />
      {isNewMessage && (
        <CardRegisterProcedureGeneral
          onClosing={handleNewMessage}
          onSave={handleSaveMessage}
          type={'regularProcedure'}
        />
      )}
    </>
  );
};

export default RegularProcedure;
