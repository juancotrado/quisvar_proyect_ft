import { useContext, useState, ChangeEvent, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import ButtonDelete from '../../button/ButtonDelete';
import { statusBody, statusText } from '../cardTaskInformation/constans';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import Button from '../../button/Button';
import { SubTask, fyleType } from '../../../../types/types';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import DropDownSimple from '../../select/DropDownSimple';

type DataUser = { id: number; name: string };
interface CardSubtaskHold {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  isAuthorizedUser: boolean;
  projectName: string;
}

const CardSubtaskHold = ({
  subTask,
  isAuthorizedMod,
  isAuthorizedUser,
  projectName,
}: CardSubtaskHold) => {
  const socket = useContext(SocketContext);
  const [addBtn, setAddBtn] = useState(false);
  const [usersData, setUsersData] = useState<DataUser[]>([]);
  const [file, setFile] = useState<FileList[0] | null>();
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';
  const normalizeFileName = (name: string) => {
    const indexName = name.indexOf('$');
    return name.slice(indexName + 1);
  };
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
  const { status } = subTask;
  const handleAddUser = (user: DataUser) => {
    setAddBtn(true);
    const getId = usersData.find(list => list.id == user.id);
    if (!getId) setUsersData([...usersData, user]);
  };
  const getStatus = (
    category: string,
    role: string,
    state: string
  ): { status: string } | undefined => {
    return statusBody[category]?.[role]?.[state];
  };
  const handleChangeStatus = async (option: 'ASIG' | 'DENY') => {
    const body = getStatus(option, role, status);
    if (!body) return;

    const resStatus = await axiosInstance.patch(
      `/subtasks/status/${subTask.id}`,
      body
    );
    socket.emit('client:update-subTask', resStatus.data);
    isOpenModal$.setSubject = false;
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
  const handleRemoveUser = (user: DataUser) => {
    const filterValue = usersData.filter(list => list.id !== user.id);
    setUsersData(filterValue);
    if (usersData.length == 1) {
      setAddBtn(false);
    }
    console.log(usersData);
  };
  const handleFileChange = (
    type: fyleType,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    // setFile(e.target.files[0]);
    const formdata = new FormData();
    formdata.append('file', e.target.files[0]);
    axiosInstance
      .post(`/files/upload/${subTask.id}/?status=${type}`, formdata)
      .then(res => socket.emit('client:update-subTask', res.data));
    // setFile(null);
  };
  return (
    <div className="subtask-content-area">
      <section className="subtask-files">
        <div className="subtask-files-content">
          {isAuthorizedMod ? (
            <div className="subtask-add-files">
              <div className="subtask-models">
                <div style={{ width: '100%' }}>
                  <h2>Archivo modelo:</h2>
                </div>
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
                          />
                          <span className="subtask-file-name">
                            {normalizeFileName(file.name)}
                          </span>
                        </a>
                        {isAuthorizedMod && status === 'UNRESOLVED' && (
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
                  onChange={e => handleFileChange('MATERIAL', e)}
                  // onDragOver={handleDragOver}
                  onDragOver={event => event.preventDefault()}
                  onDrop={e => handleDrop('MATERIAL', e)}
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
          ) : (
            <div className="subtask-asign-btn">
              <Button
                text="Asignarme"
                className="btn-revisar"
                onClick={() => handleChangeStatus('ASIG')}
              />
            </div>
          )}
        </div>

        {isAuthorizedMod && (
          <div className="subtask-second">
            <div className="subtask-search-users">
              <DropDownSimple
                label="Asignar Usuario"
                data={users}
                textField="name"
                itemKey="id"
                valueInput={(name, id) =>
                  handleAddUser({ id: parseInt(id), name })
                }
                placeholder="Seleccione Usuario"
                className="subtask-dropdown"
              />
            </div>
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
          <h2>Precio: S/. {subTask.price}</h2>
          <h3>Total Horas: 24 horas</h3>
        </div>
        {isAuthorizedMod && (
          <Button
            text="RESTABLECER"
            className="btn-declinar"
            onClick={handleReloadSubTask}
          />
        )}
        {status === 'UNRESOLVED' && isAuthorizedMod && addBtn && (
          <Button
            text="LISTO"
            className="subtask-add-btn"
            onClick={handleAddUserByTask}
          />
        )}
      </section>
    </div>
  );
};

export default CardSubtaskHold;
