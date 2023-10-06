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
      <ChipFileMessage
        className="message-files-list"
        text={'voucher'}
        link={message.voucher}
      />
      <Button text="Aceptar" onClick={() => handleDenyOrAccept('PAGADO')} />
      <Button text="Denegar" onClick={() => handleDenyOrAccept('FINALIZADO')} />
    </div>
  );
};

export default CardRegisterVoucherDenyOrAccept;
