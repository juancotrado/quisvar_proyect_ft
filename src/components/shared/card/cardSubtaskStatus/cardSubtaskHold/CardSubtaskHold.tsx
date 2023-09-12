import { useContext, useState } from 'react';
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
import formatDate from '../../../../../utils/formatDate';
import useListUsers from '../../../../../hooks/useListUsers';

type DataUser = { id: number; name: string };
interface CardSubtaskHold {
  subTask: SubTask;
}

const CardSubtaskHold = ({ subTask }: CardSubtaskHold) => {
  const socket = useContext(SocketContext);
  const { userSession } = useSelector((state: RootState) => state);
  const isAuthorizedMod = true;
  const [addBtn, setAddBtn] = useState(false);
  const [usersData, setUsersData] = useState<DataUser[]>([]);

  const { users } = useListUsers();
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
            <h4 className="cardSubtaskHold-title-information">
              <figure className="cardSubtaskHold-figure">
                <img src="/svg/paper-clip.svg" alt="W3Schools" />
              </figure>
              Archivos modelos:
            </h4>
            <div className="cardSubtaskHold-add-files">
              <SubtaskUploadFiles id={subTask.id} type="MATERIAL" />
            </div>
            <div className="cardSubtaskHold-add-users">
              <div className="cardSubtaskHold-users-contain">
                <h4 className="cardSubtaskHold-title-information">
                  <figure className="cardSubtaskHold-figure">
                    <img src="/svg/asig-user.svg" alt="W3Schools" />
                  </figure>
                  Asignar Usuario:
                </h4>
                <DropDownSimple
                  data={users}
                  textField="name"
                  itemKey="id"
                  valueInput={(name, id) =>
                    handleAddUser({ id: parseInt(id), name })
                  }
                  placeholder="Seleccione Usuario"
                />
              </div>
              {usersData && (
                <div className="cardSubtaskHold-users-contain">
                  <h4 className="cardSubtaskHold-title-information">
                    <figure className="cardSubtaskHold-figure">
                      <img src="/svg/user-task.svg" alt="W3Schools" />
                    </figure>
                    Lista de Usuarios Asignados:
                  </h4>
                  {usersData.map(_user => (
                    <div key={_user.id} className="cardSubtaskHold-list-user">
                      <h5 className="cardSubtaskHold-user-info">
                        <figure className="cardSubtaskHold-figure">
                          <img src="/svg/person-add.svg" alt="W3Schools" />
                        </figure>
                        {_user.name}
                      </h5>
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
          <div className="cardSubtaskHold-files-content">
            <h2 className="cardSubtaskHold-files-models-title">
              Archivos Modelo:
            </h2>
            <SubtaskFile
              files={subTask.files}
              typeFile="MATERIAL"
              showDeleteBtn={isAuthorizedMod}
            />
          </div>
        )}
      </section>
      <section className="cardSubtaskHold-details">
        <SubTaskStatusLabel status={status} />
        <div className="cardSubtaskHold-info">
          {subTask.createdAt && (
            <p className="cardSubtaskHold-info-date">
              <b>Fecha de inicio: </b>
              {formatDate(new Date(subTask.createdAt), {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          <h2 className={'cardSubtaskHold-info-price'}>
            <b>Precio:</b> S/. {subTask.price}
          </h2>
          {isAuthorizedMod && (
            <div className="cardSubtaskHold-files-models">
              <h2 className="cardSubtaskHold-files-models-title">
                Archivos Modelo:
              </h2>
              <SubtaskFile
                files={subTask.files}
                typeFile="MATERIAL"
                showDeleteBtn={isAuthorizedMod}
              />
            </div>
          )}
        </div>
        {isAuthorizedMod && addBtn && (
          <Button
            text="LISTO"
            className="cardSubtaskHold-add-btn"
            onClick={handleAddUserByTask}
          />
        )}
        {userSession.role === 'EMPLOYEE' && (
          <SubtaskChangeStatusBtn
            option="ASIG"
            type="assigned"
            subtaskId={subTask.id}
            subtaskStatus={status}
            text="Asignarme"
            className="cardSubtaskHold-add-btn"
          />
        )}
      </section>
    </div>
  );
};

export default CardSubtaskHold;
