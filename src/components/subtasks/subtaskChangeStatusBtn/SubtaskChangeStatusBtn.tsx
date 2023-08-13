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
  isAssignedAdminTask?: boolean;
  subtaskStatus: StatusType;
  subtaskId: number;
  className?: string;
  option: 'ASIG' | 'DENY';
  text: string;
  type: 'sendToReview' | 'deprecated' | 'approved' | 'assigned' | 'liquidate';
  porcentagesForUser?: { userid: number; percentage: number }[];
  files?: File[] | null;
  dataFeedback?: DataFeedback | null;
  isAuthorizedUser?: boolean;
}

const SubtaskChangeStatusBtn = ({
  subtaskStatus,
  subtaskId,
  option,
  text,
  type,
  dataFeedback,
  className,
  files,
  isAssignedAdminTask,
  porcentagesForUser,
  isAuthorizedUser,
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

  const handleEditStatus = async () => {
    const role = isAuthorizedUser ? 'EMPLOYEE' : 'SUPERADMIN';
    const body = getStatus(option, role, subtaskStatus);
    if (isAssignedAdminTask) {
      const resStatus = await axiosInstance.patch(
        `/subtasks/status/${subtaskId}`,
        { status: 'DONE' }
      );
      socket.emit('client:update-subTask', resStatus.data);
    } else {
      const resStatus = await axiosInstance.patch(
        `/subtasks/status/${subtaskId}`,
        body
      );
      socket.emit('client:update-subTask', resStatus.data);
    }

    isOpenModal$.setSubject = false;
  };

  const handleSendToReview = async () => {
    if (!files?.length)
      return SnackbarUtilities.warning(
        'Asegurese de subir una archivo  antes.'
      );

    const hasPdf = Array.from(files).some(
      file => file.type === 'application/pdf'
    );
    if (!hasPdf)
      return SnackbarUtilities.warning(
        'Asegurese de subir una archivo PDF antes.'
      );
    const message = validateValuesPorcentage();
    if (message) return SnackbarUtilities.warning(message);
    const formdata = new FormData();
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
    await axiosInstance.patch(
      `/subtasks/percentage/${subtaskId}`,
      porcentagesForUser
    );
    await handleEditStatus();
  };

  const handleDeprecated = async () => {
    if (!dataFeedback?.comment)
      return SnackbarUtilities.warning(
        'Asegurese de escribir un comentario antes'
      );
    const message = validateValuesPorcentage();
    if (message) return SnackbarUtilities.warning(message);
    await axiosInstance.patch(
      `/subtasks/percentage/${subtaskId}`,
      porcentagesForUser
    );
    await axiosInstance.patch(`/feedbacks`, dataFeedback);
    await handleEditStatus();
  };

  const validateValuesPorcentage = () => {
    if (!porcentagesForUser) return 'Data de Porcentajes no enviada';

    const sumOfPercentages = porcentagesForUser.reduce(
      (acc, { percentage }) => percentage + acc,
      0
    );
    if (sumOfPercentages > 100)
      return 'La suma de todos los porcentajes no debe exceder del 100%';
    if (sumOfPercentages <= 0)
      return 'No deje los campos del porcentaje en vacio';
    return null;
  };

  const handleApproved = async () => {
    const message = validateValuesPorcentage();
    if (message) return SnackbarUtilities.warning(message);
    await axiosInstance.patch(
      `/subtasks/percentage/${subtaskId}`,
      porcentagesForUser
    );
    await handleEditStatus();
  };
  const selectFuctionType = () => {
    switch (type) {
      case 'approved':
        handleApproved();
        break;
      case 'assigned':
        handleEditStatus();
        break;
      case 'deprecated':
        handleDeprecated();
        break;
      case 'sendToReview':
        handleSendToReview();
        break;
      case 'liquidate':
        handleEditStatus();
        break;
      default:
        break;
    }
  };
  return (
    <Button
      text={text}
      className={`${className} SubtaskChangeStatusBtn ${option}`}
      onClick={selectFuctionType}
      type={'button'}
    />
  );
};

export default SubtaskChangeStatusBtn;
