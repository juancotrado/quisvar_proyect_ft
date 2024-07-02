import { useContext, useState } from 'react';
import { loader$ } from '../../../../../../../services/sharingSubject';
import { SocketContext } from '../../../../../../../context';
import { useEmitWithLoader } from '../../../../../../../hooks';
import { useParams } from 'react-router-dom';

const useAssignUserTask = (taskId: number) => {
  // const socket = useContext(SocketContext);
  const { stageId } = useParams();
  const { emitWithLoader, socket } = useEmitWithLoader();

  const [assignedUser, setAssignedUser] = useState({
    evaluatorId: 0,
    technicalId: 0,
  });
  const onAssignUser = async (
    userId: number,
    typeUser: keyof typeof assignedUser
  ) => {
    const body = {
      userId,
      taskId,
    };
    if (typeUser === 'technicalId') {
      emitWithLoader('client:add-user-basic-task', body);
    }
    if (typeUser === 'evaluatorId') {
      emitWithLoader('client:add-mod-basic-task', body);
      socket.emit('client:load-stage', stageId);
    }
  };

  const onChangeAssignedUser = (
    value: number,
    typeUser: keyof typeof assignedUser
  ) => {
    setAssignedUser({ ...assignedUser, [typeUser]: value });
  };

  const onChangeModerator = (
    value: number,
    typeUser: keyof typeof assignedUser,
    modId?: number
  ) => {
    if (!value && modId) {
      const body = {
        userId: modId,
        taskId,
      };
      emitWithLoader('client:remove-mod-basic-task', body);
      return;
    }
    onAssignUser(value, typeUser);
  };

  return {
    onChangeAssignedUser,
    onAssignUser,
    assignedUser,
    onChangeModerator,
  };
};

export default useAssignUserTask;
