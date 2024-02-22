import { useNavigate, useParams } from 'react-router-dom';
import { Button, LoaderForComponent } from '../../../../../components';
import { axiosInstance } from '../../../../../services/axiosInstance';
import { MessageType } from '../../../../../types';
import { useEffect, useState } from 'react';
import './communicationInfo.css';
import {
  filterFilesByAttempt,
  formatDateHourLongSpanish,
  normalizeFileName,
} from '../../../../../utils';
import { TYPE_STATUS } from '../../paymentProcessing/models';
import { isOpenViewHtmlToPdf$ } from '../../../../../services/sharingSubject';
import { ChipFileDownLoadProcedure } from '../../../components';
import { useHtmlToPdf } from '../../../../../hooks';
import { ChipFileMessage } from '../../paymentProcessing/components';
import { Resizable } from 're-resizable';

const CommunicationInfo = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const { getPdfToEmbed, pdfUrl } = useHtmlToPdf();
  const [message, setMessage] = useState<MessageType | null>();
  const handleClose = () => {
    navigate('/tramites/comunicado');
  };

  useEffect(() => {
    console.log('first');
    getMessage();
  }, [messageId]);

  const getMessage = () => {
    axiosInstance.get<MessageType>(`/mail/${messageId}`).then(({ data }) => {
      setMessage(data);
      getPdfToEmbed(data.description, 'a4');
    });
  };
  if (!message)
    return (
      <div className="message-page-loader">
        <LoaderForComponent />
      </div>
    );
  const files = filterFilesByAttempt(message.files ?? []);

  const { initialSender } = message;
  const downLoadPdf = (size: 'a4' | 'a5') => {
    const { description, header } = message;
    isOpenViewHtmlToPdf$.setSubject = {
      isOpen: true,
      fileNamePdf: header,
      htmlString: description,
      size,
    };
  };

  const downloadOptions = [
    {
      id: 1,
      handleClick: () => downLoadPdf('a5'),
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A5',
    },
    {
      id: 2,
      handleClick: () => downLoadPdf('a4'),
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A4',
    },
  ];
  return (
    <Resizable
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: true,
      }}
      maxWidth={'60%'}
      minWidth={'40%'}
      className="communicationInfo-page-contain"
    >
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
            {initialSender?.type === 'SENDER' && (
              <span className="message-sender-name">Enviado por:</span>
            )}
            <span className="message-sender-icon">
              <img src="/svg/user-sender.svg" alt="icon-profile" />
            </span>
            {initialSender && initialSender.type === 'SENDER' ? (
              <span className="message-sender-name">
                <b>
                  {initialSender.user.profile.lastName}{' '}
                  {initialSender.user.profile.firstName}
                </b>
              </span>
            ) : (
              <span className="message-sender-name">Enviado Por ti</span>
            )}
            <span className="message-date-send">
              {formatDateHourLongSpanish(message.createdAt)}
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
          {downloadOptions.map(
            ({ iconOne, iconTwo, id, handleClick, text }) => (
              <ChipFileDownLoadProcedure
                key={id}
                text={text}
                iconOne={iconOne}
                iconTwo={iconTwo}
                onClick={handleClick}
              />
            )
          )}
        </div>
        {pdfUrl && (
          <embed
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            // download="nombre_que_quieras.pdf"
          />
        )}

        <span className="message-subtitle">Archivos adicionales:</span>
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
          </div>
        )}
      </div>
    </Resizable>
  );
};

export default CommunicationInfo;
