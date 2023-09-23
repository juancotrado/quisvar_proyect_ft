import { MessageSender, MessageType, User } from '../../../../types/types';
import formatDate from '../../../../utils/formatDate';
import Button from '../../button/Button';
import './cardMessage.css';
interface CardMessageProps {
  message: MessageType;
  type: MessageSender;
  isActive?: boolean;
  user: User;
  onClick: () => void;
}

const CardMessage = ({
  message,
  type,
  user,
  onClick,
  isActive,
}: CardMessageProps) => {
  const contactUser = message.users.find(user => user.type !== type);
  const parseDate = (date: Date) =>
    formatDate(new Date(date), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleArchiverAction = () => {
    const url = 'sdsa';
    return url;
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
        <span className="card-status-span ">{message.title}</span>
      </div>
      {!isActive && (
        <>
          <div className="card-message-section-item">
            <span className={`card-status-message status-${message.status}`}>
              {message.status.toLowerCase()}
            </span>
          </div>
          <div className="card-message-section-item">
            <span className="card-status-span ">
              {parseDate(message.createdAt)}
            </span>
          </div>
          {user.role === 'SUPER_ADMIN' && (
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
          )}
        </>
      )}
    </div>
  );
};

export default CardMessage;
