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

interface CardSubtaskProcess {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  isAuthorizedUser: boolean;
  projectName: string;
  areAuthorizedUsers: boolean;
  handleChangeStatus: (option: 'ASIG' | 'DENY') => void;
  handleFileChange: (type: fyleType, e: ChangeEvent<HTMLInputElement>) => void;
}

const CardSubtaskProcess = ({
  subTask,
  isAuthorizedMod,
  isAuthorizedUser,
  areAuthorizedUsers,
  handleChangeStatus,
  projectName,
  handleFileChange,
}: CardSubtaskProcess) => {
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

  const deleteFile = (id: number) => {
    axiosInstance
      .delete(`/files/remove/${id}`)
      .then(res => socket.emit('client:update-subTask', res.data));
  };
  const handleDrop = (
    type: fyleType,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const formdata = new FormData();
    formdata.append('file', file);
    axiosInstance
      .post(`/files/upload/${subTask.id}/?status=${type}`, formdata)
      .then(res => socket.emit('client:update-subTask', res.data));
    // setFile(file);
  };
  // const handleFileChange = (
  //   type: fyleType,
  //   e: ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (!e.target.files) return;

  //   const formdata = new FormData();
  //   formdata.append('file', e.target.files[0]);
  //   axiosInstance
  //     .post(`/files/upload/${subTask.id}/?status=${type}`, formdata)
  //     .then(res => socket.emit('client:update-subTask', res.data));
  // };

  return (
    <div className="subtask-content-area">
      <section className="subtask-files">
        <div className="subtask-files-content">
          <div className="subtask-add-files-process">
            <div className="subtask-models">
              <div style={{ width: '100%' }}>
                <h2>Archivos:</h2>
              </div>
              <div className="subtask-fil">
                {subTask.files
                  ?.filter(({ type }) => type === 'REVIEW')
                  .map(file => (
                    <div key={file.id} className="subtask-file-contain">
                      <a
                        href={`${URL}/models/${projectName}/${file.name}`}
                        target="_blank"
                        className="subtask-file"
                        download={'xyz.pdf'}
                      >
                        <img
                          src="/svg/file-download.svg"
                          alt="W3Schools"
                          className="subtask-file-icon"
                        />
                        <span className="subtask-file-name">
                          {normalizeFileName(file.name)}
                        </span>
                      </a>
                      {(isAuthorizedMod || isAuthorizedUser) &&
                        status !== 'DONE' &&
                        status !== 'UNRESOLVED' && (
                          <ButtonDelete
                            icon="trash-red"
                            customOnClick={() => deleteFile(file.id)}
                            className="subtask-btn-delete-icons"
                          />
                        )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="subtask-file-area">
              <input
                type="file"
                onChange={e => handleFileChange('REVIEW', e)}
                // onDragOver={handleDragOver}
                onDragOver={event => event.preventDefault()}
                onDrop={e => handleDrop('REVIEW', e)}
                className="subtask-file-input"
                style={{ opacity: 0 }}
              />
              {file ? (
                <p>{file?.name}</p>
              ) : (
                <p>Arrastra o Selecciona un archivo</p>
              )}
            </div>
          </div>
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
            <div className="subtask-fil">
              {subTask.files
                ?.filter(({ type }) => type === 'REVIEW')
                .map(file => (
                  <div key={file.id} className="subtask-file-contain">
                    <a
                      href={`${URL}/models/${projectName}/${file.name}`}
                      target="_blank"
                      className="subtask-file"
                      download={'xyz.pdf'}
                    >
                      <img
                        src="/svg/file-download.svg"
                        alt="W3Schools"
                        className="subtask-file-icon"
                      />
                      <span className="subtask-file-name">
                        {normalizeFileName(file.name)}
                      </span>
                    </a>
                    {isAuthorizedMod &&
                      status !== 'UNRESOLVED' &&
                      status !== 'DONE' && (
                        <ButtonDelete
                          icon="trash-red"
                          customOnClick={() => deleteFile(file.id)}
                          className="subtask-btn-delete-icons"
                        />
                      )}
                  </div>
                ))}
            </div>
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
