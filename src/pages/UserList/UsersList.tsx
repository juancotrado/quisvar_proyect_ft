import { useEffect, useMemo, useState } from 'react';
import './userList.css';
import { CardRegisterUser } from '../../components';
import Button from '../../components/shared/button/Button';
import { URL, axiosInstance } from '../../services/axiosInstance';
import { isOpenModal$ } from '../../services/sharingSubject';
import { User } from '../../types/types';
import UserInfo from '../../components/users/UserInfo';
import UploadFile from '../../components/shared/uploadFile/UploadFile';
import ButtonDelete from '../../components/shared/button/ButtonDelete';

interface GeneralFile {
  id: number;
  name: string;
  dir: string;
}
const UsersList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isArchived, setIsArchived] = useState(true);
  const [isShowFiles, setIsShowFiles] = useState(false);
  const [generalFiles, setGeneralFiles] = useState<GeneralFile[] | null>(null);
  useEffect(() => {
    getUsers();
    getGeneralFiles();
  }, []);

  const getUsers = async () => {
    await axiosInstance.get('/users').then(res => {
      setUsers(res.data);
    });
  };
  const getGeneralFiles = async () => {
    await axiosInstance.get('/files/generalFiles').then(res => {
      setGeneralFiles(res.data);
    });
  };
  const handleShowFiles = () => setIsShowFiles(!isShowFiles);
  const filterList = useMemo(
    () => (users ? users?.filter(user => user.status === isArchived) : []),
    [isArchived, users]
  );

  const addUser = () => {
    setUserData(null);
    isOpenModal$.setSubject = true;
  };
  const editUser = (value: User) => {
    isOpenModal$.setSubject = true;
    setUserData(value);
  };

  return (
    <div className="content-list">
      <div className="user-list">
        <div className="list-title">
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">USUARIOS </span>
          </h1>
          <div className="userList-upload">
            <UploadFile
              text="Subir Archivo"
              onSave={getGeneralFiles}
              uploadName="generalFile"
              URL={`/files/uploadGeneralFiles`}
            />
          </div>
          {generalFiles && (
            <div className="userList-general-files">
              <Button
                text="ver Archivos"
                className="btn-add"
                onClick={handleShowFiles}
              />
              <div
                className={`userList-general-files-contain ${
                  isShowFiles && 'isShowGeneralFiles'
                }`}
              >
                {generalFiles.map(file => (
                  <div key={file.id} className="subtaskFile-contain">
                    <a
                      href={`${URL}/${file.dir}`}
                      target="_blank"
                      className="subtaskFile-anchor"
                      download={true}
                    >
                      <img
                        src="/svg/file-download.svg"
                        alt="W3Schools"
                        className="subtaskFile-icon"
                      />
                      <span className="subtaskFile-name">{file.name}</span>
                    </a>

                    <ButtonDelete
                      icon="trash-red"
                      onSave={getGeneralFiles}
                      url={`/files/generalFiles/${file.id}`}
                      // onClick={() => deleteFile(file.id)}
                      // customOnClick={() => deleteFile(file.id)}
                      className="subtaskFile-btn-delete"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <Button
              text="Agregar"
              icon="plus"
              className="btn-add"
              onClick={addUser}
            />
          </div>
        </div>
        <div className="list-filter">
          <Button
            text={`${isArchived ? 'Ver archivados' : 'Ver en actividad'}`}
            className={`${
              isArchived ? 'btn-filter-unavailable' : 'btn-filter-available'
            }`}
            onClick={() => setIsArchived(!isArchived)}
          />
        </div>
        <div className="header-container-list">
          <div className="header-list-user">USUARIO</div>
          <div className="header-list-role">ROL DE TRABAJO</div>
          <div className="header-list-status">ESTADO</div>
          <div className="header-list-dni">CARGO</div>
          <div className="header-list-phone">CELULAR</div>
          <div className="header-list-phone">CV</div>
          <div className="header-list-phone">CONTRATO</div>

          <div className="header-list-edit">EDITAR</div>
        </div>
        <div className="user-container-list">
          {filterList.map(user => (
            <UserInfo
              key={user.id}
              user={user}
              getUsers={getUsers}
              onUpdate={() => editUser(user)}
            />
          ))}
        </div>
      </div>
      <CardRegisterUser
        user={userData}
        onClose={() => {
          setUserData(null);
        }}
        onSave={() => {
          getUsers();
          setUserData(null);
        }}
      />
    </div>
  );
};

export default UsersList;
