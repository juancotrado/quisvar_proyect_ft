import { PDFDownloadLink } from '@react-pdf/renderer';
import { Input } from '../../../../components';
import './cardGenerateContract.css';
import ContractUserPdf from '../../pdfGenerator/contractUserPdf/ContractUserPdf';
import { useForm } from 'react-hook-form';
import { ContractUser } from '../..';
import { User } from '../../../../types';

interface CardGenerateContractProps {
  user: User;
}

const CardGenerateContract = ({ user }: CardGenerateContractProps) => {
  const { register, watch } = useForm<ContractUser>();

  const contractData = { ...watch(), ...user };
  console.log(watch());
  return (
    <div className="cardGenerateContract">
      <h2 className="cardGenerateContract-title">Generar Contrato </h2>
      <h4 className="cardGenerateContract-subtitle">Numero de Contrato:</h4>
      <Input
        {...register('numberContract', {
          valueAsNumber: true,
        })}
        type="number"
        placeholder="Numero de Contrato"
        className="generalData-edit-info-input"
      />
      <h4 className="cardGenerateContract-subtitle">Servicio profesional:</h4>
      <Input
        {...register('professionalService')}
        type="text"
        placeholder="Servicio profesional"
        className="generalData-edit-info-input"
      />
      <h4 className="cardGenerateContract-subtitle">Monto contractual:</h4>
      <Input
        {...register('contractualAmount', {
          valueAsNumber: true,
        })}
        name="contractualAmount"
        type="number"
        placeholder="Monto contractual "
        className="generalData-edit-info-input"
      />
      <h4 className="cardGenerateContract-subtitle">Fecha:</h4>
      <Input
        {...register('date', {
          valueAsDate: true,
        })}
        type="date"
        placeholder="Fecha"
        className="generalData-edit-info-input"
      />
      <PDFDownloadLink
        document={<ContractUserPdf data={contractData} />}
        fileName={`Declaracion-Jurada.pdf`}
        className="generateOrderService-preview-pdf"
      >
        <figure className="cardRegisteVoucher-figure">
          <img src={`/svg/preview-pdf.svg`} />
        </figure>
        Generar Contrato
      </PDFDownloadLink>
    </div>
  );
};

export default CardGenerateContract;
