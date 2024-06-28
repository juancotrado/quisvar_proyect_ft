import { useContext, useState } from 'react';
import { loader$ } from '../../../../../../../services/sharingSubject';
import { SocketContext } from '../../../../../../../context';
import { useEmitWithLoader } from '../../../../../../../hooks';

const useAssignUserTask = (taskId: number) => {
  // const socket = useContext(SocketContext);
  const { emitWithLoader } = useEmitWithLoader();
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
    const emitValue =
      typeUser === 'technicalId'
        ? 'client:add-user-basic-task'
        : 'client:add-mod-basic-task';
    emitWithLoader(emitValue, body);
  };

  const onChangeAssignedUser = (
    value: number,
    typeUser: keyof typeof assignedUser
  ) => {
    setAssignedUser({ ...assignedUser, [typeUser]: value });
  };

  return { onChangeAssignedUser, onAssignUser, assignedUser };
};

export default useAssignUserTask;
