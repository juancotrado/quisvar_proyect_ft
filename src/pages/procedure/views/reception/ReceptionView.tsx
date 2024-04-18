import { useEffect, useState } from 'react';
import './receptionView.css';
import { Reception } from '../../models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { CardReceptionHeader } from '../../components';
import { CardMessageReception } from '../../pages/paymentProcessing/components';
import { useNavigate } from 'react-router-dom';
import { MessageStatus, MessageTypeImbox } from '../../../../types';

interface ReceptionViewProps {
  officeMsg: string | null;
  statusMsg: MessageStatus | null;
  typeMsg: MessageTypeImbox | null;
  holdingReception: 'yes' | 'no';
}
const ReceptionView = ({
  officeMsg,
  statusMsg,
  typeMsg,
  holdingReception,
}: ReceptionViewProps) => {
  const [listReception, setListReception] = useState<Reception[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getReception();
  }, [officeMsg, statusMsg, typeMsg, holdingReception]);

  const getReception = async () => {
    const officeId = officeMsg ? `&officeId=${officeMsg}` : '';
    const status = statusMsg ? `&status=${statusMsg}` : '';
    const typeMessage = typeMsg ? `&typeMessage=${typeMsg}` : '';
    const onHolding = holdingReception
      ? `&onHolding=${holdingReception === 'yes'}`
      : '';
    const { data } = await axiosInstance.get<Reception[]>(
      `/paymail/holding?${officeId}${status}${typeMessage}${onHolding}`
    );
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
