import Button from '../../shared/button/Button';
import { statusBody } from '../../shared/card/cardTaskInformation/constans';
import { SnackbarUtilities } from '../../../utils/SnackbarManager';
import { useContext } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import { SocketContext } from '../../../context/SocketContex';
import './subtaskChangeStatusBtn.css';
import { DataFeedback, Files, StatusType } from '../../../types/types';
import { useParams } from 'react-router-dom';

interface SubtaskChangeStatusBtn {
  isAssignedAdminTask?: boolean;
  subtaskStatus: StatusType;
  subtaskId: number;
  className?: string;
  option: 'ASIG' | 'DENY';
  isDisabled?: boolean;
  text: string;
  type:
    | 'sendToReview'
    | 'deprecated'
    | 'approved'
    | 'assigned'
    | 'liquidate'
    | 'reset';
  porcentagesForUser?: { userid: number; percentage: number }[];
  files?: Files[] | null;
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
  isDisabled = false,
}: SubtaskChangeStatusBtn) => {
  const socket = useContext(SocketContext);
  const { stageId } = useParams();
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
        `/subtasks/status/${subtaskId}/${stageId}`,
        { status: 'DONE' }
      );
      socket.emit('client:update-subTask', resStatus.data);
    } else {
      const resStatus = await axiosInstance.patch(
        `/subtasks/status/${subtaskId}/${stageId}`,
        body
      );
      socket.emit('client:update-projectAndTask', resStatus.data);
    }
    SnackbarUtilities.success('Se realizo la operación con exito');
  };

  // const handleSendToReviewFormData = async () => {
  //   if (!files?.length)
  //     return SnackbarUtilities.warning(
  //       'Asegurese de subir una archivo  antes.',
  //     );

  //   const hasPdf = Array.from(files).some(
  //     file => file.type === 'application/pdf',
  //   );
  //   if (!hasPdf)
  //     return SnackbarUtilities.warning(
  //       'Asegurese de subir una archivo PDF antes.',
  //     );
  //   const message = validateValuesPorcentage();
  //   if (message) return SnackbarUtilities.warning(message);
  //   const formdata = new FormData();
  //   for (const file of files) {
  //     formdata.append('files', file);
  //   }

  //   await axiosInstance.post(
  //     `/files/uploads/${subtaskId}/?status=REVIEW`,
  //     formdata,
  //   );

  //   const feedbackBody = {
  //     subTasksId: subtaskId,
  //   };
  //   await axiosInstance.post(`/feedbacks`, feedbackBody);
  //   await axiosInstance.patch(
  //     `/subtasks/percentage/${subtaskId}`,
  //     porcentagesForUser,
  //   );
  //   await handleEditStatus();
  // };
  const handleSendToReview = async () => {
    if (!files?.length)
      return SnackbarUtilities.warning(
        'Asegurese de subir una archivo  antes.'
      );

    const hasPdf = Array.from(files).some(file => file.name.includes('.pdf'));
    if (!hasPdf)
      return SnackbarUtilities.warning(
        'Asegurese de subir una archivo PDF antes.'
      );
    const message = validateValuesPorcentage();
    if (message) return SnackbarUtilities.warning(message);

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
    if (!dataFeedback?.comment)
      return SnackbarUtilities.warning(
        'Asegurese de escribir un comentario antes'
      );
    if (!porcentagesForUser) return;
    const sumOfPercentages = porcentagesForUser.reduce(
      (acc, { percentage }) => percentage + acc,
      0
    );
    await axiosInstance.patch(
      `/subtasks/percentage/${subtaskId}`,
      porcentagesForUser
    );
    if (sumOfPercentages === 100) {
      await handleEditStatus();
    } else if (sumOfPercentages < 100) {
      const resStatus = await axiosInstance.patch(
        `/subtasks/status/${subtaskId}/${stageId}`,
        { status: 'PROCESS' }
      );
      await axiosInstance.patch(`/feedbacks`, dataFeedback);
      socket.emit('client:update-projectAndTask', resStatus.data);
      SnackbarUtilities.success('Se realizo la operación con exito');
    }
  };
  const handleAsigned = () => {
    if (!files?.length)
      return SnackbarUtilities.warning(
        'Asegurese de subir los archivos modelos antes'
      );
    handleEditStatus();
  };
  const selectFuctionType = () => {
    if (isDisabled) return;
    switch (type) {
      case 'approved':
        handleApproved();
        break;
      case 'assigned':
        handleAsigned();
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
      case 'reset':
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
