import {
  isOpenModal$,
  isTaskInformation$,
} from '../../../../services/sharingSubject';
import './cardTaskInformation.css';
import Button from '../../button/Button';
import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Option, SubTask } from '../../../../types/types';
import { SocketContext } from '../../../../context/SocketContex';
import { axiosInstance } from '../../../../services/axiosInstance';

import {
  CardSubtaskDone,
  CardSubtaskHold,
  CardSubtaskProcess,
} from '../../../index';
import DotsOption from '../../dots/DotsOption';
import Portal from '../../../portal/Portal';
import { dropIn } from '../../../../animations/animations';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
interface CardTaskInformationProps {
  subTask: SubTask;
  openModalEdit: () => void;
}

const CardTaskInformation = ({
  subTask,
  openModalEdit,
}: CardTaskInformationProps) => {
  const socket = useContext(SocketContext);
  const { modAuth } = useSelector((state: RootState) => state);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const closeModal = () => {
    isTaskInformation$.setSubject = false;
    isOpenModal$.setSubject = false;
  };
  const optionsData: Option[] = [
    {
      name: 'Editar',
      type: 'button',
      icon: 'pencil',
      function: openModalEdit,
    },
    {
      name: 'Eliminar',
      type: 'button',
      icon: 'trash-red',
      function: () => setIsAlertOpen(true),
    },
  ];
  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/subtasks/${id}`).then(res => {
      socket.emit('client:delete-subTask', res.data);
      isOpenModal$.setSubject = false;

      if (res.data.length === 0)
        return socket.emit('client:delete-subTask', [
          {
            id: null,
            taskId: subTask.taskId,
            indexTaskId: subTask.indexTaskId,
            task_2_Id: subTask.task_2_Id,
            task_3_Id: subTask.task_3_Id,
          },
        ]);

      socket.emit('client:delete-subTask', res.data);
    });
  };
  const handleCloseButton = () => {
    setIsAlertOpen(!isAlertOpen);
  };
  const handleSendDelete = async () => {
    handleDelete(subTask.id);
    setIsAlertOpen(false);
    return;
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
          Título de la tarea:{' '}
          <b>
            {subTask.item}. {subTask.name}
          </b>
        </h3>
        {modAuth && status === 'UNRESOLVED' && (
          <div className="subtask-btn-actions">
            <DotsOption data={optionsData} persist={true} />
          </div>
        )}
      </div>
      {status === 'UNRESOLVED' && <CardSubtaskHold subTask={subTask} />}
      {(status === 'PROCESS' ||
        status === 'INREVIEW' ||
        status === 'DENIED') && <CardSubtaskProcess subTask={subTask} />}
      {(status === 'DONE' || status === 'LIQUIDATION') && (
        <CardSubtaskDone subTask={subTask} />
      )}
      {isAlertOpen && (
        <Portal wrapperId="modal">
          <div
            className="alert-modal-main"
            role="dialog"
            onClick={handleCloseButton}
          >
            <motion.div
              className="alert-modal-children"
              variants={dropIn}
              onClick={e => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="leave"
            >
              <img src="/svg/trashdark.svg" />
              <h3>{`¿Estas seguro que deseas eliminar este registro?`}</h3>
              <div className="container-btn">
                <Button
                  text="No, cancelar"
                  onClick={handleCloseButton}
                  className="btn-alert "
                />
                <Button
                  className=" btn-alert  btn-delete"
                  text="Si, estoy seguro"
                  type="button"
                  onClick={handleSendDelete}
                />
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </div>
  );
};
export default CardTaskInformation;
