import { Button } from '../../../../../../../../components';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { MessageType } from '../../../../../../../../types';
import { ChipFileMessage } from '../../../../components';
import './cardRegisterVoucherDenyOrAccept.css';

interface CardRegisterVoucherDenyOrAcceptProps {
  message: MessageType;
  viewBotton?: boolean;
  onSave?: () => void;
}
const CardRegisterVoucherDenyOrAccept = ({
  message,
  viewBotton = true,
  onSave,
}: CardRegisterVoucherDenyOrAcceptProps) => {
  const handleDenyOrAccept = async (type: 'PAGADO' | 'FINALIZADO') => {
    axiosInstance.delete(`/paymail/voucher/${message.id}?status=${type}`);
    onSave?.();
  };

  const historyFiles = message.filesPay;
  const lastFile = historyFiles.pop();

  return (
    <div className="CardRegisterVoucherDenyOrAccept">
      <h3 className="cardRegisterVoucher-subTitle">DOCUMENTOS FINALES</h3>
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
      {historyFiles.length !== 0 && (
        <>
          <h4>Historial</h4>
          {historyFiles.map(history => (
            <div key={history.files[0].id}>
              {history.files.map(file => (
                <ChipFileMessage
                  key={file.id}
                  className="message-files-list"
                  text={file.name}
                  link={file.path + '/' + file.name}
                />
              ))}
              <hr />
            </div>
          ))}
        </>
      )}
      {viewBotton && (
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
      )}
    </div>
  );
};

export default CardRegisterVoucherDenyOrAccept;
