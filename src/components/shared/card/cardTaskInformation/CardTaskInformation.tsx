import { Link } from 'react-router-dom';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Modal from '../../../portal/Modal';
import './cardTaskInformation.css';
import SelectOptions from '../../select/Select';
import Button from '../../button/Button';
import { ChangeEvent, useContext, useState } from 'react';
import { SubTask } from '../../../../types/types';
import { SocketContext } from '../../../../context/SocketContex';
import { URL_FILES, axiosInstance } from '../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { InputRange } from '../../../index';
import ButtonDelete from '../../button/ButtonDelete';
interface CardTaskInformationProps {
  subTask: SubTask;
  coordinatorId: number;
}
interface StatusBody {
  [category: string]: {
    [role: string]: {
      [state: string]: {
        status: string;
      };
    };
  };
}
const statusBody: StatusBody = {
  ASIG: {
    EMPLOYEE: {
      UNRESOLVED: {
        status: 'PROCESS',
      },
      PROCESS: {
        status: 'INREVIEW',
      },
      DENIED: {
        status: 'INREVIEW',
      },
    },
    SUPERADMIN: {
      INREVIEW: {
        status: 'DONE',
      },
    },
  },
  DENY: {
    EMPLOYEE: {
      PROCESS: {
        status: 'UNRESOLVED',
      },
    },
    SUPERADMIN: {
      INREVIEW: {
        status: 'DENIED',
      },
    },
  },
};
const CardTaskInformation = ({
  subTask,
  coordinatorId,
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

  const normalizeFileName = (name: string) => {
    const indexName = name.indexOf('$');
    return name.slice(indexName + 1);
  };

  const deleteFile = (URL: string) => {
    axiosInstance
      .delete(URL)
      .then(res => socket.emit('client:update-subTask', res.data));
  };
  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
  };

  // validations
  const { status } = subTask;

  const isAuthorizedUser = subTask?.users?.some(
    ({ user }) => user.profile.userId === userSession.id
  );
  const isAuthorizedMod = userSession.id === coordinatorId;

  const areAuthorizedUsers = isAuthorizedMod || isAuthorizedUser;
  const isStatusProcesOrDenied = status === 'PROCESS' || status === 'DENIED';

  return (
    <Modal size={50}>
      <div className="information-container">
        <h3 className="information-title">Tarea: {subTask.name}</h3>
        {/* <button onClick={closeFunctions}>CERRAR</button> */}
        <div className="main-content">
          <div className="content-files">
            <div className="content-file">
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
                        onClick={handleUploadClick}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="content-details">
            <div className="status-content">
              <label className="status-text status-hold">Por Asignar</label>
            </div>
            <p>Creación: 21/01/23</p>
            <h1>Avance</h1>
            <InputRange
              maxRange={100}
              percentage={percentage}
              onChange={handleInputChange}
            />
            {/* <p>{percentage}%</p> */}
            <label>Precio general: s/260.00</label>
            <label>Precio por avance: s/260.00</label>
            <label>Total de horas estimadas: {subTask.hours} horas</label>
            <label>Total Horas: </label>
            <p>Encargado: Diego Romani</p>
            {(userSession.id == subTask.users?.at(0)?.user.profile.userId ||
              subTask.users?.length === 0 ||
              role === 'SUPERADMIN') && (
              <div className="btn-content">
                {(status === 'PROCESS' ||
                  (status === 'INREVIEW' &&
                    userSession.role !== 'EMPLOYEE')) && (
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
        </div>
      </div>
    </Modal>
  );
};

export default CardTaskInformation;
