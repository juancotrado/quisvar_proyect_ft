/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../services/axiosInstance';
import {
  MessageReply,
  MessageType,
  PdfDataProps,
  UserRoleType,
  quantityType,
} from '../../../types/types';
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
import {
  convertToDynamicObject,
  dataInitialPdf,
} from '../../../utils/pdfReportFunctions';
import { PDFGenerator } from '../../../components';
import LoaderForComponent from '../../../components/shared/loaderForComponent/LoaderForComponent';
import { transformDataPdf } from '../../../utils/transformDataPdf';
import useListUsers from '../../../hooks/useListUsers';
import CardRegisterVoucher from '../../../components/shared/card/cardRegisterVoucher/CardRegisterVoucher';
import CardRegisterVoucherDenyOrAccept from '../../../components/shared/card/cardRegisterVoucherDenyOrAccept/CardRegisterVoucherDenyOrAccept';

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
const RolePerm: UserRoleType[] = ['SUPER_ADMIN', 'ADMIN', 'SUPER_MOD', 'MOD'];

const MessagePage = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const { users: listUsers } = useListUsers(RolePerm);
  const { userSession } = useSelector((state: RootState) => state);
  const [isReply, setIsReply] = useState(true);
  const [data, setData] = useState<PdfDataProps>(dataInitialPdf);
  const [message, setMessage] = useState<MessageType | null>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [viewMoreFiles, setViewMoreFiles] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [countMessage, setCountMessage] = useState<quantityType[] | null>([]);
  //----------------------------------------------------------------------------
  const getFiles = (message && message.files) || [];
  const getHistory = (message && message.history) || [];
  const files = filterFilesByAttempt(getFiles);
  const getMessage = useCallback(
    (id: string) => {
      axiosInstance.get(`/mail/${id}`).then(res => {
        const data = transformDataPdf({ listUsers, data: res.data });
        setData(data);
        setMessage(res.data);
      });
    },
    [userSession]
  );
  useEffect(() => {
    if (messageId && userSession.id) getMessage(messageId);
    getQuantityServices();
    return () => {
      setMessage(null);
    };
  }, [getMessage, messageId, userSession.id]);

  const getQuantityServices = () =>
    axiosInstance
      .get('/mail/imbox/quantity')
      .then(res => setCountMessage(res.data));

  const handleClose = () => navigate('/tramites');
  const toggleSwitch = () => setIsReply(!isReply);
  const handleViewMoreFiles = () => setViewMoreFiles(!viewMoreFiles);
  const handleViewHistory = () => setViewHistory(!viewHistory);
  const handleResizeAction = () => setIsActive(!isActive);

  if (!message)
    return (
      <div className="message-page-loader">
        <LoaderForComponent />
      </div>
    );
  const { users } = message;
  const sender = users.find(({ user }) => user.id !== userSession.id);
  const mainSender = users.find(
    ({ user, type, role }) =>
      user.id === userSession.id && role === 'MAIN' && type == 'RECEIVER'
  );
  const mainReceiver = users.find(
    ({ user, status, role, type }) =>
      user.id === userSession.id &&
      status &&
      role === 'MAIN' &&
      type == 'RECEIVER'
  );
  const mainReceiverFinish = users.some(
    ({ user, role, type }) =>
      user.id === userSession.id && role === 'MAIN' && type == 'RECEIVER'
  );
  console.log({ mainReceiverFinish });
  const trandformData = (data: MessageReply) => {
    const sender = data.user;
    const header = data.header;
    const description = data.description;
    const title = data.title;
    const to = sender.profile.firstName + ' ' + sender.profile.lastName;
    const toUser = listUsers.find(user => user.id === sender?.id);
    const from = message.users.find(user => user.type === 'SENDER');
    return {
      from: from?.user.profile.firstName + ' ' + from?.user.profile.lastName,
      header,
      body: convertToDynamicObject(description ?? ''),
      title,
      to,
      date: formatDate(new Date(data.createdAt), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
      }),
      toDegree: toUser?.degree,
      toPosition: toUser?.position,
      dni: from?.user.profile.dni,
      fromDegree: from?.user.profile.degree,
      fromPosition: from?.user.profile.description,
    };
  };
  const handleSaveRegister = () => {
    navigate('/tramites?refresh=true');
  };
  console.log({ message });
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
        <div className="message-pdf-area">
          <p className="message-sender-info">
            <span className="message-sender-icon">
              <img src="/svg/paper-clip.svg" alt="icon-profile" />
            </span>
            <span className="message-files-title">Archivos adjuntos:</span>
          </p>
          <PDFGenerator data={data} isView />
        </div>
        <div className="message-container-files-grid">
          <div style={{ display: 'flex', gap: '1rem' }}>
            {files[0].files.map(({ id, name, path }) => (
              <ChipFileMessage
                className="pointer message-files-list"
                key={id}
                text={parseName(name)}
                link={path + '/' + name}
              />
            ))}
          </div>
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
        {getHistory.length > 0 && (
          <Button
            className={`message-view-more-files-${viewHistory}`}
            text={`${viewHistory ? 'Ocultar' : 'Ver'} documentos recibidos`}
            icon="down"
            onClick={handleViewHistory}
          />
        )}
        <div className="message-container-files-grid">
          {viewHistory &&
            getHistory.map(history => (
              <div
                className="message-container-file-information"
                key={history.id}
              >
                <div className="message-pdf-area">
                  <span className="message-sender-name">
                    Enviado por {` `}
                    <b>
                      {history.user.profile.lastName}{' '}
                      {history.user.profile.firstName}
                    </b>
                  </span>
                  <PDFGenerator data={trandformData(history)} isView />
                </div>
                <span>{parseDate(new Date(history.createdAt))}</span>
                <div className="message-container-files-grid">
                  {history.files &&
                    history.files.map(({ id, name, path }) => (
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
        {mainReceiver && (
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
      {mainReceiver &&
        (message.status === 'PROCESO' || message.status === 'RECHAZADO') && (
          <>
            {isReply ? (
              <CardRegisterMessageReply
                message={message}
                quantityFiles={countMessage}
                senderId={mainSender?.user.id}
                onSave={handleSaveRegister}
              />
            ) : (
              <CardRegisterMessageForward
                message={message}
                quantityFiles={countMessage}
                onSave={handleSaveRegister}
              />
            )}
          </>
        )}
      {message.status == 'FINALIZADO' && mainReceiverFinish && (
        <CardRegisterVoucher message={message} onSave={handleSaveRegister} />
      )}

      {message.status === 'POR_PAGAR' && mainReceiverFinish && (
        <CardRegisterVoucherDenyOrAccept
          message={message}
          onSave={handleSaveRegister}
        />
      )}
      {/* {mainSender && message.status === 'RECHAZADO' && (
        <CardRegisterMessageUpdate
          message={message}
          receiverId={mainReceiver?.user.id}
          onSave={handleSaveRegister}
        />
      )} */}
    </motion.div>
  );
};

export default MessagePage;
