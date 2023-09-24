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
import { filterFilesByAttempt } from '../../../utils/files/files.utils';

const parseDate = (date: Date) =>
  formatDate(new Date(date), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
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
  const [viewMoreFiles, setViewMoreFiles] = useState(false);
  const typeMessage = searchParams.get('type');
  const getFiles = (message && message.files) || [];
  const files = filterFilesByAttempt(getFiles);
  console.log(files);
  // const parameters = searchParams.get('size');
  // const [searchParams] = useSearchParams();

  useEffect(() => {
    if (messageId) getMessage(messageId);
  }, [messageId]);

  const getMessage = (id: string) => {
    axiosInstance.get(`/mail/${id}`).then(res => setMessage(res.data));
  };
  // console.log(message);
  const handleClose = () => navigate('/tramites');
  const handleViewMoreFiles = () => setViewMoreFiles(!viewMoreFiles);

  if (!message) return <div></div>;
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
      <div className="message-header-content">
        <div className="message-heacer-content-options">
          <Button
            className="message-icon-drop"
            icon={`${isActive ? 'resize-down' : 'resize-up'}`}
            onClick={handleResizeAction}
          />
          <Button
            // text="Cerrar"
            icon="close"
            onClick={handleClose}
            className="message-icon-close"
          />
        </div>
        <div className="message-sender-info-details">
          <div className="message-sender-info">
            {sender?.type === 'SENDER' && (
              <span className="message-sender-name">Enviado por:</span>
            )}
            <span className="message-sender-icon">
              <img src="/svg/user-sender.svg" alt="icon-profile" />
            </span>
            {sender && sender.type === 'SENDER' ? (
              <span className="message-sender-name">
                <b>
                  {sender.user.profile.lastName} {sender.user.profile.firstName}
                </b>
              </span>
            ) : (
              <span className="message-sender-name">Enviado Por ti</span>
            )}
            <span className="message-date-send">
              {parseDate(message.createdAt)}
            </span>
          </div>
          <span
            className={`message-card-status-message message-status-${message.status}`}
          >
            {message.status}
          </span>
        </div>
      </div>
      <div className="message-details-info">
        <h4 className="message-title">{message.title}</h4>
        <span className="message-subtitle">Asunto: {message.header}</span>
        <p className="message-sender-info">
          <span className="message-sender-icon">
            <img src="/svg/paper-clip.svg" alt="icon-profile" />
          </span>
          <span className="message-files-title">Archivos adjuntos:</span>
        </p>
        <div className="message-container-files-grid">
          {files[0].files.map(({ id, name, path }) => (
            <ChipFileMessage
              className="pointer message-files-list"
              key={id}
              text={parseName(name)}
              link={path + '/' + name}
            />
          ))}
          <div className="message-sender-info">
            {sender && sender.type === 'SENDER' ? (
              <span className="message-sender-name">
                Enviado por {` `}
                <b>
                  {sender.user.profile.lastName} {sender.user.profile.firstName}
                </b>
              </span>
            ) : (
              <span className="message-sender-name">Enviado Por ti</span>
            )}
            <span className="message-date-send">
              {parseDate(new Date(+files[0].id))}
            </span>
          </div>
        </div>
        <Button
          className={`message-view-more-files-${viewMoreFiles}`}
          text={`${viewMoreFiles ? 'Ocultar' : 'Ver'} documentos previos`}
          icon="down"
          onClick={handleViewMoreFiles}
        />
        {files.slice(1, files.length).map(({ id, files }) => (
          <div key={id}>
            {files.map(({ id, name, path }) => (
              <ChipFileMessage
                className="pointer message-files-list"
                key={id}
                text={parseName(name)}
                link={path + '/' + name}
              />
            ))}
            <span>{parseDate(new Date(+id))}</span>
          </div>
        ))}
      </div>
      {/* {typeMessage === 'RECEIVER' && (
        <CardRegisterMessageReply
          message={message}
          senderId={userSession.id}
          receiverId={receiver?.user.id}
        />
      )} */}
    </motion.div>
  );
};

export default MessagePage;
