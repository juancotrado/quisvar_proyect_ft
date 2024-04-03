import { ChipFileDownLoadProcedure } from '..';
import {
  isOpenViewHtmlToPdf$,
  isOpenViewPdf$,
} from '../../../../services/sharingSubject';
import { MessageReply, MessageType, ProfileShort } from '../../../../types';
import './procedureHistory.css';
import {
  formatDateHourLongSpanish,
  normalizeFileName,
} from '../../../../utils';
import { ChipFileMessage } from '../../pages/paymentProcessing/components';
import { URL, axiosInstance } from '../../../../services/axiosInstance';

interface ProcedureHistoryProps {
  messageHistory: MessageReply | MessageType;
  userMessage: ProfileShort;
}
const ProcedureHistory = ({
  messageHistory,
  userMessage,
}: ProcedureHistoryProps) => {
  const mainDocument = messageHistory?.files
    ? [...messageHistory?.files].shift()
    : undefined;

  const viewPdf = async (size: 'a4' | 'a5') => {
    if (!mainDocument) return;
    const mainDocumentUrl = `${URL}/${mainDocument.path}/${mainDocument.name}`;
    if (size === 'a4') {
      isOpenViewPdf$.setSubject = {
        fileNamePdf: messageHistory.title,
        isOpen: true,
        pdfUrl: mainDocumentUrl,
      };
    }
    if (size === 'a5') {
      axiosInstance
        .post(
          `/generate-pdf/two-pages?url=${mainDocument.path}/${mainDocument.name}&fileName=${mainDocument.name}`,
          {},
          { responseType: 'blob' }
        )
        .then(res => {
          isOpenViewHtmlToPdf$.setSubject = {
            isOpen: true,
            fileNamePdf: messageHistory.title,
            pdfBlob: res.data,
          };
        });
    }
  };
  const downloadOptions = [
    {
      id: 1,
      handleClick: () => viewPdf('a5'),
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A5',
    },
    {
      id: 2,
      handleClick: () => viewPdf('a4'),
      iconOne: 'file-download',
      iconTwo: 'file-download-white',
      text: 'A4',
    },
  ];

  return (
    <div className="procedureHistory">
      <div className="procedureHistory-info">
        <h4 className="message-title">{messageHistory.title}</h4>
        <span className="message-subtitle">
          Asunto: {messageHistory.header}
        </span>
        <div className="message-pdf-area">
          <p className="message-sender-info">
            <span className="message-sender-icon">
              <img src="/svg/paper-clip.svg" alt="icon-profile" />
            </span>
            <span className="message-files-title">Archivos adjuntos:</span>
          </p>
          <div className="procedureHistory-download-options">
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
        </div>
      </div>
      {mainDocument && (
        <object
          data={`${URL}/${mainDocument.path.replace('public', 'file-user')}/${
            mainDocument.name
          }`}
          type="application/pdf"
          style={{ width: '100%', aspectRatio: 0.75 }}
        />
      )}
      <div className="message-sender-info">
        <span className="message-sender-name">
          Enviado por{' '}
          <b>
            {userMessage.lastName} {userMessage.firstName}
          </b>
        </span>
        <span className="message-date-send">
          {formatDateHourLongSpanish(new Date(messageHistory.createdAt))}
        </span>
      </div>
      <div className="message-container-files-grid">
        {messageHistory.files &&
          messageHistory.files.map(({ id, name, path }) => (
            <ChipFileMessage
              className="pointer message-files-list"
              key={id}
              text={normalizeFileName(name)}
              link={path + '/' + name}
            />
          ))}
      </div>
    </div>
  );
};

export default ProcedureHistory;
