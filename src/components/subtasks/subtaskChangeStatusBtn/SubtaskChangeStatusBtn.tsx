import { useSelector } from 'react-redux';
import Button from '../../shared/button/Button';
import { statusBody } from '../../shared/card/cardTaskInformation/constans';
import { RootState } from '../../../store';
import { SnackbarUtilities } from '../../../utils/SnackbarManager';
import { useContext } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import { isOpenModal$ } from '../../../services/sharingSubject';
import { SocketContext } from '../../../context/SocketContex';
import './subtaskChangeStatusBtn.css';

interface SubtaskChangeStatusBtn {
  subtaskStatus: string;
  subtaskId: number;
  option: 'ASIG' | 'DENY';
  text: string;
  requirePdf?: boolean;
  percentage?: number;
}

const SubtaskChangeStatusBtn = ({
  subtaskStatus,
  subtaskId,
  option,
  text,
  requirePdf = false,
  percentage,
}: SubtaskChangeStatusBtn) => {
  const { userSession } = useSelector((state: RootState) => state);
  const socket = useContext(SocketContext);

  const getStatus = (
    category: string,
    role: string,
    state: string
  ): { status: string } | undefined => {
    return statusBody[category]?.[role]?.[state];
  };
  const handleChangeStatus = async () => {
    const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';
    const hasPdf = localStorage.getItem('hasPdf');
    const body = { ...getStatus(option, role, subtaskStatus), percentage };
    if (hasPdf && !JSON.parse(hasPdf) && requirePdf)
      return SnackbarUtilities.warning(
        'Asegurese de subir una archivo PDF antes.'
      );

    if (!body) return;

    const resStatus = await axiosInstance.patch(
      `/subtasks/status/${subtaskId}`,
      body
    );
    socket.emit('client:update-subTask', resStatus.data);
    localStorage.setItem('hasPdf', JSON.stringify(false));

    isOpenModal$.setSubject = false;
  };
  return (
    <Button
      text={text}
      className={`SubtaskChangeStatusBtn ${option}`}
      onClick={handleChangeStatus}
    />
  );
};

export default SubtaskChangeStatusBtn;
