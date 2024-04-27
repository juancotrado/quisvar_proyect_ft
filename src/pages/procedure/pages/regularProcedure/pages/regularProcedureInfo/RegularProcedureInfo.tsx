import { useNavigate, useParams } from 'react-router-dom';
import './regularProcedureInfo.css';
import { MessageType, ProcedureSubmit } from '../../../../../../types';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { Button, LoaderForComponent } from '../../../../../../components';
import { SnackbarUtilities } from '../../../../../../utils';
import { Resizable } from 're-resizable';
import { TYPE_STATUS_REGULAR_PROCEDURA } from '../../../paymentProcessing/models';
import { FormRegisterProcedure } from '../../../../components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { ProcedureMoreInfo } from '../../../../views/procedureMoreInfo';
const RegularProcedureInfo = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const [message, setMessage] = useState<MessageType | null>();
  // const [viewHistory, setViewHistory] = useState(false);

  // const handleViewHistory = () => setViewHistory(!viewHistory);
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
    const { fileUploadFiles, values, mainFile } = data;
    const { header, receiverId, title, description } = values;
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('mainProcedure', mainFile, values.title + '.pdf');
    formData.append(
      'data',
      JSON.stringify({ header, receiverId, title, description })
    );
    axiosInstance
      .post(`/mail/${messageId}/reply?status=PENDIENTE`, formData)
      .then(() => {
        SnackbarUtilities.success('Proceso exitoso ');
        handleSaveRegister();
      });
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

      <ProcedureMoreInfo
        handleClose={handleClose}
        message={message}
        status={TYPE_STATUS_REGULAR_PROCEDURA[message.status]}
        userInitSender={
          initialSender.profile.firstName + ' ' + initialSender.profile.lastName
        }
      />
    </Resizable>
  );
};

export default RegularProcedureInfo;
