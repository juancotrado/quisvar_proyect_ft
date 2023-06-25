import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { statusText } from '../cardTaskInformation/constans';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import Button from '../../button/Button';
import { SubTask } from '../../../../types/types';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import SubtaskFile from '../../../subtasks/subtaskFiles/SubtaskFile';
import SubtaskUploadFiles from '../../../subtasks/subtaskUploadFiles/SubtaskUploadFiles';

interface CardSubtaskProcess {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  isAuthorizedUser: boolean;
  areAuthorizedUsers: boolean;
  handleChangeStatus: (option: 'ASIG' | 'DENY') => void;
}

const CardSubtaskProcess = ({
  subTask,
  isAuthorizedMod,
  isAuthorizedUser,
  areAuthorizedUsers,
  handleChangeStatus,
}: CardSubtaskProcess) => {
  const socket = useContext(SocketContext);
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';

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
          {
            <div className="subtask-add-files-process">
              <div className="subtask-models">
                <div style={{ width: '100%' }}>
                  <h2>Archivos:</h2>
                </div>
                <SubtaskFile
                  showDeleteBtnByUserAuth={true}
                  subTask={subTask}
                  typeFile="REVIEW"
                />
              </div>
              <SubtaskUploadFiles id={subTask.id} type="REVIEW" />
            </div>
          }
        </div>
        {areAuthorizedUsers && (
          <div className="subtask-btns">
            {status === 'PROCESS' &&
              !isAuthorizedMod &&
              subTask.files.length === 0 && (
                <Button
                  text={'Declinar'}
                  className="btn-declinar"
                  onClick={handleReloadSubTask}
                />
              )}
            {isAuthorizedMod && status === 'INREVIEW' && (
              <Button
                text={'Desaprobar'}
                className="btn-declinar"
                onClick={() => handleChangeStatus('DENY')}
              />
            )}
            {(status === 'PROCESS' || status === 'DENIED') &&
              !isAuthorizedMod && (
                <Button
                  text="Mandar a Revisar"
                  className="btn-revisar"
                  onClick={() => handleChangeStatus('ASIG')}
                />
              )}
            {status === 'INREVIEW' && isAuthorizedMod && (
              <Button
                text={'Aprobar'}
                className="btn-revisar"
                onClick={() => handleChangeStatus('ASIG')}
              />
            )}
          </div>
        )}
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
              subTask={subTask}
              typeFile="MATERIAL"
              showDeleteBtn={false}
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

export default CardSubtaskProcess;
