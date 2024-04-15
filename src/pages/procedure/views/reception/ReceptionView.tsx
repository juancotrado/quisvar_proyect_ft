import { useEffect, useState } from 'react';
import './receptionView.css';
import { Reception } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { CardReceptionHeader } from '../../components';
import { CardMessageReception } from '../../pages/paymentProcessing/components';
import { useNavigate } from 'react-router-dom';

const ReceptionView = () => {
  const [listReception, setListReception] = useState<Reception[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getReception();
  }, []);

  const getReception = async () => {
    const { data } = await axiosInstance.get<Reception[]>(`/paymail/holding`);
    setListReception(data);
  };

  const handleViewMessage = (id: number) => {
    navigate(`${id}`, { state: { isReception: true } });
  };
  const handleApprove = (id: number) => {
    const body = { ids: [id] };
    axiosInstance.put(`paymail/holding`, body).then(() => {
      getReception();
    });
  };
  return (
    <>
      <CardReceptionHeader />
      {listReception?.map(reception => (
        <CardMessageReception
          reception={reception}
          onClick={() => handleViewMessage(reception.id)}
          handleButton={handleApprove}
        />
      ))}
    </>
  );
};

export default ReceptionView;
