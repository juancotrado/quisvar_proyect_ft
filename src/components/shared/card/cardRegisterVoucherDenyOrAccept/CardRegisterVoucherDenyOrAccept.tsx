import { axiosInstance } from '../../../../services/axiosInstance';
import { MessageType } from '../../../../types/types';
import Button from '../../button/Button';
import ChipFileMessage from '../cardRegisterMessage/ChipFileMessage';
import './cardRegisterVoucherDenyOrAccept.css';
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
    <div className="CardRegisterVoucherDenyOrAccept">
      <h3 className="cardRegisterVoucher-subTitle">
        FIRMA Y SUBA SUS DOCUMENTOS:
      </h3>
      <h3 className="cardRegisterVoucher-subTitle">
        Recibo por honorarios y Orden de servicio firmados
      </h3>
      {message.filesPay[0].files?.map(file => (
        <ChipFileMessage
          key={file.id}
          className="message-files-list"
          text={file.name}
          link={file.path + '/' + file.name}
        />
      ))}
      <div className="CardRegisterVoucherDenyOrAccept-btns">
        <Button
          text="Aceptar"
          className="messagePage-btn-submit"
          icon="check-white"
          imageStyle="CardRegisterVoucherDenyOrAccept-icon"
          onClick={() => handleDenyOrAccept('PAGADO')}
        />
        <Button
          text="Denegar"
          className="messagePage-btn-submit  btn-submit--red"
          imageStyle="CardRegisterVoucherDenyOrAccept-icon"
          icon="close-white"
          onClick={() => handleDenyOrAccept('FINALIZADO')}
        />
      </div>
    </div>
  );
};

export default CardRegisterVoucherDenyOrAccept;
