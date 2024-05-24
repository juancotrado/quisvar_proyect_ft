import { useNavigate, useParams } from 'react-router-dom';
import './regularProcedureInfo.css';
import { MessageType, ProcedureSubmit } from '../../../../../../types';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { IconAction, LoaderForComponent } from '../../../../../../components';
import { SnackbarUtilities } from '../../../../../../utils';
import { Resizable } from 're-resizable';
import { TYPE_STATUS_REGULAR_PROCEDURE } from '../../../paymentProcessing/models';
import { FormRegisterProcedure } from '../../../../components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { ProcedureMoreInfo } from '../../../../views/procedureMoreInfo';
import { CardProvied } from '../../../paymentProcessing/pages/message/views';
import { useRegularMail } from '../../hooks';
const RegularProcedureInfo = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const [message, setMessage] = useState<MessageType | null>();
  const [isProvied, setIsProvied] = useState(false);

  const { regularMailQuery } = useRegularMail();
  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const handleProvied = () => setIsProvied(!isProvied);

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
    regularMailQuery.refetch();
    navigate('/tramites/tramite-regular');
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
    axiosInstance.patch(`/mail/done/${messageId}`).then(handleSaveRegister);
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
            <>
              <div className="regularProcedureInfo-header">
                <IconAction
                  icon={isProvied ? 'seal-dark' : 'seal'}
                  size={1.2}
                  onClick={handleProvied}
                  position="none"
                />
              </div>
              {isProvied ? (
                <CardProvied
                  type={'regularProcedure'}
                  message={message}
                  onSave={handleClose}
                />
              ) : (
                <FormRegisterProcedure
                  type={'regularProcedure'}
                  submit={data => onSubmit(data)}
                  handleFinish={handleDoneProcedure}
                />
              )}
            </>
          )}
        </div>
      )}

      <ProcedureMoreInfo
        handleClose={handleClose}
        message={message}
        status={TYPE_STATUS_REGULAR_PROCEDURE[message.status]}
        userInitSender={
          initialSender.profile.firstName + ' ' + initialSender.profile.lastName
        }
      />
    </Resizable>
  );
};

export default RegularProcedureInfo;
