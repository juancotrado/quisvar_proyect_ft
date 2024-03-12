import { Button } from '../../../../components';
import './cardRegisterProcedureGeneral.css';
import { ProcedureSubmit } from '../../../../types';
import { TYPE_PROCEDURE } from '../../pages/paymentProcessing/models';
import { FormRegisterProcedure } from '../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
import { INITIAL_VALUE_EDITOR, SnackbarUtilities } from '../../../../utils';

interface CardRegisterProcedureGeneralProps {
  onSave?: () => void;
  onClosing: () => void;
  type: 'comunication' | 'regularProcedure';
}

const CardRegisterProcedureGeneral = ({
  onClosing,
  onSave,
  type,
}: CardRegisterProcedureGeneralProps) => {
  const onSubmit = async (data: ProcedureSubmit) => {
    const { fileUploadFiles, values } = data;
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));
    formData.append('data', JSON.stringify(values));
    formData.append('category', typeProcedure.category);
    await axiosInstance.post(`/mail`, formData);
    SnackbarUtilities.success('Proceso exitoso ');
    onSave?.();
  };

  const typeProcedure = TYPE_PROCEDURE[type];
  return (
    <div className="inbox-send-container-main">
      <div className="imnbox-title">
        <h3 className="imbox-container-title">{typeProcedure?.title}</h3>

        <div className="imbox-container-options">
          <Button
            className="imbox-resize-icon"
            icon="close"
            onClick={onClosing}
          />
        </div>
      </div>
      <FormRegisterProcedure
        type={type}
        submit={data => onSubmit(data)}
        initValueEditor={INITIAL_VALUE_EDITOR}
      />
    </div>
  );
};

export default CardRegisterProcedureGeneral;
