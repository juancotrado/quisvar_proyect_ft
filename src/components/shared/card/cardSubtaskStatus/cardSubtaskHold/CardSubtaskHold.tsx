import { useContext, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { axiosInstance } from '../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../context/SocketContex';
import Button from '../../../button/Button';
import { SubTask } from '../../../../../types/types';
import { isOpenModal$ } from '../../../../../services/sharingSubject';
import DropDownSimple from '../../../select/DropDownSimple';
import SubtaskFile from '../../../../subtasks/subtaskFiles/SubtaskFile';
import SubtaskUploadFiles from '../../../../subtasks/subtaskUploadFiles/SubtaskUploadFiles';
import SubtaskChangeStatusBtn from '../../../../subtasks/subtaskChangeStatusBtn/SubtaskChangeStatusBtn';
import SubTaskStatusLabel from '../../../../subtasks/subTaskStatusLabel/SubTaskStatusLabel';
import './cardSubtaskHold.css';

type DataUser = { id: number; name: string };
interface CardSubtaskHold {
  subTask: SubTask;
  isAuthorizedMod: boolean;
}

const CardSubtaskHold = ({ subTask, isAuthorizedMod }: CardSubtaskHold) => {
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
  };

  return (
    <div className="cardSubtaskHold">
      <section className="cardSubtaskHold-left-details">
        {isAuthorizedMod ? (
          <div className="cardSubtaskHold-files-content">
            <div className="cardSubtaskHold-add-files">
              <div className="cardSubtaskHold-models">
                <h2 className="cardSubtaskHold-models-title">
                  Archivo modelo:
                </h2>
                <SubtaskFile
                  files={subTask.files}
                  typeFile="MATERIAL"
                  showDeleteBtn={isAuthorizedMod}
                />
              </div>
              <SubtaskUploadFiles id={subTask.id} type="MATERIAL" />
            </div>
            <div className="cardSubtaskHold-add-users">
              <DropDownSimple
                label="Asignar Usuario"
                data={users}
                textField="name"
                itemKey="id"
                valueInput={(name, id) =>
                  handleAddUser({ id: parseInt(id), name })
                }
                placeholder="Seleccione Usuario"
              />
              {usersData && (
                <div className="cardSubtaskHold-lists-users">
                  {usersData.map((_user, index) => (
                    <div key={_user.id} className="cardSubtaskHold-list-user">
                      <span className="-cardSubtaskHold-user-info">
                        {index + 1}
                        {') '}
                        {_user.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(_user)}
                      >
                        <img
                          src="/svg/close.svg"
                          className="cardSubtaskHold-user-delete"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="cardSubtaskHold-asign-btn">
            <SubtaskChangeStatusBtn
              option="ASIG"
              type="assigned"
              subtaskId={subTask.id}
              subtaskStatus={status}
              text="Asignarme"
            />
          </div>
        )}
      </section>
      <section className="cardSubtaskHold-details">
        <SubTaskStatusLabel status={status} />
        <div className="cardSubtaskHold-info">
          <p className="cardSubtaskHold-info-date">Creación: 21/01/23</p>
          {!isAuthorizedMod && (
            <div className="cardSubtaskHold-files-models">
              <h2 className="cardSubtaskHold-files-models-title">
                Archivos Modelo:
              </h2>
              <SubtaskFile
                files={subTask.files}
                typeFile="MATERIAL"
                showDeleteBtn={false}
              />
            </div>
          )}
          <h2 className={'cardSubtaskHold-info-price'}>
            Precio: S/. {subTask.price}
          </h2>
        </div>
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
