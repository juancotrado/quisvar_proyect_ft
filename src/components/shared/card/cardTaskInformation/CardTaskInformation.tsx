import { isOpenModal$ } from '../../../../services/sharingSubject';
import './cardTaskInformation.css';
import Button from '../../button/Button';
import { ChangeEvent, useContext, useMemo, useState } from 'react';
import { SubTask, fyleType } from '../../../../types/types';
import { SocketContext } from '../../../../context/SocketContex';
import { URL, axiosInstance } from '../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { InputRange } from '../../../index';
import ButtonDelete from '../../button/ButtonDelete';
import { statusBody, statusText } from './constans';
import DropDownSimple from '../../select/DropDownSimple';
interface CardTaskInformationProps {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  openModalEdit: () => void;
  projectName: string;
}
type DataUser = { id: number; name: string };

const CardTaskInformation = ({
  subTask,
  isAuthorizedMod,
  openModalEdit,
  projectName,
}: CardTaskInformationProps) => {
  const socket = useContext(SocketContext);
  const { userSession } = useSelector((state: RootState) => state);
  // const [selectedFile, setSelectedFile] = useState<FileList[0] | null>();
  const [percentage, setPercentage] = useState(50);
  const [file, setFile] = useState<FileList[0] | null>();
  const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';
  const [usersData, setUsersData] = useState<DataUser[]>([]);
  const { listUsers } = useSelector((state: RootState) => state);

  const users = useMemo(
    () =>
      listUsers
        ? listUsers
            .filter(({ role }) => role === 'EMPLOYEE')
            .map(({ profile, ...props }) => ({
              name: `${profile.firstName} ${profile.lastName}`,
              ...props,
            }))
        : [],
    [listUsers]
  );
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleUploadClick = (type: fyleType) => {
    if (!file) return;
    const formdata = new FormData();
    formdata.append('file', file);
    axiosInstance
      .post(`/files/upload/${subTask.id}/?status=${type}`, formdata)
      .then(res => socket.emit('client:update-subTask', res.data));
    setFile(null);
  };

  const handleAddUser = (user: DataUser) => {
    const getId = usersData.find(list => list.id == user.id);
    if (!getId) setUsersData([...usersData, user]);
  };

  const handleRemoveUser = (user: DataUser) => {
    const filterValue = usersData.filter(list => list.id !== user.id);
    setUsersData(filterValue);
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

  const handleReloadSubTask = () => {
    axiosInstance
      .patch(`/subtasks/asigned/${subTask.id}?status=decline`)
      .then(res => {
        socket.emit('client:update-subTask', res.data);
        isOpenModal$.setSubject = false;
      });
  };
  const handleAddUserByTask = () => {
    axiosInstance
      .patch(`/subtasks/assignUser/${subTask.id}`, usersData)
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

  // validations
  const { status } = subTask;

  const isAuthorizedUser = subTask?.users?.some(
    ({ user }) => user.profile.userId === userSession.id
  );

  const areAuthorizedUsers = isAuthorizedMod || isAuthorizedUser;
  const isStatusProcesOrDenied = status === 'PROCESS' || status === 'DENIED';
  return (
    <div className="subtask-container">
      <section className="subtask-files">
        <div className="subtask-header">
          <h3 className="subtask-info-title">Tarea: {subTask.name}</h3>
          {isAuthorizedMod && status === 'UNRESOLVED' && (
            <div className="subtask-btn-actions">
              <Button
                icon="pencil"
                className="subtask-edit-icon"
                onClick={openModalEdit}
              />
              <ButtonDelete
                icon="trash-red"
                url={`/subtasks/${subTask.id}`}
                customOnClick={handleSubTaskDelete}
                className="subtask-btn-delete"
              />
            </div>
          )}
        </div>
        <div className="subtask-first">
          {status === 'UNRESOLVED' && !isAuthorizedMod && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                text="Asignarme"
                className="btn-revisar"
                onClick={() => handleChangeStatus('ASIG')}
              />
            </div>
          )}
          {status === 'UNRESOLVED' && isAuthorizedMod && (
            <div className="subtask-add-files">
              <h2>Adujuntar archivo modelo:</h2>
              <div className="subtask-file-area">
                <input
                  type="file"
                  onChange={handleFileChange}
                  // onDragOver={handleDragOver}
                  onDragOver={event => event.preventDefault()}
                  onDrop={handleDrop}
                  className="subtask-file-input"
                  style={{ opacity: 0 }}
                />
                {file ? (
                  <p>{file?.name}</p>
                ) : (
                  <p>Arrastra o Selecciona un archivo</p>
                )}
              </div>
              <Button
                text="Subir archivo"
                className="subtask-send-btn"
                onClick={() => handleUploadClick('MATERIAL')}
              />
            </div>
          )}

          {((isStatusProcesOrDenied && isAuthorizedUser) ||
            (isAuthorizedMod && status === 'INREVIEW')) && (
            <div className="subtask-add-files">
              <h2>Adujuntar archivo:</h2>
              <div className="subtask-file-area">
                <input
                  type="file"
                  onChange={handleFileChange}
                  // onDragOver={handleDragOver}
                  onDragOver={event => event.preventDefault()}
                  onDrop={handleDrop}
                  className="subtask-file-input"
                  style={{ opacity: 0 }}
                />
                {file ? (
                  <p>{file?.name}</p>
                ) : (
                  <p>Arrastra o Selecciona un archivo</p>
                )}
              </div>
              <Button
                text="Subir archivo"
                className="subtask-send-btn"
                onClick={() => handleUploadClick('REVIEW')}
              />
            </div>
          )}
        </div>
        <div className="subtask-second">
          {status === 'UNRESOLVED' && isAuthorizedMod && (
            <>
              <div className="subtask-search-users">
                <DropDownSimple
                  data={users}
                  textField="name"
                  itemKey="id"
                  valueInput={(name, id) =>
                    handleAddUser({ id: parseInt(id), name })
                  }
                  placeholder="Seleccione Usuario"
                />
                {usersData && (
                  <div className="subtask-lists-users">
                    {usersData.map((_user, index) => (
                      <div key={_user.id} className="col-list-user">
                        <span className="user-info">
                          {index + 1}
                          {') '}
                          {_user.name}
                        </span>
                        <button
                          type="button"
                          className="delete-list-user"
                          onClick={() => handleRemoveUser(_user)}
                        >
                          <img src="/svg/close.svg" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                text="ASIGNAR"
                className="subtask-add-btn"
                onClick={handleAddUserByTask}
              />
            </>
          )}
          {status !== 'UNRESOLVED' && (
            <div className="subtask-file-list">
              <h4 className="subtask-file-title">Archivos:</h4>
              <div className="subtask-files-content">
                {subTask.files
                  ?.filter(({ type }) => type === 'REVIEW')
                  .map(file => (
                    <div key={file.id} className="subtask-file-contain">
                      <a
                        href={`${URL}/review/${projectName}/${file.name}`}
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
                          {normalizeFileName(file.name)}
                        </span>
                      </a>
                      {((isStatusProcesOrDenied && isAuthorizedUser) ||
                        (isAuthorizedMod && status === 'INREVIEW')) && (
                        <ButtonDelete
                          icon="trash-red"
                          customOnClick={() => deleteFile(file.id)}
                          className="subtask-delete-icon"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="subtask-third">
          {areAuthorizedUsers && (
            <div className="subtask-btns">
              {status === 'PROCESS' && !isAuthorizedMod && (
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
          <h2>Precio: S/. {subTask.price}</h2>
          <h3>Total Horas: 24 horas</h3>
          <div className="statement">
            <div>
              <label>Archivo modelo:</label>
              <div className="subtask-fil">
                {subTask.files
                  ?.filter(({ type }) => type === 'MATERIAL')
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
                        ></img>
                        <span className="subtask-file-name">
                          {normalizeFileName(file.name)}
                        </span>
                      </a>
                      {isAuthorizedMod && status === 'UNRESOLVED' && (
                        <ButtonDelete
                          icon="trash-red"
                          customOnClick={() => deleteFile(file.id)}
                          className="subtask-delete-icons"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {isAuthorizedMod && (
            <Button
              text="REINICIAR TAREA"
              className="btn-declinar"
              onClick={handleReloadSubTask}
            />
          )}
        </div>
      </section>
    </div>
  );
};

// <div className="subtask-main-content">
//   <div className="subtask-content-files">
//     <div className="subtask-content-head">
//       <h3 className="subtask-info-title">Tarea: {subTask.name}</h3>
//       {isAuthorizedMod && status === 'UNRESOLVED' && (
//         <div className="subtask-content-btn-actions">
//           <ButtonDelete
//             icon="trash-red"
//             url={`/subtasks/${subTask.id}`}
//             customOnClick={handleSubTaskDelete}
//           />
//           <Button
//             icon="pencil"
//             className="speciality-edit-icon"
//             onClick={openModalEdit}
//           />
//         </div>
//       )}
//     </div>
//     {((isStatusProcesOrDenied && isAuthorizedUser) ||
//       (isAuthorizedMod && status === 'INREVIEW')) && (
//       <div className="subtask-file">
//         <h4 className="subtask-file-title">Subir Archivo:</h4>
//         <div className="subtask-file-send">
//           <div
//             className='subtask-upload'
//             onDrop={handleDrop}
//             onDragOver={event => event.preventDefault()}
//           >
//             {!selectedFile && <p>Arrastra los archivos aquí</p>}
//             <input type="file" onChange={handleFileChange} />
//           </div>
//           <Button
//             text="Subir archivo"
//             className="subtask-file-send-button"
//             onClick={() => handleUploadClick('REVIEW')}
//           />
//         </div>
//       </div>
//     )}
//     {status !== 'UNRESOLVED' && (
//       <div className="subtask-file">
//         <h4 className="subtask-file-title">Archivos:</h4>
//         <div className="subtask-files">
//           {subTask.files
//             ?.filter(({ type }) => type === 'REVIEW')
//             .map(file => (
//               <div key={file.id} className="subtask-file-contain">
//                 <a
//                   href={`${URL}/review/${projectName}/${file.name}`}
//                   target="_blank"
//                   className="subtask-file"
//                   download={'xyz.pdf'}
//                 >
//                   <img
//                     src="/svg/file-download.svg"
//                     alt="W3Schools"
//                     className="subtask-file-icon"
//                   ></img>
//                   <span className="subtask-file-name">
//                     {normalizeFileName(file.name)}
//                   </span>
//                 </a>
//                 {((isStatusProcesOrDenied && isAuthorizedUser) ||
//                   (isAuthorizedMod && status === 'INREVIEW')) && (
//                   <ButtonDelete
//                     icon="trash-red"
//                     customOnClick={() => deleteFile(file.id)}
//                     className="subtask-delete-icon"
//                   />
//                 )}
//               </div>
//             ))}
//         </div>
//       </div>
//     )}
//     {status === 'UNRESOLVED' && isAuthorizedMod && (
//       <>
//         <div className="subtask-file">
//           {/* <h4 className="subtask-file-title">Subir Recursos:</h4> */}
//           <div className="subtask-file-send">
//             <div
//               className='subtask-upload'
//               onDrop={handleDrop}
//               onDragOver={event => event.preventDefault()}
//             >
//               {!selectedFile && <p>Arrastra los archivos aquí</p>}
//               <input type="file" onChange={handleFileChange} />
//             </div>
//             <Button
//               text="Subir archivo"
//               className="subtask-file-send-button"
//               onClick={() => handleUploadClick('MATERIAL')}
//             />
//           </div>
//         </div>
//         <div className="subtask-add-users">
//           <div style={{width: '60%'}}>
//             <DropDownSimple
//               data={users}
//               textField="name"
//               itemKey="id"
//               label="Agregar Usuarios a la tarea:"
//               valueInput={(name, id) =>
//                 handleAddUser({ id: parseInt(id), name })
//               }
//             />
//             {usersData && (
//               <div className="subtask-lists-users">
//                 {usersData.map((_user, index) => (
//                   <div key={_user.id} className="col-list-user">
//                     <span className="user-info">
//                       {index + 1}
//                       {') '}
//                       {_user.name}
//                     </span>
//                     <button
//                       type="button"
//                       className="delete-list-user"
//                       onClick={() => handleRemoveUser(_user)}
//                     >
//                       <img src="/svg/close.svg" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <Button
//             text="ASIGNAR USUARIO"
//             className="subtask-file-send-button"
//             onClick={handleAddUserByTask}
//           />
//         </div>
//       </>
//     )}
//     {status === 'UNRESOLVED' && !isAuthorizedMod && (
//       <Button
//         text="ASIGNAR"
//         className="btn-revisar"
//         onClick={() => handleChangeStatus('ASIG')}
//       />
//     )}
//     {areAuthorizedUsers && (
//       <div className="btn-content">
//         {/* {(status === 'PROCESS' ||
//           (status === 'INREVIEW' && userSession.role !== 'EMPLOYEE')) && (
//           <Button
//             text={status === 'INREVIEW' ? 'Desaprobar' : 'Declinar'}
//             className="btn-declinar"
//             onClick={() => handleChangeStatus('DENY')}
//           />
//         )} */}
//         {status === 'PROCESS' && !isAuthorizedMod && (
//           <Button
//             text={'Declinar'}
//             className="btn-declinar"
//             onClick={handleReloadSubTask}
//           />
//         )}
//         {isAuthorizedMod && status === 'INREVIEW' && (
//           <Button
//             text={'Desaprobar'}
//             className="btn-declinar"
//             onClick={() => handleChangeStatus('DENY')}
//           />
//         )}

//         {/* {status !== 'DONE' &&
//           userSession.role === 'EMPLOYEE' &&
//           status !== 'INREVIEW' && (
//             <Button
//               text={
//                 status === 'UNRESOLVED' ? 'Asignar' : 'Mandar a Revisar'
//               }
//               className="btn-revisar"
//               onClick={() => handleChangeStatus('ASIG')}
//             />
//           )} */}

//         {(status === 'PROCESS' || status === 'DENIED') &&
//           !isAuthorizedMod && (
//             <Button
//               text="Mandar a Revisar"
//               className="btn-revisar"
//               onClick={() => handleChangeStatus('ASIG')}
//             />
//           )}
//         {status === 'INREVIEW' && isAuthorizedMod && (
//           <Button
//             text={'Aprobar'}
//             className="btn-revisar"
//             onClick={() => handleChangeStatus('ASIG')}
//           />
//         )}
//       </div>
//     )}
//   </div>
//   <div className="content-details">
//     <div className="status-content">
//       <label className="status-text status-hold">
//         {statusText[status as keyof typeof statusText]}
//       </label>
//     </div>
//     <p>Creación: 21/01/23</p>
//     <div className="content-advance">
//       <h4 className="content-file-title">Avance</h4>
//       <InputRange
//         maxRange={100}
//         percentage={percentage}
//         onChange={handleInputChange}
//       />
//     </div>
//     <label className="content-advance-label">
//       Precio por Avance: {subTask.price}
//     </label>
//     <div className="content-resource">
//       <h4 className="content-file-title">Enunciado:</h4>

//       <div className="statement">
//         <div>
//           <label>Archivo modelo:</label>
//           <div className="subtask-files">
//             {subTask.files
//               ?.filter(({ type }) => type === 'MATERIAL')
//               .map(file => (
//                 <div key={file.id} className="subtask-file-contain">
//                   <a
//                     href={`${URL}/models/${projectName}/${file.name}`}
//                     target="_blank"
//                     className="subtask-file"
//                     download={'xyz.pdf'}
//                   >
//                     <img
//                       src="/svg/file-download.svg"
//                       alt="W3Schools"
//                       className="subtask-file-icon"
//                     ></img>
//                     <span className="subtask-file-name">
//                       {normalizeFileName(file.name)}
//                     </span>
//                   </a>
//                   {isAuthorizedMod && status === 'UNRESOLVED' && (
//                     <ButtonDelete
//                       icon="trash-red"
//                       customOnClick={() => deleteFile(file.id)}
//                       className="subtask-delete-icon"
//                     />
//                   )}
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </div>
//     {isAuthorizedMod && (
//       <Button
//         text="REINICIAR TAREA"
//         className="btn-declinar"
//         onClick={handleReloadSubTask}
//       />
//     )}
//   </div>
// </div>
export default CardTaskInformation;
