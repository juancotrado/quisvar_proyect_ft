import { pdf } from '@react-pdf/renderer';
import { Input, Select } from '../../../../../../components';
import './cardGenerateContract.css';
import ContractUserPdf from '../../pdfGenerator/contractUserPdf/ContractUserPdf';
import { useForm } from 'react-hook-form';
import { User } from '../../../../../../types';
import { ContractUser, PROFESSIONAL_SERVICE_LEVEL_DATA } from '../../models';
import { downloadBlob } from '../../../../../../utils';

interface CardGenerateContractProps {
  user: User;
}

const CardGenerateContract = ({ user }: CardGenerateContractProps) => {
  const { register, handleSubmit } = useForm<ContractUser>();

  const contractDownload = async (values: ContractUser) => {
    const contractData = { ...values, ...user };
    const pdfComponent = await pdf(
      ContractUserPdf({ data: contractData })
    ).toBlob();
    downloadBlob(
      pdfComponent,
      `Contrato-${user.profile.firstName} ${user.profile.lastName}.pdf`
    );
  };
  return (
    <form
      onSubmit={handleSubmit(contractDownload)}
      className="cardGenerateContract"
    >
      <h2 className="cardGenerateContract-title">Generar Contrato </h2>
      <h4 className="cardGenerateContract-subtitle">Nivel profesional:</h4>
      <Select
        {...register('professionalLevel', {
          valueAsNumber: true,
        })}
        data={PROFESSIONAL_SERVICE_LEVEL_DATA}
        itemKey="id"
        textField="value"
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
      <button className="generateOrderService-preview-pdf">
        <figure className="cardRegisteVoucher-figure">
          <img src={`/svg/preview-pdf.svg`} />
        </figure>
        Generar Contrato
      </button>
    </form>
  );
};

export default CardGenerateContract;