import './receptionView.css';
import { Reception, TypeProcedure } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { CardReceptionHeader } from '../../components';
import { CardMessageReception } from '../../pages/paymentProcessing/components';
import { useNavigate } from 'react-router-dom';
import { TYPE_PROCEDURE } from '../../pages/paymentProcessing/models';
import { SnackbarUtilities } from '../../../../utils';

interface ReceptionViewProps {
  listReception: Reception[];
  type: TypeProcedure;
  onSave: () => void;
}
const ReceptionView = ({ listReception, onSave, type }: ReceptionViewProps) => {
  const navigate = useNavigate();

  const handleViewMessage = (id: number) => {
    navigate(`${id}`, { state: { isReception: true } });
  };
  const handleApprove = (id: number) => {
    const body = { ids: [id] };
    axiosInstance
      .put(`${TYPE_PROCEDURE[type].provied}/holding`, body)
      .then(() => {
        SnackbarUtilities.success('Tramite aprobado exitosamente');
        onSave();
      });
  };
  return (
    <>
      <CardReceptionHeader />
      {listReception?.map(reception => (
        <CardMessageReception
          key={reception.id}
          reception={reception}
          onClick={() => handleViewMessage(reception.id)}
          handleButton={handleApprove}
        />
      ))}
    </>
  );
};

export default ReceptionView;
