import { useState } from 'react';
import './cardRegisterVoucher.css';
import ChipFileMessage from '../cardRegisterMessage/ChipFileMessage';
import InputFile from '../../Input/InputFile';
import Button from '../../button/Button';
import { axiosInstance } from '../../../../services/axiosInstance';
import { MessageType } from '../../../../types/types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ServiceOrderPdf } from '../../serviceOrderPdf/ServiceOrderPdf';
import {
  addFilesList,
  deleteFileOnList,
} from '../../../../utils/files/files.utils';
import ReceiptOfPaymentPdf from '../../receiptOfPaymentPdf/ReceiptOfPaymentPdf';

interface CardRegisterVoucherProps {
  message: MessageType;
  onSave?: () => void;
}

const CardRegisterVoucher = ({ message, onSave }: CardRegisterVoucherProps) => {
  const [fileUploadFiles, setFileUploadFiles] = useState<File[]>([]);
  const addFiles = (newFiles: File[]) => {
    const _files = addFilesList(fileUploadFiles, newFiles);
    setFileUploadFiles(_files);
  };

  const deleteFiles = (delFiles: File) => {
    const _files = deleteFileOnList(fileUploadFiles, delFiles);
    if (_files) setFileUploadFiles(_files);
  };

  const handleSendVoucher = async () => {
    if (!fileUploadFiles.length) return;
    const formData = new FormData();
    fileUploadFiles.forEach(_file => formData.append('fileMail', _file));

    await axiosInstance.patch(`/mail/voucher/${message.id}`, formData);
    onSave?.();
  };
  const dataServiceOrder = JSON.parse(message.paymentPdfData);
  return (
    <div className="cardRegisterVoucher-container">
      <h3 className="cardRegisterVoucher-subTitle">
        FIRMA Y SUBA SUS DOCUMENTOS:
      </h3>
      <PDFDownloadLink
        document={<ServiceOrderPdf data={dataServiceOrder} />}
        fileName={`asdasdS.pdf`}
        className="cardRegisteVoucher-service-orden"
      >
        <div className="cardRegisterVoucher-options">
          <figure className="cardRegisteVoucher-figure">
            <img src={`/svg/payment-pdf.svg`} />
          </figure>
          Descargar Orden de Servicio sin firmar
        </div>
        <figure className="cardRegisteVoucher-figure">
          <img src={`/svg/download_icon.svg`} />
        </figure>
      </PDFDownloadLink>
      <PDFDownloadLink
        document={<ReceiptOfPaymentPdf data={dataServiceOrder} />}
        fileName={`asdasdS.pdf`}
        className="cardRegisteVoucher-service-orden"
      >
        <div className="cardRegisterVoucher-options">
          <figure className="cardRegisteVoucher-figure">
            <img src={`/svg/payment-pdf.svg`} />
          </figure>
          Descargar Recibo de Pago sin firmar
        </div>
        <figure className="cardRegisteVoucher-figure">
          <img src={`/svg/download_icon.svg`} />
        </figure>
      </PDFDownloadLink>

      <h3 className="cardRegisterVoucher-subTitle">
        Suba su recibo por honorarios y su orden de servicios firmado:
      </h3>
      <div className="cardRegisterVoucher-file-options">
        <InputFile
          className="message-file-area"
          getFilesList={files => addFiles(files)}
        />
      </div>
      {fileUploadFiles.length > 0 && (
        <div className="inbox-container-file-grid">
          {fileUploadFiles.map((file, i) => (
            <ChipFileMessage
              className="message-files-list"
              text={file.name}
              key={i}
              onClose={() => deleteFiles(file)}
            />
          ))}
        </div>
      )}
      <Button onClick={handleSendVoucher} text="Enviar RC" />
    </div>
  );
};

export default CardRegisterVoucher;
