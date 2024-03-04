/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { MessageType, ProcedureSubmit } from '../../../../../../types';
import './messagePage.css';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { formatDateHourLongSpanish } from '../../../../../../utils';
import {
  Button,
  ButtonHeader,
  IconAction,
  LoaderForComponent,
} from '../../../../../../components';
import { useRole } from '../../../../../../hooks';
import { TYPE_STATUS } from '../../models';
import {
  CardRegisterMessageUpdate,
  CardRegisterVoucher,
  CardRegisterVoucherDenyOrAccept,
  GenerateOrderService,
} from './views';
import { HEADER_OPTION, SPRING } from './models';
import { Resizable } from 're-resizable';
import {
  FormRegisterProcedure,
  ProcedureHistory,
} from '../../../../components';
import { isOpenConfirmAction$ } from '../../../../../../services/sharingSubject';

export const MessagePage = () => {
  const navigate = useNavigate();
  const { paymessageId } = useParams();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');

  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const [isReply, setIsReply] = useState(true);
  const [message, setMessage] = useState<MessageType | null>();
  const [viewHistory, setViewHistory] = useState(false);
  const [procedureOption, setProcedureOption] = useState<'finish' | 'continue'>(
    'continue'
  );
  //----------------------------------------------------------------------------
  const getMessage = useCallback(
    (id: string) => {
      axiosInstance.get(`/paymail/${id}`).then(res => {
        setMessage(res.data);
      });
    },
    [userSessionId]
  );
  useEffect(() => {
    if (paymessageId && userSessionId) getMessage(paymessageId);
    return () => setMessage(null);
  }, [getMessage, paymessageId, userSessionId]);

  const handleClose = () => {
    navigate('/tramites/tramite-de-pago');
  };
  const toggleSwitch = () => setIsReply(!isReply);
  const handleViewHistory = () => setViewHistory(!viewHistory);

  if (!message)
    return (
      <div className="message-page-loader">
        <LoaderForComponent />
      </div>
    );

  const { users } = message;

  const mainReceiver = users.find(
    ({ user, status, role, type }) =>
      user.id === userSessionId &&
      status &&
      role === 'MAIN' &&
      type == 'RECEIVER'
  );
  const mainReceiverFinish = users.some(
    ({ user, role, type }) =>
      user.id === userSessionId && role === 'MAIN' && type == 'RECEIVER'
  );
  // console.log({ mainReceiverFinish });

  const handleSaveRegister = () => {
    navigate('/tramites/tramite-de-pago?refresh=true');
  };
  const isUserInitMessage = userSessionId === message.userInit.userId;
  const handleOptionSelect = (option: 'continue' | 'finish') =>
    setProcedureOption(option);
  const onSubmit = async (data: ProcedureSubmit) => {
    const { fileUploadFiles, values } = data;
    const body = { ...values, paymessageId: message.id };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(body));
    axiosInstance
      .post(
        `/paymail/reply?status=${isReply ? 'PROCESO' : 'RECHAZADO'}`,
        formData
      )
      .then(handleSaveRegister);
  };
  const handleArchiverMessage = () => {
    axiosInstance
      .patch(`/paymail/archived/${message.id}`)
      .then(handleSaveRegister);
  };
  const handleArchiver = () => {
    isOpenConfirmAction$.setSubject = {
      isOpen: true,
      function: () => handleArchiverMessage,
    };
  };
  return (
    <Resizable
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: true,
      }}
      maxWidth={'73%'}
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
                    <FormRegisterProcedure
                      type={'payProcedure'}
                      submit={data => onSubmit(data)}
                      showAddUser={false}
                    />
                    {hasAccess && !isReply && (
                      <Button
                        onClick={handleArchiver}
                        styleButton={2}
                        type="button"
                        text="Archivar Tramite"
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

      <div className="regularProcedureInfo  message-page-contain--left">
        <div className="regularProcedureInfo-header-content ">
          <IconAction icon="close" onClick={handleClose} />
          <div className="regularProcedureInfo-sender-info-details">
            <div className="message-sender-info">
              <IconAction icon="user-sender" position="none" />
              <span className="message-sender-name">
                Tramite de :{' '}
                <b>
                  {message.userInit.user.profile.firstName}{' '}
                  {message.userInit.user.profile.lastName}
                </b>{' '}
              </span>
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
        <div className="regularProcedureInfo-main">
          <ProcedureHistory
            messageHistory={message}
            userMessage={message.userInit.user.profile}
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
