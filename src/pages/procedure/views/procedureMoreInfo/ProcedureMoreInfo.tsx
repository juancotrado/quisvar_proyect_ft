import { useState } from 'react';
import { Button, IconAction } from '../../../../components';
import { MessageType } from '../../../../types';
import { ProcedureHistory } from '../../components';
import { formatDateHourLongSpanish } from '../../../../utils';
import './procedureMoreInfo.css';

interface ProcedureMoreInfoProps {
  handleClose: () => void;
  message: MessageType;
  status: string;
  userInitSender: string;
}

const ProcedureMoreInfo = ({
  handleClose,
  message,
  status,
  userInitSender,
}: ProcedureMoreInfoProps) => {
  const [viewHistory, setViewHistory] = useState(false);

  const handleViewHistory = () => setViewHistory(!viewHistory);

  return (
    <div className="procedureMoreInfo  procedureMoreInfo-contain--left">
      <div className="procedureMoreInfo-header-content ">
        <IconAction icon="close" onClick={handleClose} />
        <div className="procedureMoreInfo-sender-info-details">
          <div className="procedureMoreInfo-sender-info">
            <IconAction icon="user-sender" position="none" />
            <span className="procedureMoreInfo-sender-name">
              Tramite de : <b>{userInitSender}</b>{' '}
            </span>
          </div>
          <span
            className={`procedureMoreInfo-card-status-message procedureMoreInfo-status-${message.status}`}
          >
            {status}
          </span>
        </div>
        <span className="procedureMoreInfo-date-send">
          {formatDateHourLongSpanish(message.createdAt)}
        </span>
      </div>
      <div className="procedureMoreInfo-main">
        <ProcedureHistory
          messageHistory={message}
          userMessage={message.userInit.user.profile}
        />
        {message?.history.length > 0 && (
          <div className="regularProcedureInfo-btn-expand">
            <Button
              className={`message-view-more-files-${viewHistory}`}
              text={`${viewHistory ? 'Ocultar' : 'Ver'} documentos recibidos`}
              icon="down"
              onClick={handleViewHistory}
            />
          </div>
        )}
        <div className="procedureMoreInfo-container-files-grid">
          {viewHistory &&
            [...message?.history]
              .reverse()
              .map(history => (
                <ProcedureHistory
                  messageHistory={history}
                  key={history.id}
                  userMessage={history.user.profile}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProcedureMoreInfo;
