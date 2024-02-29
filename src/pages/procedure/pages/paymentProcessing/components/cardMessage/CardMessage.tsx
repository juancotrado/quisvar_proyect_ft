import { Button } from '../../../../../../components';
import { useRole } from '../../../../../../hooks';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { MessageSender, MessageType } from '../../../../../../types';
import { formatDateHourLongSpanish } from '../../../../../../utils';
import { TYPE_STATUS, TYPE_STATUS_REGULAR_PROCEDURA } from '../../models';
import './cardMessage.css';

interface CardMessageProps {
  message: MessageType;
  type: MessageSender;
  isActive?: boolean;
  onClick: () => void;
  onArchiver?: () => void;
  option: 'comunicado' | 'tramite-de-pago' | 'tramite-regular';
}

const CardMessage = ({
  message,
  type,
  onClick,
  onArchiver,
  isActive,
  option,
}: CardMessageProps) => {
  const contactUser = message.users.find(user => user.type !== type);
  const { hasAccess } = useRole('MOD', null, option);

  const handleArchiverAction = () => {
    axiosInstance.patch(`/paymail/archived/${message.id}`).then(onArchiver);
  };

  return (
    <div
      className={`card-message-container-section status-card-${isActive} ${
        message.isOpen && 'message-isOpen'
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
      <div className="card-message-section-item mail-grid-col-2">
        <span className="card-status-span ">{message.header}</span>
      </div>
      {!isActive && (
        <>
          <div className="card-message-section-item">
            <span className={`card-status-message status-${message.status}`}>
              {option === 'comunicado' && 'Comunicado'}
              {option === 'tramite-de-pago' &&
                TYPE_STATUS[message.status]?.toLowerCase()}
              {option === 'tramite-regular' &&
                TYPE_STATUS_REGULAR_PROCEDURA[message.status]?.toLowerCase()}
            </span>
          </div>
          <div className="card-message-section-item">
            <span className={`card-status-span`}>
              {contactUser?.user.profile.description}
            </span>
          </div>
          <div className="card-message-section-item">
            <span className="card-status-span ">
              {formatDateHourLongSpanish(message.updatedAt)}
            </span>
          </div>
          {hasAccess ? (
            <div
              className="card-message-section-item message-cursor-none"
              onClick={e => e.stopPropagation()}
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
