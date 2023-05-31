import { useEffect, useRef, useState } from 'react';
import { SubTask } from '../../../../types/types';
import Modal from '../../../portal/Modal';
import CardTaskInformation from '../cardTaskInformation/CardTaskInformation';
import CardRegisterSubTask from '../cardRegisterSubTask/CardRegisterSubTask';
import {
  isOpenModal$,
  isTaskInformation$,
  toggle$,
} from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';

interface CardRegisterAndInformationProps {
  subTask: SubTask;
  coordinatorId: number;
}

const CardRegisterAndInformation = ({
  coordinatorId,
  subTask,
}: CardRegisterAndInformationProps) => {
  const [isTaskInformation, setIsTaskInformation] = useState<boolean>(true);

  const handleToggleRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleToggleRef.current = isTaskInformation$.getSubject.subscribe(
      (value: boolean) => {
        setIsTaskInformation(value);
        isOpenModal$.setSubject = true;
      }
    );
    return () => {
      handleToggleRef.current.unsubscribe();
    };
  }, []);

  return (
    <Modal size={50}>
      {isTaskInformation ? (
        <CardTaskInformation coordinatorId={coordinatorId} subTask={subTask} />
      ) : (
        <CardRegisterSubTask />
      )}
    </Modal>
  );
};

export default CardRegisterAndInformation;
