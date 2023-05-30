import { Link } from 'react-router-dom';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Modal from '../../../portal/Modal';
import './cardTaskInformation.css';
import SelectOptions from '../../select/Select';
import Button from '../../button/Button';
import { useContext, useState } from 'react';
import { SubTask } from '../../../../types/types';
import { SocketContext } from '../../../../context/SocketContex';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { InputRange } from '../../../index';
interface CardTaskInformationProps {
  subTask: SubTask;
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
const CardTaskInformation = ({ subTask }: CardTaskInformationProps) => {
  const socket = useContext(SocketContext);
  const { userSession } = useSelector((state: RootState) => state);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  // const handleUpload = () => {
  //     if (selectedFile) {
  //         console.log('Archivo seleccionado:', selectedFile);
  //     }
  // };
  const [percentage, setPercentage] = useState(50);
  console.log(percentage);

  const handleClick = (newPercentage: any) => {
    setPercentage(newPercentage);
  };

  const getStatus = (
    category: string,
    role: string,
    state: string
  ): { status: string } | undefined => {
    return statusBody[category]?.[role]?.[state];
  };
  const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';
  const handleChangeStatus = async (option: 'ASIG' | 'DENY') => {
    const { status } = subTask;
    const body = getStatus(option, role, status);
    if (!body) return;

    const resStatus = await axiosInstance.patch(
      `/subtasks/status/${subTask.id}`,
      body
    );
    socket.emit('client:update-status-subTask', resStatus.data);
    isOpenModal$.setSubject = false;
  };
  const handleInputChange = (value: number) => {
    console.log('Nuevo valor:', value);
  };
  const data = [
    { name: 'Por Hacer' },
    { name: 'En proceso' },
    { name: 'Terminado' },
  ];
  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
  };
  const { status } = subTask;
  return (
    <Modal size={50}>
      <div className="information-container">
        <div className="information-header">
          <h1>Tarea: {subTask.name}</h1>
          <button onClick={closeFunctions}>CERRAR</button>
        </div>
        <div className="main-content">
          <div className="content-files">
            <section className="first-section">
              <span>Enuncionado</span>
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
            </section>
            <section className="second-section">
              <span>Enuncionado</span>
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
                {/* <button onClick={handleUpload}>Subir archivo</button> */}
              </div>
            </section>
          </div>
          <div className="line-divide" />
          <div className="content-details">
            <div className="status-content">
              <label className="status-text status-hold">Por Asignar</label>
            </div>
            <p>Creación: 21/01/23</p>
            <h1>Avance</h1>
            {/* <div className="progress-bar">
              <div
                className="progress-bar-line"
                style={{ width: `${percentage}%` }}
              />
              <div className="progress-bar-points">
                <div
                  className={`progress-bar-point ${
                    percentage === 0 || percentage > 0 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(0)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 25 || percentage > 25 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(25)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 50 || percentage > 50 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(50)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 75 || percentage > 75 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(75)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 100 || percentage > 100 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(100)}
                />
              </div>
            </div> */}
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
