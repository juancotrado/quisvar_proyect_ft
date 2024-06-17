import { pdf } from '@react-pdf/renderer';
import { Button, Input, Select } from '../../../../../../components';
import './cardGenerateContract.css';
import ContractUserPdf from '../../pdfGenerator/contractUserPdf/ContractUserPdf';
import { useForm } from 'react-hook-form';
import { User } from '../../../../../../types';
import { ContractUser, PROFESSIONAL_SERVICE_LEVEL_DATA } from '../../models';
import { downloadBlob } from '../../../../../../utils';
import { FaBeer } from 'react-icons/fa';

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
        extractValue={({ id }) => id}
        renderTextField={({ value }) => value}
        styleVariant="secondary"
      />
      <h4 className="cardGenerateContract-subtitle">Fecha:</h4>
      <Input
        {...register('date', {
          valueAsDate: true,
        })}
        type="date"
        placeholder="Fecha"
        styleInput={2}
      />
      <h4 className="cardGenerateContract-subtitle">Number de Contrato:</h4>
      <Input
        {...register('numberContract', {
          valueAsNumber: true,
        })}
        type="number"
        placeholder="numero de contrato"
        styleInput={2}
      />
      <h4 className="cardGenerateContract-subtitle">Número de meses:</h4>

      <Input
        {...register('month', {
          valueAsNumber: true,
        })}
        type="number"
        placeholder="Meses"
        styleInput={2}
      />
      <h4 className="cardGenerateContract-subtitle">Número de proyectos:</h4>

      <Input
        {...register('projectNumber', {
          valueAsNumber: true,
        })}
        type="number"
        placeholder="Número de proyecto"
        styleInput={2}
      />

      <Button
        // icon="preview-pdf"
        text="Generar Contrato"
        styleButton={4}
        variant="outline"
      />
    </form>
  );
};

export default CardGenerateContract;
