import { useNavigate, useParams } from 'react-router-dom';
import './regularProcedureInfo.css';
import { MessageType, ProcedureSubmit } from '../../../../../../types';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import {
  Button,
  IconAction,
  LoaderForComponent,
} from '../../../../../../components';
import { formatDateHourLongSpanish } from '../../../../../../utils';
import { Resizable } from 're-resizable';
import { TYPE_STATUS_REGULAR_PROCEDURA } from '../../../paymentProcessing/models';
import {
  FormRegisterProcedure,
  ProcedureHistory,
} from '../../../../components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
const RegularProcedureInfo = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const [message, setMessage] = useState<MessageType | null>();
  const [viewHistory, setViewHistory] = useState(false);

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
    });
  };
  if (!message)
    return (
      <div className="message-page-loader">
        <LoaderForComponent />
      </div>
    );

  const mainReceiver = message.users.find(
    ({ user, status, role, type }) =>
      user.id === userSessionId &&
      status &&
      role === 'MAIN' &&
      type == 'RECEIVER'
  );

  const handleSaveRegister = () => {
    navigate('/tramites/tramite-regular?refresh=true');
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

  const handleDoneProcedure = () => {
    axiosInstance.patch(`/mail/${messageId}/done`).then(handleSaveRegister);
  };

  const initialSender = message.initialSender.user;
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
          {mainReceiver && (
            <FormRegisterProcedure
              type={'regularProcedure'}
              submit={data => onSubmit(data)}
            />
          )}
          {userSessionId === initialSender.id && (
            <Button
              text="Finalizar tramite"
              onClick={handleDoneProcedure}
              styleButton={3}
            />
          )}
        </div>
      )}
      <div className="regularProcedureInfo  message-page-contain--left">
        <div className="regularProcedureInfo-header-content ">
          <IconAction icon="close" onClick={handleClose} />
          <div className="regularProcedureInfo-sender-info-details">
            <div className="message-sender-info">
              <IconAction icon="user-sender" position="none" />
              <span className="message-sender-name">
                Tramite de :{' '}
                <b>
                  {initialSender.profile.firstName}{' '}
                  {initialSender.profile.lastName}
                </b>{' '}
              </span>
              <span className="message-date-send">
                {formatDateHourLongSpanish(message.createdAt)}
              </span>
            </div>
            <span
              className={`message-card-status-message message-status-${message.status}`}
            >
              {TYPE_STATUS_REGULAR_PROCEDURA[message.status]}
            </span>
          </div>
        </div>
        <div className="regularProcedureInfo-main">
          <ProcedureHistory
            messageHistory={message}
            userMessage={initialSender.profile}
          />
          {message?.history.length > 0 && (
            <div className="regularProcedureInfo-btn-expand">
              <Button
                className={`message-view-more-files-${viewHistory}`}
                text={`${viewHistory ? 'Ocultar' : 'Ver'} documentos recibidos`}
                icon="down"
                onClick={handleViewHistory}
              />
            </div>
          )}
          <div className="message-container-files-grid">
            {viewHistory &&
              [...message?.history]
                .reverse()
                .map(history => (
                  <ProcedureHistory
                    messageHistory={history}
                    key={history.id}
                    userMessage={history.user.profile}
                  />
                ))}
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default RegularProcedureInfo;
