import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../services/axiosInstance';
import { MessageType, quantityType } from '../../../types/types';
import './messagePage.css';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import formatDate from '../../../utils/formatDate';
import ChipFileMessage from '../../../components/shared/card/cardRegisterMessage/ChipFileMessage';
import CardRegisterMessageReply from '../../../components/shared/card/cardRegisterMessageReply/CardRegisterMessageReply';
import { motion } from 'framer-motion';
import Button from '../../../components/shared/button/Button';
import { filterFilesByAttempt } from '../../../utils/files/files.utils';
import CardRegisterMessageForward from '../../../components/shared/card/cardRegisterMessageFordward/CardRegisterMessageFordward';
import CardRegisterMessageUpdate from '../../../components/shared/card/cardRegisterMessageUpdate/CardRegisterMessageUpdate';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};

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
  const navigate = useNavigate();
  const { messageId } = useParams();
  const { userSession } = useSelector((state: RootState) => state);
  const [isReply, setIsReply] = useState(true);
  const [message, setMessage] = useState<MessageType | null>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [viewMoreFiles, setViewMoreFiles] = useState(false);
  const [countMessage, setCountMessage] = useState<quantityType[] | null>([]);
  //----------------------------------------------------------------------------
  const getFiles = (message && message.files) || [];
  const files = filterFilesByAttempt(getFiles);
  // const parameters = searchParams.get('size');
  // const [searchParams] = useSearchParams();

  useEffect(() => {
    if (messageId) getMessage(messageId);
    getQuantityServices();
  }, [messageId]);

  const getMessage = (id: string) => {
    axiosInstance.get(`/mail/${id}`).then(res => setMessage(res.data));
  };
  // console.log(message);
  const getQuantityServices = () =>
    axiosInstance
      .get('/mail/imbox/quantity')
      .then(res => setCountMessage(res.data));

  const handleClose = () => navigate('/tramites');
  const toggleSwitch = () => setIsReply(!isReply);
  const handleViewMoreFiles = () => setViewMoreFiles(!viewMoreFiles);
  const handleResizeAction = () => setIsActive(!isActive);

  if (!message) return <div></div>;
  const { users } = message;
  const sender = users.find(({ user }) => user.id !== userSession.id);
  const mainSender = users.find(
    ({ user, type, role }) =>
      user.id === userSession.id && role === 'MAIN' && type == 'SENDER'
  );
  const mainReceiver = users.find(
    ({ user, status, role }) =>
      user.id === userSession.id && status && role === 'MAIN'
  );
  console.log(mainSender);
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
        {files.length > 1 && (
          <Button
            className={`message-view-more-files-${viewMoreFiles}`}
            text={`${viewMoreFiles ? 'Ocultar' : 'Ver'} documentos previos`}
            icon="down"
            onClick={handleViewMoreFiles}
          />
        )}
        <div className="message-container-files-grid">
          {viewMoreFiles &&
            files.slice(1, files.length).map(({ id, files }) => (
              <div className="message-container-file-information" key={id}>
                <span>{parseDate(new Date(+id))}</span>
                <div className="message-container-files-grid">
                  {files.map(({ id, name, path }) => (
                    <ChipFileMessage
                      className="pointer message-files-list"
                      key={id}
                      text={parseName(name)}
                      link={path + '/' + name}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
        {mainReceiver && message.status === 'PROCESO' && (
          <div
            className="message-switch"
            data-ison={isReply}
            onClick={toggleSwitch}
          >
            {isReply && <span className="message-hover-title">NO PROCEDE</span>}
            <motion.div className={`message-handle`} layout transition={spring}>
              <span className="span-list-task">
                {isReply ? 'Procede' : 'No Procede'}
              </span>
            </motion.div>
            {!isReply && <span className="message-hover-title">PROCEDE</span>}
          </div>
        )}
      </div>
      {mainReceiver && message.status === 'PROCESO' && (
        <>
          {isReply ? (
            <CardRegisterMessageReply
              message={message}
              receiverId={1}
              senderId={2}
              quantityFiles={countMessage}
            />
          ) : (
            <CardRegisterMessageForward
              message={message}
              receiverId={1}
              senderId={2}
              quantityFiles={countMessage}
            />
          )}
        </>
      )}
      {mainSender && message.status === 'RECHAZADO' && (
        <CardRegisterMessageUpdate
          message={message}
          receiverId={mainReceiver?.user.id}
        />
      )}
    </motion.div>
  );
};

export default MessagePage;
