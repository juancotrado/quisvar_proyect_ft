import { useEffect } from 'react';
import { ChipFileDownLoadProcedure } from '..';
import { useHtmlToPdf } from '../../../../hooks';
import { isOpenViewHtmlToPdf$ } from '../../../../services/sharingSubject';
import { MessageReply, MessageType, ProfileShort } from '../../../../types';
import './procedureHistory.css';
import {
  formatDateHourLongSpanish,
  normalizeFileName,
} from '../../../../utils';
import { ChipFileMessage } from '../../pages/paymentProcessing/components';

interface ProcedureHistoryProps {
  messageHistory: MessageReply | MessageType;
  userMessage: ProfileShort;
}
const ProcedureHistory = ({
  messageHistory,
  userMessage,
}: ProcedureHistoryProps) => {
  console.log('userMessage', userMessage);
  const { getPdfToEmbed, pdfUrl } = useHtmlToPdf();

  useEffect(() => {
    getPdfToEmbed(messageHistory.description, 'a4');
  }, []);

  const downLoadPdf = (size: 'a4' | 'a5') => {
    const { description, header } = messageHistory;
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
      {pdfUrl && (
        <embed
          src={pdfUrl}
          type="application/pdf"
          style={{ width: '100%', aspectRatio: 0.75 }}
        />
      )}
      <span></span>
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
