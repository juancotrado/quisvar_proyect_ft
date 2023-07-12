import { useContext } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import Button from '../../button/Button';
import { SubTask } from '../../../../types/types';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import SubtaskFile from '../../../subtasks/subtaskFiles/SubtaskFile';
import SubTaskStatusLabel from '../../../subtasks/subTaskStatusLabel/SubTaskStatusLabel';
import SubtasksShippingHistory from '../../../subtasks/subtasksShippingHistory/SubtasksShippingHistory';

interface CardSubtaskDone {
  subTask: SubTask;
  isAuthorizedMod: boolean;
}

const CardSubtaskDone = ({ subTask, isAuthorizedMod }: CardSubtaskDone) => {
  const { status } = subTask;
  const feedBacksReverse = subTask.feedBacks.reverse();
  return (
    <div className="subtask-content-area">
      <section className="subtask-files">
        {subTask.feedBacks.length !== 0 && (
          <SubtasksShippingHistory feedBacks={feedBacksReverse} />
        )}
      </section>
      <section className="subtask-details">
        <SubTaskStatusLabel status={status} />

        <div className="subtask-status-info">
          <p>Creación: 21/01/23</p>
          <div className="subtask-models-process">
            <div style={{ width: '100%' }}>
              <h2>Archivos Modelo:</h2>
            </div>
            <SubtaskFile
              showDeleteBtn={false}
              files={subTask.files}
              typeFile="MATERIAL"
            />
          </div>
          <h3>Total Horas: 24 horas</h3>
          <h2>Precio: S/. {subTask.price}</h2>
        </div>
      </section>
    </div>
  );
};

export default CardSubtaskDone;
