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
  taskId: number | null;
  typeTask?: TypeTask;
  adminId: number | undefined;
}

const CardRegisterAndInformation = ({
  subTask,
  taskId,
  typeTask,
  adminId,
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
          subTask={subTask}
          openModalEdit={openModalEdit}
          adminId={adminId}
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
