import './cardRegisterMessage.css';
import { ProcedureSubmit } from '../../../../../../types';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { Button } from '../../../../../../components';
import {
  INITIAL_VALUE_EDITOR,
  SnackbarUtilities,
} from '../../../../../../utils';
import { FormRegisterProcedure } from '../../../../components';

interface CardRegisterMessageProps {
  onClosing?: () => void;
  onSave?: () => void;
}

const CardRegisterMessage = ({
  onClosing,
  onSave,
}: CardRegisterMessageProps) => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const onSubmit = async (data: ProcedureSubmit) => {
    const { fileUploadFiles, values, mainFile } = data;
    const body = { ...values, senderId: userSession.id };

    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('mainProcedure', mainFile, values.title + '.pdf');
    formData.append('data', JSON.stringify(body));
    await axiosInstance.post(`/paymail`, formData);
    SnackbarUtilities.success('Proceso exitoso ');
    handleSave();
  };
  const handleSave = () => {
    onSave?.();
    handleClose();
  };

  const handleClose = () => {
    onClosing?.();
  };

  return (
    <motion.div className="inbox-send-container-main">
      <div className="imnbox-title">
        <h3 className="imbox-container-title">Nuevo Trámite</h3>

        <div className="imbox-container-options">
          <Button
            className="imbox-resize-icon"
            icon="close"
            onClick={handleClose}
          />
        </div>
      </div>
      <FormRegisterProcedure
        type={'payProcedure'}
        showReportBtn
        submit={data => onSubmit(data)}
        initValueEditor={INITIAL_VALUE_EDITOR}
      />
    </motion.div>
  );
};

export default CardRegisterMessage;
