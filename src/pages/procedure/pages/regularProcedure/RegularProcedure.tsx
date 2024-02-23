import { useState } from 'react';
import './regularProcedure.css';
import { Button, HeaderOptionBtn } from '../../../../components';
import { CardRegisterMessage } from '../paymentProcessing/views';
import { useSelectReceiver } from '../../hooks';
import { CardRegisterProcedureGeneral } from '../../views';

const RegularProcedure = () => {
  const [isNewMessage, setIsNewMessage] = useState(false);
  const { optionsMailHeader, typeMail } = useSelectReceiver();
  const handleNewMessage = () => setIsNewMessage(!isNewMessage);

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
            text="Nuevo Trámite"
            styleButton={3}
          />
        </div>
      </div>
      {isNewMessage && (
        <CardRegisterProcedureGeneral
        // onClosing={handleNewMessage}
        // onSave={handleSaveMessage}
        />
      )}
    </>
  );
};

export default RegularProcedure;
