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
import { Resizable } from 're-resizable';
import { FormRegisterProcedure } from '../../../../components';
import { isOpenConfirmAction$ } from '../../../../../../services/sharingSubject';
import { ProcedureMoreInfo } from '../../../../views/procedureMoreInfo';
import { userSelect } from '../../../../models';

export const MessagePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const officeMsg = searchParams.get('officeId');
  const officeId = officeMsg ? `&officeId=${officeMsg}` : '';
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
      if (officeMsg && isNaN(+officeMsg)) {
        navigate('/tramites/tramite-de-pago');
      } else {
        axiosInstance.get(`/paymail/${id}?${officeId}`).then(res => {
          setMessage(res.data);
        });
      }
    },
    [userSessionId, officeMsg]
  );
  useEffect(() => {
    if (paymessageId && userSessionId) getMessage(paymessageId);
    return () => setMessage(null);
  }, [getMessage, paymessageId, userSessionId]);

  const handleClose = () => {
    navigate('/tramites/tramite-de-pago');
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
    navigate('/tramites/tramite-de-pago?refresh=' + Date.now());
  };

  const isUserInitMessage = userSessionId === message.userInit.userId;

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
  const { firstName, lastName } = message.userInit.user.profile;

  return (
    <Resizable
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: true,
      }}
      maxWidth={'60%'}
      minWidth={'50%'}
      className={`message-page-container `}
    >
      {!isReception && message.status !== 'ARCHIVADO' && (
        <>
          {message.status === 'PAGADO' && (
            <div className="message-page-contain message-page-contain--right">
              <div className="message-page-finish">
                <h2>Tramite Finalizado</h2>
              </div>
            </div>
          )}
          {(mainReceiver || mainReceiverFinish) &&
            message.status !== 'PAGADO' && (
              <div className="message-page-contain message-page-contain--right">
                {hasAccess &&
                  message.status !== 'FINALIZADO' &&
                  message.status !== 'POR_PAGAR' && (
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
                      {isUserInitMessage && message.status === 'RECHAZADO' && (
                        <FormRegisterProcedure
                          type={'payProcedure'}
                          submit={data => onSubmit(data)}
                          showAddUser={false}
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
      <ProcedureMoreInfo
        handleClose={handleClose}
        message={message}
        status={TYPE_STATUS[message.status]}
        userInitSender={firstName + ' ' + lastName}
      />
    </Resizable>
  );
};
