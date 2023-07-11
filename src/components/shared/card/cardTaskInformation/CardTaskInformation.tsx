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
          TAREA:{' '}
          <b>
            {subTask.item}. {subTask.name}
          </b>
        </h3>
        {isAuthorizedMod && status === 'UNRESOLVED' && (
          <div className="subtask-btn-actions">
            <DotsOption data={optionsData} persist={true} />
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
