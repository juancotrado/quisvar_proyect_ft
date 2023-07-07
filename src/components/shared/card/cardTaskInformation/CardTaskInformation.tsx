import {
  isOpenModal$,
  isTaskInformation$,
} from '../../../../services/sharingSubject';
import './cardTaskInformation.css';
import Button from '../../button/Button';
import { useContext } from 'react';
import { SubTask } from '../../../../types/types';
import { SocketContext } from '../../../../context/SocketContex';
import { axiosInstance } from '../../../../services/axiosInstance';

import {
  CardSubtaskDone,
  CardSubtaskHold,
  CardSubtaskProcess,
} from '../../../index';
import ButtonDelete from '../../button/ButtonDelete';
interface CardTaskInformationProps {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  openModalEdit: () => void;
}

const CardTaskInformation = ({
  subTask,
  isAuthorizedMod,
  openModalEdit,
}: CardTaskInformationProps) => {
  const socket = useContext(SocketContext);

  const closeModal = () => {
    isTaskInformation$.setSubject = false;
    isOpenModal$.setSubject = false;
  };

  const handleSubTaskDelete = () => {
    axiosInstance.delete(`/subtasks/${subTask.id}`).then(res => {
      socket.emit('client:delete-subTask', res.data);
      isOpenModal$.setSubject = false;
    });
  };

  const { status } = subTask;

  return (
    <div className="subtask-container">
      <Button
        type="button"
        icon={'close'}
        className="close-modal"
        onClick={closeModal}
      />
      <div className="subtask-header">
        <h3 className="subtask-info-title">
          Tarea: {subTask.item} {subTask.name}
        </h3>
        {isAuthorizedMod && status === 'UNRESOLVED' && (
          <div className="subtask-btn-actions">
            <Button
              icon="pencil"
              className="subtask-edit-icon"
              onClick={openModalEdit}
            />
            <ButtonDelete
              icon="trash-red"
              url={`/subtasks/${subTask.id}`}
              customOnClick={handleSubTaskDelete}
              className="subtask-btn-delete"
            />
          </div>
        )}
      </div>
      {status === 'UNRESOLVED' && (
        <CardSubtaskHold subTask={subTask} isAuthorizedMod={isAuthorizedMod} />
      )}
      {(status === 'PROCESS' ||
        status === 'INREVIEW' ||
        status === 'DENIED') && (
        <CardSubtaskProcess
          subTask={subTask}
          isAuthorizedMod={isAuthorizedMod}
        />
      )}
      {status === 'DONE' && (
        <CardSubtaskDone subTask={subTask} isAuthorizedMod={isAuthorizedMod} />
      )}
    </div>
  );
};
export default CardTaskInformation;
