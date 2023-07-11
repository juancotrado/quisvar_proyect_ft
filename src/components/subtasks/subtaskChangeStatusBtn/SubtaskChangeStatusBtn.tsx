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
import { DataFeedback, StatusType } from '../../../types/types';

interface SubtaskChangeStatusBtn {
  subtaskStatus: StatusType;
  subtaskId: number;
  option: 'ASIG' | 'DENY';
  text: string;
  percentageRange?: number;
  type?: 'button' | 'submit' | 'reset' | undefined;
  files?: File[] | null;
  dataFeedback?: DataFeedback | null;
}

const SubtaskChangeStatusBtn = ({
  subtaskStatus,
  subtaskId,
  option,
  text,
  dataFeedback,
  percentageRange = 0,
  type,
  files,
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
    if (subtaskStatus === 'PROCESS' || subtaskStatus === 'DENIED') {
      if (files?.length) {
        const formdata = new FormData();
        const hasPdf = Array.from(files).some(
          file => file.type === 'application/pdf'
        );
        if (!hasPdf)
          return SnackbarUtilities.warning(
            'Asegurese de subir una archivo PDF antes.'
          );
        for (const file of files) {
          formdata.append('files', file);
        }
        await axiosInstance.post(
          `/files/uploads/${subtaskId}/?status=REVIEW`,
          formdata
        );
        const feedbackBody = {
          subTasksId: subtaskId,
        };
        await axiosInstance.post(`/feedbacks`, feedbackBody);
      } else {
        return SnackbarUtilities.warning(
          'Asegurese de subir una archivo  antes.'
        );
      }
    }
    if (option === 'DENY') {
      if (!dataFeedback?.comment)
        return SnackbarUtilities.warning(
          'Asegurese de escribir un comentario antes'
        );
      await axiosInstance.patch(`/feedbacks`, dataFeedback);
    }
    const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';
    const percentage = Number(percentageRange);
    const body = { ...getStatus(option, role, subtaskStatus), percentage };
    const resStatus = await axiosInstance.patch(
      `/subtasks/status/${subtaskId}`,
      body
    );
    socket.emit('client:update-subTask', resStatus.data);

    isOpenModal$.setSubject = false;
  };
  return (
    <Button
      text={text}
      className={`SubtaskChangeStatusBtn ${option}`}
      onClick={handleChangeStatus}
      type={type ? type : undefined}
    />
  );
};

export default SubtaskChangeStatusBtn;
