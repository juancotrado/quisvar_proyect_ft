import { useContext, useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import ButtonDelete from '../../button/ButtonDelete';
import { statusBody, statusText } from '../cardTaskInformation/constans';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import Button from '../../button/Button';
import { SubTask, fyleType } from '../../../../types/types';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import SubtaskFile from '../../../subtasks/subtaskFiles/SubtaskFile';

interface CardSubtaskDone {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  isAuthorizedUser: boolean;
  projectName: string;
  areAuthorizedUsers: boolean;
}

const CardSubtaskDone = ({
  subTask,
  isAuthorizedMod,
  areAuthorizedUsers,
  isAuthorizedUser,
}: CardSubtaskDone) => {
  const socket = useContext(SocketContext);
  const [file, setFile] = useState<FileList[0] | null>();
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';
  const normalizeFileName = (name: string) => {
    const indexName = name.indexOf('$');
    return name.slice(indexName + 1);
  };

  const { status } = subTask;

  const getStatus = (
    category: string,
    role: string,
    state: string
  ): { status: string } | undefined => {
    return statusBody[category]?.[role]?.[state];
  };

  // const handleChangeStatus = async (option: 'ASIG' | 'DENY') => {
  //   const body = getStatus(option, role, status);
  //   if (!body) return;

  //   const resStatus = await axiosInstance.patch(
  //     `/subtasks/status/${subTask.id}`,
  //     body
  //   );
  //   socket.emit('client:update-subTask', resStatus.data);
  //   isOpenModal$.setSubject = false;
  // };

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
        {areAuthorizedUsers && (
          <div className="subtask-btns">
            {status === 'PROCESS' && !isAuthorizedMod && (
              <Button
                text={'Declinar'}
                className="btn-declinar"
                onClick={handleReloadSubTask}
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
