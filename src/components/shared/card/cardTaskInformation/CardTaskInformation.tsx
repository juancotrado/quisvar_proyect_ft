import { Link } from 'react-router-dom';
import {
  isOpenModal$,
  isTaskInformation$,
} from '../../../../services/sharingSubject';
import Modal from '../../../portal/Modal';
import './cardTaskInformation.css';
import Button from '../../button/Button';
import { ChangeEvent, useContext, useState } from 'react';
import { SubTask } from '../../../../types/types';
import { SocketContext } from '../../../../context/SocketContex';
import { URL_FILES, axiosInstance } from '../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { InputRange } from '../../../index';
import ButtonDelete from '../../button/ButtonDelete';
import { statusBody, statusText } from './constans';
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
  const { userSession } = useSelector((state: RootState) => state);
  const [selectedFile, setSelectedFile] = useState(null);
  const [percentage, setPercentage] = useState(50);
  const [file, setFile] = useState<FileList[0]>();
  const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    if (!file) return;
    const formdata = new FormData();
    formdata.append('myFiles', file);
    axiosInstance
      .post(`/subtasks/upload/${subTask.id}`, formdata)
      .then(res => socket.emit('client:update-subTask', res.data));
  };

  const getStatus = (
    category: string,
    role: string,
    state: string
  ): { status: string } | undefined => {
    return statusBody[category]?.[role]?.[state];
  };

  const handleChangeStatus = async (option: 'ASIG' | 'DENY') => {
    const { status } = subTask;
    const body = getStatus(option, role, status);
    if (!body) return;

    const resStatus = await axiosInstance.patch(
      `/subtasks/status/${subTask.id}`,
      body
    );
    socket.emit('client:update-subTask', resStatus.data);
    isOpenModal$.setSubject = false;
  };
  const handleInputChange = (value: number) => {
    console.log('Nuevo valor:', value);
  };

  const handleSubTaskDelete = () => {
    axiosInstance.delete(`/subtasks/${subTask.id}`).then(res => {
      socket.emit('client:delete-subTask', res.data);
      isOpenModal$.setSubject = false;
    });
  };
  const normalizeFileName = (name: string) => {
    const indexName = name.indexOf('$');
    return name.slice(indexName + 1);
  };

  const deleteFile = (URL: string) => {
    axiosInstance
      .delete(URL)
      .then(res => socket.emit('client:update-subTask', res.data));
  };

  // validations
  const { status } = subTask;

  const isAuthorizedUser = subTask?.users?.some(
    ({ user }) => user.profile.userId === userSession.id
  );

  // const areAuthorizedUsers = isAuthorizedMod || isAuthorizedUser;
  const isStatusProcesOrDenied = status === 'PROCESS' || status === 'DENIED';
  // const subTaskStatus: keyof typeof statusText = subTask.status;
  return (
    <div className="information-container">
      <div className="main-content">
        <div className="content-files">
          <div className="content-head">
            <h3 className="information-title">Tarea: {subTask.name}</h3>
            {isAuthorizedMod && status === 'UNRESOLVED' && (
              <div className="conten-buttons-actions">
                <ButtonDelete
                  icon="trash-red"
                  url={`/subtasks/${subTask.id}`}
                  customOnClick={handleSubTaskDelete}
                />
                <Button
                  icon="pencil"
                  className="speciality-edit-icon"
                  onClick={openModalEdit}
                />
              </div>
            )}
          </div>
          {((isStatusProcesOrDenied && isAuthorizedUser) ||
            (isAuthorizedMod && status === 'INREVIEW')) && (
            <div className="content-file">
              <h4 className="content-file-title">Subir Archivo:</h4>
              <div className="content-file-send">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '2px dashed #ccc',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onDrop={handleDrop}
                  onDragOver={event => event.preventDefault()}
                >
                  {!selectedFile && <p>Arrastra los archivos aquí</p>}
                  <input type="file" onChange={handleFileChange} />
                </div>
                <Button
                  text="Subir archivo"
                  className="content-file-send-button"
                  onClick={handleUploadClick}
                />
              </div>
            </div>
          )}
          {status !== 'UNRESOLVED' && (
            <>
              <div className="content-file">
                <h4 className="content-file-title">Archivos:</h4>
                <div className="subtask-files">
                  {subTask.files?.map(file => (
                    <div key={file} className="subtask-file-contain">
                      <a
                        href={`${URL_FILES}/${file}`}
                        target="_blank"
                        className="subtask-file"
                        download={'xyz.pdf'}
                      >
                        <img
                          src="/svg/file-download.svg"
                          alt="W3Schools"
                          className="subtask-file-icon"
                        ></img>
                        <span className="subtask-file-name">
                          {normalizeFileName(file)}
                        </span>
                      </a>
                      {((isStatusProcesOrDenied && isAuthorizedUser) ||
                        (isAuthorizedMod && status === 'INREVIEW')) && (
                        <ButtonDelete
                          icon="trash-red"
                          customOnClick={() =>
                            deleteFile(
                              `/subtasks/deleteFile/${subTask.id}/${file}`
                            )
                          }
                          className="subtask-delete-icon"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {(userSession.id == subTask.users?.at(0)?.user.profile.userId ||
            subTask.users?.length === 0 ||
            role === 'SUPERADMIN') && (
            <div className="btn-content">
              {(status === 'PROCESS' ||
                (status === 'INREVIEW' && userSession.role !== 'EMPLOYEE')) && (
                <Button
                  text={status === 'INREVIEW' ? 'Desaprobar' : 'Declinar'}
                  className="btn-declinar"
                  onClick={() => handleChangeStatus('DENY')}
                />
              )}
              {status !== 'DONE' &&
                userSession.role === 'EMPLOYEE' &&
                status !== 'INREVIEW' && (
                  <Button
                    text={
                      status === 'UNRESOLVED' ? 'Asignar' : 'Mandar a Revisar'
                    }
                    className="btn-revisar"
                    onClick={() => handleChangeStatus('ASIG')}
                  />
                )}
              {status === 'INREVIEW' && userSession.role !== 'EMPLOYEE' && (
                <Button
                  text={'Aprobar'}
                  className="btn-revisar"
                  onClick={() => handleChangeStatus('ASIG')}
                />
              )}
            </div>
          )}
        </div>
        <div className="content-details">
          <div className="status-content">
            <label className="status-text status-hold">
              {statusText[status as keyof typeof statusText]}
            </label>
          </div>
          <p>Creación: 21/01/23</p>
          <div className="content-advance">
            <h4 className="content-file-title">Avance</h4>
            <InputRange
              maxRange={100}
              percentage={percentage}
              onChange={handleInputChange}
            />
          </div>
          <label className="content-advance-label">
            Precio por Avance: {subTask.price}
          </label>
          <div className="content-resource">
            <h4 className="content-file-title">Enunciado:</h4>

            <div className="statement">
              <div>
                <label>Archivo modelo:</label>
                <Link to="https://www.google.com/">Click aqui</Link>
              </div>
              <div>
                <label>Video relacionado:</label>
                <Link to="https://www.google.com/">Click aqui</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTaskInformation;
