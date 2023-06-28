import { useEffect, useRef, useState } from 'react';
import { SubTask, TypeTask } from '../../../../types/types';
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
  typeTask?: TypeTask;
}

const CardRegisterAndInformation = ({
  isAuthorizedMod,
  subTask,
  taskId,
  typeTask,
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
        />
      ) : (
        <CardRegisterSubTask
          subTask={subTaskToEdit}
          taskId={taskId}
          typeTask={typeTask}
        />
      )}
    </Modal>
  );
};

export default CardRegisterAndInformation;
