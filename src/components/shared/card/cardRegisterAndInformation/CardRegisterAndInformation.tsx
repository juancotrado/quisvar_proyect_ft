import { useEffect, useRef, useState } from 'react';
import { SubTask } from '../../../../types/types';
import Modal from '../../../portal/Modal';
import CardTaskInformation from '../cardTaskInformation/CardTaskInformation';
import CardRegisterSubTask from '../cardRegisterSubTask/CardRegisterSubTask';
import {
  isOpenModal$,
  isTaskInformation$,
} from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';

interface CardRegisterAndInformationProps {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  taskId: number | null;
  projectName: string;
}

const CardRegisterAndInformation = ({
  isAuthorizedMod,
  subTask,
  taskId,
  projectName,
}: CardRegisterAndInformationProps) => {
  const [isTaskInformation, setIsTaskInformation] = useState<boolean>(true);
  const [subTaskToEdit, setSubTaskToEdit] = useState<SubTask | null>(null);

  const handleToggleRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleToggleRef.current = isTaskInformation$.getSubject.subscribe(
      (value: boolean) => {
        setIsTaskInformation(value);
        setSubTaskToEdit(null);
        isOpenModal$.setSubject = true;
      }
    );
    return () => {
      handleToggleRef.current.unsubscribe();
    };
  }, []);

  const openModalEdit = () => {
    setIsTaskInformation(false);
    setSubTaskToEdit(subTask);
  };
  return (
    <Modal size={50}>
      {isTaskInformation ? (
        <CardTaskInformation
          isAuthorizedMod={isAuthorizedMod}
          subTask={subTask}
          openModalEdit={openModalEdit}
          projectName={projectName}
        />
      ) : (
        <CardRegisterSubTask subTask={subTaskToEdit} taskId={taskId} />
      )}
    </Modal>
  );
};

export default CardRegisterAndInformation;
