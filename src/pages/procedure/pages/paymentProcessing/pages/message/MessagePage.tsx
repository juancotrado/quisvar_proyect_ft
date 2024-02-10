/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import {
  MessageReply,
  MessageType,
  PdfDataProps,
  quantityType,
} from '../../../../../../types';
import './messagePage.css';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  convertToDynamicObject,
  dataInitialPdf,
  filterFilesByAttempt,
  formatDate,
  normalizeFileName,
  transformDataPdf,
} from '../../../../../../utils';
import {
  Button,
  ButtonHeader,
  LoaderForComponent,
} from '../../../../../../components';
import { useListUsers } from '../../../../../../hooks';
import { PDFViewer } from '@react-pdf/renderer';
import { TYPE_STATUS } from '../../models';
import { ChipFileMessage } from '../../components';
import {
  CardRegisterMessageForward,
  CardRegisterMessageReply,
  CardRegisterMessageUpdate,
  CardRegisterVoucher,
  CardRegisterVoucherDenyOrAccept,
  GenerateOrderService,
} from './views';
import { PDFGenerator, generateReportPDF } from '../../pdfGenerate';
import { JOB_DATA } from '../../../../../userCenter/pages/users/models';
import { HEADER_OPTION, SPRING } from './models';
import { Resizable } from 're-resizable';

const parseDate = (date: Date) =>
  formatDate(new Date(date), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });

export const MessagePage = () => {
  const navigate = useNavigate();
  const { paymessageId } = useParams();
  const { users: listUsers } = useListUsers(
    'MOD',
    'tramites',
    'tramite-de-pago'
  );
  const { userSession } = useSelector((state: RootState) => state);
  const [isReply, setIsReply] = useState(true);
  const [data, setData] = useState<PdfDataProps>(dataInitialPdf);
  const [message, setMessage] = useState<MessageType | null>();
  const [viewMoreFiles, setViewMoreFiles] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [procedureOption, setProcedureOption] = useState<'finish' | 'continue'>(
    'continue'
  );
  const [countMessage, setCountMessage] = useState<quantityType[] | null>([]);
  //----------------------------------------------------------------------------
  const getFiles = (message && message.files) || [];
  const getHistory = (message && message.history) || [];
  const files = filterFilesByAttempt(getFiles);
  const getMessage = useCallback(
    (id: string) => {
      axiosInstance.get(`/paymail/${id}`).then(res => {
        const data = transformDataPdf({ data: res.data });
        setData(data);
        setMessage(res.data);
      });
    },
    [userSession]
  );
  useEffect(() => {
    if (paymessageId && userSession.id) getMessage(paymessageId);
    getQuantityServices();
    return () => setMessage(null);
  }, [getMessage, paymessageId, userSession.id]);

  const getQuantityServices = () =>
    axiosInstance
      .get('/paymail/imbox/quantity')
      .then(res => setCountMessage(res.data));

  const handleClose = () => {
    navigate('/tramites/tramite-de-pago');
  };
  const toggleSwitch = () => setIsReply(!isReply);
  const handleViewMoreFiles = () => setViewMoreFiles(!viewMoreFiles);
  const handleViewHistory = () => setViewHistory(!viewHistory);

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
  // console.log({ mainReceiverFinish });
  const trandformData = (data: MessageReply) => {
    const sender = data.user;
    const header = data.header;
    const description = data.description;
    const title = data.title;
    const to = sender.profile.firstName + ' ' + sender.profile.lastName;
    const toUser = listUsers.find(user => user.id === sender?.id);
    const from = message.users.find(user => user.type === 'SENDER');
    const filterJob = (value?: string, job?: string) => {
      if (value !== 'Titulado') return value;
      return JOB_DATA.filter(item => item.value === job)[0].abrv;
    };
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
      toDegree: filterJob(toUser?.degree, toUser?.job),
      toPosition: toUser?.position,
      dni: from?.user.profile.dni,
      fromDegree: filterJob(from?.user.profile.degree, from?.user.profile.job),
      fromPosition: from?.user.profile.description,
    };
  };
  const handleSaveRegister = () => {
    navigate('/tramites/tramite-de-pago?refresh=true');
  };
  const isUserInitMessage = userSession.id === message.userInit.userId;
  const handleOptionSelect = (option: 'continue' | 'finish') =>
    setProcedureOption(option);
  return (
    <Resizable
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: true,
      }}
      maxWidth={'76%'}
      minWidth={'30%'}
      className={`message-page-container `}
    >
      {message.status === 'PAGADO' && (
        <div className="message-page-contain message-page-contain--right">
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h2>Tramite Finalizado</h2>
          </div>
        </div>
      )}
      {(mainReceiver || mainReceiverFinish) && message.status !== 'PAGADO' && (
        <div className="message-page-contain message-page-contain--right">
          {message.status !== 'FINALIZADO' &&
            message.status !== 'POR_PAGAR' && (
              <div className="message-header-content-options  message-header--flexStart">
                {HEADER_OPTION.map(({ procedureOpt, text }) => (
                  <ButtonHeader
                    key={procedureOpt}
                    isActive={procedureOption === procedureOpt}
                    text={text}
                    onClick={() => handleOptionSelect(procedureOpt)}
                  />
                ))}
              </div>
            )}
          {procedureOption === 'continue' ? (
            <>
              {mainReceiver &&
                !isUserInitMessage &&
                message.status !== 'RECHAZADO' && (
                  <div
                    className="message-switch"
                    data-ison={isReply}
                    onClick={toggleSwitch}
                  >
                    {isReply && (
                      <span className="message-hover-title">NO PROCEDE</span>
                    )}
                    <motion.div
                      className={`message-handle`}
                      layout
                      transition={SPRING}
                    >
                      <span className="span-list-task">
                        {isReply ? 'Procede' : 'No Procede'}
                      </span>
                    </motion.div>
                    {!isReply && (
                      <span className="message-hover-title">PROCEDE</span>
                    )}
                  </div>
                )}
              {mainReceiver &&
                (message.status === 'PROCESO' ||
                  message.status === 'RECHAZADO') &&
                !isUserInitMessage && (
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
                <CardRegisterVoucher
                  message={message}
                  onSave={handleSaveRegister}
                />
              )}
              {message.status === 'POR_PAGAR' && mainReceiverFinish && (
                <CardRegisterVoucherDenyOrAccept
                  message={message}
                  onSave={handleSaveRegister}
                />
              )}
              {isUserInitMessage && message.status === 'RECHAZADO' && (
                <CardRegisterMessageUpdate
                  message={message}
                  receiverId={mainReceiver?.user.id}
                  onSave={handleSaveRegister}
                />
              )}
            </>
          ) : (
            <GenerateOrderService
              message={message}
              onSave={handleSaveRegister}
            />
          )}
        </div>
      )}
      <div className="message-page-contain  message-page-contain--left">
        <div className="message-header-content">
          <div className="message-header-content-options ">
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
                    {sender.user.profile.lastName}{' '}
                    {sender.user.profile.firstName}
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
              {TYPE_STATUS[message.status]}
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
          <PDFViewer width="100%" height="400">
            {generateReportPDF({ data }, { size: 'A4' })}
          </PDFViewer>

          {files.length > 0 && (
            <div className="message-container-files-grid">
              <div style={{ display: 'flex', gap: '1rem' }}>
                {files[0].files.map(({ id, name, path }) => (
                  <ChipFileMessage
                    className="pointer message-files-list"
                    key={id}
                    text={normalizeFileName(name)}
                    link={path + '/' + name}
                  />
                ))}
              </div>
              <div className="message-sender-info">
                <span className="message-sender-name">
                  Enviado por{' '}
                  <b>
                    {message.userInit.user.profile.lastName}{' '}
                    {message.userInit.user.profile.firstName}
                  </b>
                </span>
                <span className="message-date-send">
                  {parseDate(new Date(+files[0].id))}
                </span>
              </div>
            </div>
          )}
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
                        text={normalizeFileName(name)}
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
                  <PDFViewer width="100%" height="400">
                    {generateReportPDF(
                      { data: trandformData(history) },
                      { size: 'A4' }
                    )}
                  </PDFViewer>
                  <span>{parseDate(new Date(history.createdAt))}</span>
                  <div className="message-container-files-grid">
                    {history.files &&
                      history.files.map(({ id, name, path }) => (
                        <ChipFileMessage
                          className="pointer message-files-list"
                          key={id}
                          text={normalizeFileName(name)}
                          link={path + '/' + name}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Resizable>
  );
};
