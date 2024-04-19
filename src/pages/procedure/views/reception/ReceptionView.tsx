import './receptionView.css';
import { Reception } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { CardReceptionHeader } from '../../components';
import { CardMessageReception } from '../../pages/paymentProcessing/components';
import { useNavigate } from 'react-router-dom';

interface ReceptionViewProps {
  listReception: Reception[];
  onSave: () => void;
}
const ReceptionView = ({ listReception, onSave }: ReceptionViewProps) => {
  const navigate = useNavigate();

  const handleViewMessage = (id: number) => {
    navigate(`${id}`, { state: { isReception: true } });
  };
  const handleApprove = (id: number) => {
    const body = { ids: [id] };
    axiosInstance.put(`paymail/holding`, body).then(() => {
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
