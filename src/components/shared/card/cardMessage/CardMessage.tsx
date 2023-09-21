import { MessageSender, MessageType } from '../../../../types/types';
import formatDate from '../../../../utils/formatDate';
import './cardMessage.css';
interface CardMessageProps {
  message: MessageType;
  type: MessageSender;
  onClick: () => void;
}

const CardMessage = ({ message, type, onClick }: CardMessageProps) => {
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
  return (
    <div
      className={`card-message-container-section ${
        message.isOpen && 'message-isOpen'
      } pointer`}
      onClick={onClick}
    >
      <div className="card-message-section-item">
        <span className="card-status-span ">{message.type}</span>
      </div>
      <div className="card-message-section-item">
        {contactUser && (
          <span className="card-status-span ">
            {type == 'SENDER' && 'Para: '}
            {contactUser.user.profile.lastName}{' '}
            {contactUser.user.profile.firstName}
          </span>
        )}
      </div>
      <div className="card-message-section-item mail-grid-col-2">
        <span className="card-status-span ">{message.title}</span>
      </div>
      <div className="card-message-section-item">
        <span className={`card-status-message status-${message.status}`}>
          {message.status ? 'Aceptado' : 'En proceso'}
        </span>
      </div>
      <div className="card-message-section-item">
        <span className="card-status-span ">
          {parseDate(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default CardMessage;
