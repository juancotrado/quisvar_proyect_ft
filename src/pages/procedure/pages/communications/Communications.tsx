import { Button, HeaderOptionBtn, IconAction } from '../../../../components';
import './communications.css';
import { useMessage, useSelectReceiver } from '../../hooks';
import { CardRegisterProcedureGeneral } from '../../views';
import { CardMessage } from '../paymentProcessing/components';
import { CardMessageHeader } from '../../components';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRole } from '../../../../hooks';

const Communications = () => {
  const navigate = useNavigate();
  const {
    handleNewMessage,
    handleSaveMessage,
    isNewMessage,
    listMessage,
    getMessages,
  } = useMessage('/mail?category=GLOBAL');
  const { optionsMailHeader } = useSelectReceiver(['RECIBIDOS']);
  const { hasAccess } = useRole('MOD', 'tramites', 'comunicado');

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
            right={0.9}
            top={3.2}
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
          {hasAccess && (
            <Button
              onClick={handleNewMessage}
              icon="plus-dark"
              text="Nuevo comunicado"
              styleButton={3}
            />
          )}
        </div>
        <div className="mail-grid-container">
          <CardMessageHeader typeMail={'RECEIVER'} option="comunication" />

          {listMessage?.map(({ message, messageId }) => (
            <CardMessage
              isActive={false}
              key={messageId}
              type={'RECEIVER'}
              onArchiver={handleSaveMessage}
              onClick={() => handleViewMessage(messageId)}
              message={message}
              option="comunication"
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
          type={'comunication'}
        />
      )}
    </>
  );
};

export default Communications;
