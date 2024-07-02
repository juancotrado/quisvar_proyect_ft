import { useCallback, useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import {
  MessageSendType,
  MessageStatus,
  MessageType,
  ProcedureSubmit,
} from '../../../../../../types';
import './messagePage.css';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SnackbarUtilities } from '../../../../../../utils';
import {
  Button,
  ButtonHeader,
  IconAction,
  LoaderForComponent,
} from '../../../../../../components';
import { useRole } from '../../../../../../hooks';
import { TYPE_STATUS } from '../../models';
import {
  CardProvied,
  CardRegisterVoucher,
  CardRegisterVoucherDenyOrAccept,
  GenerateOrderService,
} from './views';
import { HEADER_OPTION, SPRING } from './models';
import { FormRegisterProcedure } from '../../../../components';
import { isOpenConfirmAction$ } from '../../../../../../services/sharingSubject';
import { ProcedureMoreInfo } from '../../../../views/procedureMoreInfo';
import { userSelect } from '../../../../models';
import { usePayMail } from '../../hooks';

export const MessagePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { payMailQuery } = usePayMail();

  const { paymessageId } = useParams();
  const { hasAccess } = useRole('MOD', 'tramites', 'tramite-de-pago');
  const { state } = useLocation();
  const isReception: boolean = state?.isReception;
  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const [isReply, setIsReply] = useState(true);
  const [message, setMessage] = useState<MessageType | null>();
  const [isProvied, setIsProvied] = useState(false);
  const [procedureOption, setProcedureOption] = useState<'finish' | 'continue'>(
    'continue'
  );
  //----------------------------------------------------------------------------
  const getMessage = useCallback(
    (id: string) => {
      axiosInstance
        .get(`/paymail/${id}`, { params: searchParams })
        .then(res => {
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
    navigate('/tramites/tramite-de-pago?' + searchParams);
  };
  const toggleSwitch = () => setIsReply(!isReply);

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

  const handleSaveRegister = () => {
    payMailQuery.refetch();
    navigate('/tramites/tramite-de-pago');
  };
  //---------------------------------------------------------------------
  const officeId = searchParams.get('officeId');
  //---------------------------------------------------------------------
  const isUserInitMessage =
    userSessionId === message.userInit?.userId && !officeId;

  const handleOptionSelect = (option: 'continue' | 'finish') =>
    setProcedureOption(option);

  const handleProvied = () => setIsProvied(!isProvied);

  const onSubmit = async (data: ProcedureSubmit) => {
    const { fileUploadFiles, values, mainFile } = data;
    const body = { ...values, paymessageId: message.id };
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    formData.append('data', JSON.stringify(body));
    formData.append('mainProcedure', mainFile, values.title + '.pdf');
    axiosInstance
      .post(
        `/paymail/reply?status=${isReply ? 'PROCESO' : 'RECHAZADO'}`,
        formData,
        { headers }
      )
      .then(() => {
        SnackbarUtilities.success('Proceso exitoso ');
        handleSaveRegister();
      });
  };

  const onCorrectMessage = async (data: ProcedureSubmit) => {
    const { fileUploadFiles, values, mainFile } = data;
    const body = { ...values };

    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('mainProcedure', mainFile, values.title + '.pdf');
    formData.append('data', JSON.stringify(body));
    await axiosInstance.put(`/paymail/${paymessageId}`, formData);
    SnackbarUtilities.success('Tramite enviado');
    handleSaveRegister();
  };

  const onDeclineMessage = (data: ProcedureSubmit, type: MessageStatus) => {
    if (type === 'RECHAZADO') {
      onSubmit(data);
    }
    if (type === 'OBSERVADO') {
      onCorrectMessage(data);
    }
  };

  const getInitValuesForForm = (): MessageSendType => {
    const { header, title, type } = message;

    return {
      header,
      title,
      description: '',
      type,
      signature: false,
    };
  };

  const transformDescriptionValues = () => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = message.description;
    const elementDescription = tempElement.querySelector('.main-body');

    return elementDescription?.innerHTML || '';
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

  const getHistoryContacts = () => {
    const contacts: userSelect[] = users.map(
      ({ user: { id, profile, address, ruc } }) => ({
        value: 'user-' + id,
        label: profile.firstName + ' ' + profile.lastName,
        address: address,
        profile: profile,
        ruc: ruc,
        id: id,
      })
    );

    return contacts;
  };
  const { firstName, lastName } = message.userInit?.user.profile;

  return (
    <div className={`message-page-container `}>
      {message.status === 'OBSERVADO' && (
        <IconAction icon="close" onClick={handleClose} />
      )}

      {!isReception && message.status !== 'ARCHIVADO' && (
        <>
          {message.status === 'PAGADO' && (
            <div className="message-page-contain message-page-contain--right">
              <CardRegisterVoucherDenyOrAccept
                message={message}
                onSave={handleSaveRegister}
                viewBotton={false}
              />
            </div>
          )}
          {(mainReceiver || mainReceiverFinish) &&
            message.status !== 'PAGADO' && (
              <div className="message-page-contain message-page-contain--right">
                {hasAccess &&
                  !['FINALIZADO', 'POR_PAGAR', 'OBSERVADO'].includes(
                    message.status
                  ) && (
                    <div className="message-header-content-options  ">
                      {HEADER_OPTION.map(({ procedureOpt, text }) => (
                        <ButtonHeader
                          key={procedureOpt}
                          isActive={procedureOption === procedureOpt}
                          text={text}
                          onClick={() => handleOptionSelect(procedureOpt)}
                        />
                      ))}
                      {procedureOption === 'continue' && (
                        <IconAction
                          icon={isProvied ? 'seal-dark' : 'seal'}
                          size={1.2}
                          onClick={handleProvied}
                        />
                      )}
                    </div>
                  )}
                {procedureOption === 'continue' ? (
                  isProvied ? (
                    <CardProvied
                      type={'payProcedure'}
                      message={message}
                      onSave={handleClose}
                    />
                  ) : (
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
                              <span className="message-hover-title">
                                NO PROCEDE
                              </span>
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
                              <span className="message-hover-title">
                                PROCEDE
                              </span>
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
                              optionalContacs={
                                hasAccess && !isReply && getHistoryContacts()
                              }
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
                      {isUserInitMessage &&
                        ['RECHAZADO', 'OBSERVADO'].includes(message.status) && (
                          <FormRegisterProcedure
                            type={'payProcedure'}
                            submit={data =>
                              onDeclineMessage(data, message.status)
                            }
                            showAddUser={message.status === 'OBSERVADO'}
                            initValues={getInitValuesForForm()}
                            initValueEditor={transformDescriptionValues()}
                          />
                        )}
                    </>
                  )
                ) : (
                  <GenerateOrderService
                    message={message}
                    onSave={handleSaveRegister}
                  />
                )}
              </div>
            )}
        </>
      )}
      {!['OBSERVADO'].includes(message.status) && (
        <ProcedureMoreInfo
          handleClose={handleClose}
          message={message}
          status={TYPE_STATUS[message.status]}
          userInitSender={firstName + ' ' + lastName}
        />
      )}
    </div>
  );
};
