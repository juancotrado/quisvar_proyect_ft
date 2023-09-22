import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../../../services/axiosInstance';
import { MessageType } from '../../../types/types';
import './messagePage.css';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import formatDate from '../../../utils/formatDate';
import ChipFileMessage from '../../../components/shared/card/cardRegisterMessage/ChipFileMessage';
import CardRegisterMessageReply from '../../../components/shared/card/cardRegisterMessageReply/CardRegisterMessageReply';
import { motion } from 'framer-motion';
import Button from '../../../components/shared/button/Button';

const parseDate = (date: Date) =>
  formatDate(new Date(date), {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'long',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });

const parseName = (title: string) => title.split('$').at(-1) || '';

const MessagePage = () => {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<MessageType | null>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const { userSession } = useSelector((state: RootState) => state);
  const typeMessage = searchParams.get('type');
  // const parameters = searchParams.get('size');
  // const [searchParams] = useSearchParams();

  useEffect(() => {
    if (messageId) getMessage(messageId);
  }, [messageId]);

  const getMessage = (id: string) => {
    axiosInstance.get(`/mail/${id}`).then(res => setMessage(res.data));
  };

  const handleClose = () => navigate('/tramites');

  if (!message) return <div>null</div>;
  const { users } = message;
  const sender = users.find(({ user }) => user.id !== userSession.id);

  const receiver = users.find(({ user }) => user.id !== userSession.id);

  const handleResizeAction = () => setIsActive(!isActive);

  return (
    <motion.div
      className="message-page-container"
      initial={{ opacity: 0, width: '40vw' }}
      animate={{
        opacity: 1,
        width: isActive ? '70vw' : '40vw',
        transition: { duration: 0.4 },
      }}
      exit={{ opacity: 0, transition: { delay: 0.3 } }}
    >
      <Button
        className="message-icon-drop"
        icon={`${isActive ? 'resize-down' : 'resize-up'}`}
        onClick={handleResizeAction}
      />
      <div className="message-header-content">
        <div className="message-header-title-container">
          <div className="patito">
            <h4 className="message-title">{message.title}</h4>
            <span
              className={`message-card-status-message status-${message.status}`}
            >
              {message.status ? 'Aceptado' : 'En proceso'}
            </span>
          </div>
          <span className="message-title">{message.header}</span>
        </div>
        <Button
          text="Cerrar"
          onClick={handleClose}
          className="message-icon-close"
        />
      </div>
      <div className="message-details-info">
        <div className="message-sender-info-container">
          <div className="message-sender-info">
            <span className="message-sender-icon">
              <img src="/svg/user-sender.svg" alt="icon-profile" />
            </span>
            {sender && sender.type === 'SENDER' ? (
              <span className="message-sender-name">
                {sender.user.profile.lastName} {sender.user.profile.firstName}
              </span>
            ) : (
              <span className="message-sender-name">Enviado Por ti</span>
            )}
          </div>
          <span className="message-date-send">
            {parseDate(message.createdAt)}
          </span>
        </div>
        {/* <p className="message-description-info">{message.description}</p> */}
        <span
          className="message-description-info"
          dangerouslySetInnerHTML={{ __html: message.description }}
        />
        <span>{message.description.length}</span>
        <p className="message-sender-info">
          <span className="message-sender-icon">
            <img src="/svg/paper-clip.svg" alt="icon-profile" />
          </span>
          <span className="message-files-title">Archivos adjuntos:</span>
        </p>
        <div className="message-container-files-grid">
          {message.files &&
            message.files.map(({ id, name, path }) => (
              <ChipFileMessage
                className="pointer message-files-list"
                key={id}
                text={parseName(name)}
                link={path + '/' + name}
              />
            ))}
        </div>
      </div>
      {typeMessage === 'RECEIVER' && (
        <CardRegisterMessageReply
          message={message}
          senderId={userSession.id}
          receiverId={receiver?.user.id}
        />
      )}
    </motion.div>
  );
};

export default MessagePage;
