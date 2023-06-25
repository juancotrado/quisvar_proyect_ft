import { useContext, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { statusText } from '../cardTaskInformation/constans';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import Button from '../../button/Button';
import { SubTask } from '../../../../types/types';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import DropDownSimple from '../../select/DropDownSimple';
import SubtaskFile from '../../../subtasks/subtaskFiles/SubtaskFile';
import SubtaskUploadFiles from '../../../subtasks/subtaskUploadFiles/SubtaskUploadFiles';

type DataUser = { id: number; name: string };
interface CardSubtaskHold {
  subTask: SubTask;
  isAuthorizedMod: boolean;
  handleChangeStatus: (option: 'ASIG' | 'DENY') => void;
  projectName: string;
}

const CardSubtaskHold = ({
  subTask,
  isAuthorizedMod,
  handleChangeStatus,
}: CardSubtaskHold) => {
  const socket = useContext(SocketContext);
  const [addBtn, setAddBtn] = useState(false);
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
  const { status } = subTask;
  const handleAddUser = (user: DataUser) => {
    setAddBtn(true);
    const getId = usersData.find(list => list.id == user.id);
    if (!getId) setUsersData([...usersData, user]);
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

  const handleRemoveUser = (user: DataUser) => {
    const filterValue = usersData.filter(list => list.id !== user.id);
    setUsersData(filterValue);
    if (usersData.length == 1) {
      setAddBtn(false);
    }
    console.log(usersData);
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
                <SubtaskFile
                  subTask={subTask}
                  typeFile="MATERIAL"
                  showDeleteBtn={isAuthorizedMod}
                />
              </div>
              <SubtaskUploadFiles id={subTask.id} type="MATERIAL" />
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
