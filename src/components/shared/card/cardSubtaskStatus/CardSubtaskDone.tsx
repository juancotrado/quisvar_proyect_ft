import { useContext } from 'react';
import { statusText } from '../cardTaskInformation/constans';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import Button from '../../button/Button';
import { SubTask, fyleType } from '../../../../types/types';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import SubtaskFile from '../../../subtasks/subtaskFiles/SubtaskFile';

interface CardSubtaskDone {
  subTask: SubTask;
  isAuthorizedMod: boolean;
}

const CardSubtaskDone = ({ subTask, isAuthorizedMod }: CardSubtaskDone) => {
  const socket = useContext(SocketContext);
  const { status } = subTask;

  const handleReloadSubTask = () => {
    axiosInstance
      .patch(`/subtasks/asigned/${subTask.id}?status=decline`)
      .then(res => {
        socket.emit('client:update-subTask', res.data);
        isOpenModal$.setSubject = false;
      });
  };

  return (
    <div className="subtask-content-area">
      <section className="subtask-files">
        <div className="subtask-files-content">
          <div className="subtask-add-files-done">
            <div className="subtask-done-files">
              <div style={{ width: '30%', padding: '0.5rem' }}>
                <h2>Archivos:</h2>
              </div>
              <SubtaskFile
                showDeleteBtn={false}
                subTask={subTask}
                typeFile="SUCCESSFUL"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="subtask-details">
        <div className="subtask-status-content">
          <label
            className={`status-text 
                    ${status === 'UNRESOLVED' && 'status-unresolved'} 
                    ${status === 'PROCESS' && 'status-process'} 
                    ${status === 'INREVIEW' && 'status-inreview'} 
                    ${status === 'DENIED' && 'status-denied'} 
                    ${status === 'DONE' && 'status-done'} 
                    `}
          >
            {statusText[status as keyof typeof statusText]}
          </label>
        </div>
        <div className="subtask-status-info">
          <p>Creación: 21/01/23</p>
          <div className="subtask-models-process">
            <div style={{ width: '100%' }}>
              <h2>Archivos Modelo:</h2>
            </div>
            <SubtaskFile
              showDeleteBtn={false}
              subTask={subTask}
              typeFile="MATERIAL"
            />
          </div>
          <h3>Total Horas: 24 horas</h3>
          <h2>Precio: S/. {subTask.price}</h2>
        </div>
        {isAuthorizedMod && (
          <Button
            text="RESTABLECER"
            className="btn-declinar"
            onClick={handleReloadSubTask}
          />
        )}
      </section>
    </div>
  );
};

export default CardSubtaskDone;
