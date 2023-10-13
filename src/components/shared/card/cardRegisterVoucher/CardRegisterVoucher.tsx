import { useState } from 'react';
import './cardRegisterVoucher.css';
import ChipFileMessage from '../cardRegisterMessage/ChipFileMessage';
import InputFile from '../../Input/InputFile';
import Button from '../../button/Button';
import { axiosInstance } from '../../../../services/axiosInstance';
import { MessageType } from '../../../../types/types';

interface CardRegisterVoucherProps {
  message: MessageType;
  onSave?: () => void;
}

const CardRegisterVoucher = ({ message, onSave }: CardRegisterVoucherProps) => {
  const [fileUploadFile, setFileUploadFile] = useState<File | null>(null);
  const addFiles = (newFiles: File) => {
    if (!fileUploadFile) setFileUploadFile(newFiles);
  };

  const deleteFiles = () => setFileUploadFile(null);

  const handleSendVoucher = async () => {
    if (!fileUploadFile) return;
    const formData = new FormData();
    formData.append('voucher', fileUploadFile);
    await axiosInstance.patch(`/mail/voucher/${message.id}`, formData);
    onSave?.();
  };
  return (
    <div>
      {fileUploadFile && (
        <div className="inbox-container-file-grid">
          <ChipFileMessage
            className="message-files-list"
            text={fileUploadFile.name}
            onClose={() => deleteFiles()}
          />
        </div>
      )}
      {!fileUploadFile && (
        <InputFile
          className="message-file-area"
          getFilesList={files => addFiles(files[0])}
        />
      )}
      <Button onClick={handleSendVoucher} text="Enviar RC" />
    </div>
  );
};

export default CardRegisterVoucher;
