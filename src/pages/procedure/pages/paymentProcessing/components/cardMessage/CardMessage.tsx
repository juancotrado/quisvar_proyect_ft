import { Button } from '../../../../../../components';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { MessageSender, MessageType } from '../../../../../../types';
import { formatDateHourLongSpanish } from '../../../../../../utils';
import { TypeProcedure } from '../../../../models';
import { TYPE_STATUS, TYPE_STATUS_REGULAR_PROCEDURA } from '../../models';
import './cardMessage.css';

interface CardMessageProps {
  message: MessageType;
  type: MessageSender;
  isActive?: boolean;
  onClick: () => void;
  onArchiver?: () => void;
  option: TypeProcedure;
  hasAccess: boolean;
  typeMail: MessageSender;
}

const CardMessage = ({
  message,
  type,
  onClick,
  onArchiver,
  isActive,
  option,
  hasAccess,
  typeMail,
}: CardMessageProps) => {
  const contactUser = message.users.find(user => user.type !== type);

  const handleArchiverAction = () => {
    axiosInstance.patch(`/paymail/archived/${message.id}`).then(onArchiver);
  };
  const firstNameInitial = message?.userInit?.user?.profile?.firstName;
  const lastNameInitial = message?.userInit?.user?.profile?.lastName;
  return (
    <div
      className={`cardMessageRow-container ${
        option === 'comunication' && 'cardMessageRow-grid-comunication'
      } pointer`}
      onClick={onClick}
    >
      <div className="card-message-section-item">
        <span className="card-status-span">{message.title}</span>
      </div>
      <div className="card-message-section-item">
        {contactUser && (
          <span className="card-status-span ">
            {type == 'SENDER' ? 'Para: ' : 'De: '}
            <b style={{ textTransform: 'capitalize' }}>
              {contactUser.user.profile.lastName}{' '}
              {contactUser.user.profile.firstName}
            </b>
          </span>
        )}
      </div>
      <div className="card-message-section-item ">
        <span className="card-status-span ">{message.header}</span>
      </div>
      {!isActive && (
        <>
          <div className="card-message-section-item">
            <span className={`card-status-message status-${message.status}`}>
              {option === 'comunication' && 'Comunicado'}
              {option === 'payProcedure' &&
                TYPE_STATUS[message.status]?.toLowerCase()}
              {option === 'regularProcedure' &&
                TYPE_STATUS_REGULAR_PROCEDURA[message.status]?.toLowerCase()}
            </span>
          </div>
          <div className="card-message-section-item">
            <span className={`card-status-span`}>
              {contactUser?.user.profile.description}
            </span>
          </div>
          {option !== 'comunication' && (
            <div className="card-message-section-item">
              <span className={`card-status-span`}>
                {firstNameInitial} {lastNameInitial}
              </span>
            </div>
          )}
          <div className="card-message-section-item">
            <span className="card-status-span ">
              {formatDateHourLongSpanish(message.updatedAt)}
            </span>
          </div>
          {hasAccess && typeMail !== 'ARCHIVER' ? (
            <div
              className="card-message-section-item message-cursor-none"
              onClick={e => e.stopPropagation()}
              style={{ justifyContent: 'center' }}
            >
              <Button
                className="card-message-archiver-action"
                icon="archiver-action"
                onClick={handleArchiverAction}
              />
            </div>
          ) : (
            <div className="card-message-section-item">--</div>
          )}
        </>
      )}
    </div>
  );
};

export default CardMessage;
