import { axiosInstance } from '../../../../services/axiosInstance';
import { MessageType } from '../../../../types/types';
import Button from '../../button/Button';
import ChipFileMessage from '../cardRegisterMessage/ChipFileMessage';

interface CardRegisterVoucherDenyOrAcceptProps {
  message: MessageType;
  onSave?: () => void;
}
const CardRegisterVoucherDenyOrAccept = ({
  message,
  onSave,
}: CardRegisterVoucherDenyOrAcceptProps) => {
  const handleDenyOrAccept = async (type: 'PAGADO' | 'FINALIZADO') => {
    axiosInstance.delete(`/mail/voucher/${message.id}?status=${type}`);
    onSave?.();
  };
  return (
    <div>
      {message.files?.map(file => (
        <ChipFileMessage
          key={file.id}
          className="message-files-list"
          text={file.name}
          link={file.path + '/' + file.name}
        />
      ))}
      <Button text="Aceptar" onClick={() => handleDenyOrAccept('PAGADO')} />
      <Button text="Denegar" onClick={() => handleDenyOrAccept('FINALIZADO')} />
    </div>
  );
};

export default CardRegisterVoucherDenyOrAccept;
