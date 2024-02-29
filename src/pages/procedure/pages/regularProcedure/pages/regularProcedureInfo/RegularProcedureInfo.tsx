import { useNavigate, useParams } from 'react-router-dom';
import './regularProcedureInfo.css';
import { useHtmlToPdf } from '../../../../../../hooks';
import { MessageType, ProcedureSubmit } from '../../../../../../types';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { Button, LoaderForComponent } from '../../../../../../components';
import {
  filterFilesByAttempt,
  formatDateHourLongSpanish,
  htmlToPdf,
  normalizeFileName,
} from '../../../../../../utils';
import { isOpenViewHtmlToPdf$ } from '../../../../../../services/sharingSubject';
import { Resizable } from 're-resizable';
import { TYPE_STATUS } from '../../../paymentProcessing/models';
import {
  ChipFileDownLoadProcedure,
  FormRegisterProcedure,
  ProcedureHistory,
} from '../../../../components';
import { ChipFileMessage } from '../../../paymentProcessing/components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
const RegularProcedureInfo = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const { getPdfToEmbed, pdfUrl } = useHtmlToPdf();
  const [message, setMessage] = useState<MessageType | null>();
  const [viewMoreFiles, setViewMoreFiles] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);

  const handleViewMoreFiles = () => setViewMoreFiles(!viewMoreFiles);
  const handleViewHistory = () => setViewHistory(!viewHistory);
  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const handleClose = () => {
    navigate('/tramites/tramite-regular');
  };

  useEffect(() => {
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

  console.log(message);
  const mainReceiver = message.users.find(
    ({ user, status, role, type }) =>
      user.id === userSessionId &&
      status &&
      role === 'MAIN' &&
      type == 'RECEIVER'
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
  const handleSaveRegister = () => {
    navigate('/tramites/tramite-regular');
  };
  const onSubmit = async (data: ProcedureSubmit) => {
    const { fileUploadFiles, values } = data;
    const { header, receiverId, title, description } = values;
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append(
      'data',
      JSON.stringify({ header, receiverId, title, description })
    );
    axiosInstance
      .post(`/mail/${messageId}/reply?status=PENDIENTE`, formData)
      .then(handleSaveRegister);
  };

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
      className="message-page-container"
    >
      {mainReceiver && (
        <div className="regularProcedureInfo message-page-contain--right">
          <>
            {/* {mainReceiver &&
            (message.status === 'PROCESO' ||
              message.status === 'RECHAZADO') && ( */}

            {mainReceiver && (
              <FormRegisterProcedure
                type={'regularProcedure'}
                submit={data => onSubmit(data)}
              />
            )}

            {/* )} */}
          </>
        </div>
      )}
      <div className="regularProcedureInfo  message-page-contain--left">
        <div className="message-header-content ">
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
        <ProcedureHistory
          messageHistory={message}
          userMessage={message.initialSender.user.profile}
        />
        {message?.history.length > 0 && (
          <Button
            className={`message-view-more-files-${viewHistory}`}
            text={`${viewHistory ? 'Ocultar' : 'Ver'} documentos recibidos`}
            icon="down"
            onClick={handleViewHistory}
          />
        )}
        <div className="message-container-files-grid">
          {viewHistory &&
            message?.history.map(history => (
              <ProcedureHistory
                messageHistory={history}
                key={history.id}
                userMessage={history.user.profile}
              />
            ))}
        </div>
      </div>
    </Resizable>
  );
};

export default RegularProcedureInfo;
