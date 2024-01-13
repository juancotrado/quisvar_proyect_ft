import { axiosInstance } from '../../../../services/axiosInstance';
import { MessageType } from '../../../../types/types';
import Button from '../../../button/Button';
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

  const historyFiles = message.filesPay;
  const lastFile = historyFiles.pop();

  return (
    <div className="CardRegisterVoucherDenyOrAccept">
      <h3 className="cardRegisterVoucher-subTitle">
        FIRMA Y SUBA SUS DOCUMENTOS:
      </h3>
      <h3 className="cardRegisterVoucher-subTitle">
        Recibo por honorarios y Orden de servicio firmados
      </h3>

      <h4>Ultimo Archivo</h4>
      {lastFile?.files.map(file => (
        <ChipFileMessage
          key={file.id}
          className="message-files-list"
          text={file.name}
          link={file.path + '/' + file.name}
        />
      ))}
      <h4>Historial</h4>
      {historyFiles.map(history => (
        <>
          {history.files.map(file => (
            <ChipFileMessage
              key={file.id}
              className="message-files-list"
              text={file.name}
              link={file.path + '/' + file.name}
            />
          ))}
          <hr />
        </>
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
