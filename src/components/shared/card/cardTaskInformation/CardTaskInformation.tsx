import {
  isOpenModal$,
  isTaskInformation$,
} from '../../../../services/sharingSubject';
import './cardTaskInformation.css';
import Button from '../../button/Button';
import { ChangeEvent, useContext, useState } from 'react';
import { SubTask, fyleType } from '../../../../types/types';
import { SocketContext } from '../../../../context/SocketContex';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import {
  CardSubtaskDone,
  CardSubtaskHold,
  CardSubtaskProcess,
  InputRange,
} from '../../../index';
import ButtonDelete from '../../button/ButtonDelete';
import { statusBody, statusText } from './constans';
import DropDownSimple from '../../select/DropDownSimple';
import { SnackbarUtilities } from '../../../../utils/SnackbarManager';
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
  const [hasPdf, setHasPdf] = useState(false);
  const role = userSession.role === 'EMPLOYEE' ? 'EMPLOYEE' : 'SUPERADMIN';
  const [usersData, setUsersData] = useState<DataUser[]>([]);
  const { listUsers } = useSelector((state: RootState) => state);

  // // const users = useMemo(
  // //   () =>
  // //     listUsers
  // //       ? listUsers
  // //           .filter(({ role }) => role === 'EMPLOYEE')
  // //           .map(({ profile, ...props }) => ({
  // //             name: `${profile.firstName} ${profile.lastName}`,
  // //             ...props,
  // //           }))
  // //       : [],
  // //   [listUsers]
  // // );
  // const handleDrop = (
  //   type: fyleType,
  //   event: React.DragEvent<HTMLDivElement>
  // ) => {
  //   event.preventDefault();
  //   const file = event.dataTransfer.files[0];
  //   const formdata = new FormData();
  //   formdata.append('file', file);
  //   axiosInstance
  //     .post(`/files/upload/${subTask.id}/?status=${type}`, formdata)
  //     .then(res => socket.emit('client:update-subTask', res.data));
  //   // setFile(file);
  // };
  const closeModal = () => {
    isTaskInformation$.setSubject = false;
    isOpenModal$.setSubject = false;
  };

  const handleSubTaskDelete = () => {
    axiosInstance.delete(`/subtasks/${subTask.id}`).then(res => {
      socket.emit('client:delete-subTask', res.data);
      isOpenModal$.setSubject = false;
    });
  };

  const { status } = subTask;

  const isAuthorizedUser = subTask?.users?.some(
    ({ user }) => user.profile.userId === userSession.id
  );

  const areAuthorizedUsers = isAuthorizedMod || isAuthorizedUser;
  return (
    <div className="subtask-container">
      <Button
        type="button"
        icon={'close'}
        className="close-modal"
        onClick={closeModal}
      />
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
      {status === 'UNRESOLVED' && (
        <CardSubtaskHold
          subTask={subTask}
          isAuthorizedMod={isAuthorizedMod}
          projectName={projectName}
        />
      )}
      {(status === 'PROCESS' ||
        status === 'INREVIEW' ||
        status === 'DENIED') && (
        <CardSubtaskProcess
          subTask={subTask}
          isAuthorizedMod={isAuthorizedMod}
          isAuthorizedUser={isAuthorizedUser}
          areAuthorizedUsers={areAuthorizedUsers}
        />
      )}
      {status === 'DONE' && (
        <CardSubtaskDone subTask={subTask} isAuthorizedMod={isAuthorizedMod} />
      )}
    </div>
  );
};
export default CardTaskInformation;
