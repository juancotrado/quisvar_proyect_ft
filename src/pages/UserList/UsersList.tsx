import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './userList.css';
import { CardGenerateReport, CardRegisterUser, Input } from '../../components';
import Button from '../../components/shared/button/Button';
import { URL, axiosInstance } from '../../services/axiosInstance';
import { isOpenCardRegisterUser$ } from '../../services/sharingSubject';
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
  const [searchTerm, setSearchTerm] = useState('');
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
  const filterList = useMemo(() => {
    if (!users) return [];

    const filteredByStatus = users.filter(user => user.status === isArchived);

    if (!searchTerm) return filteredByStatus;

    return filteredByStatus.filter(
      user =>
        user.profile.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [isArchived, searchTerm, users]);
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const addUser = () => {
    setUserData(null);
    isOpenCardRegisterUser$.setSubject = true;
  };
  const editUser = (value: User) => {
    isOpenCardRegisterUser$.setSubject = true;
    setUserData(value);
  };

  return (
    <div className="content-list">
      <div className="user-list">
        <div className="list-title">
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">USUARIOS </span>
          </h1>
        </div>
        <div className="userList-options">
          <Input
            type="text"
            placeholder="Buscar por nombre o apellido"
            value={searchTerm}
            onChange={handleSearchChange}
            classNameMain="filter-user-input"
          />
          <div className="userList-options-right">
            <div className="userList-upload-contain">
              <UploadFile
                text="Subir Archivo"
                onSave={getGeneralFiles}
                uploadName="generalFile"
                URL={`/files/uploadGeneralFiles`}
                className="userList-upload"
              />
            </div>
            {generalFiles && (
              <div className="userList-general-files">
                <Button
                  text={isShowFiles ? 'Cerrar Archivos' : 'Abrir Archivos'}
                  className="userList-btn"
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
                className="userList-btn"
                onClick={addUser}
              />
            </div>
            <Button
              text={`${isArchived ? 'Ver archivados' : 'Ver en actividad'}`}
              className={`btn-filter ${
                isArchived ? 'btn-filter-unavailable' : 'btn-filter-available'
              }`}
              onClick={() => setIsArchived(!isArchived)}
            />
          </div>
        </div>
        <div className="header-container-list">
          <div className="header-list-text user-grid">USUARIO</div>
          <div className="header-list-text">ROL DE TRABAJO</div>
          <div className="header-list-text">ESTADO</div>
          <div className="header-list-text">CARGO</div>
          <div className="header-list-text">CELULAR</div>
          <div className="header-list-text">CV</div>
          <div className="header-list-text">DECLARACION JURADA</div>
          <div className="header-list-text">CONTRATO</div>
          <div className="header-list-text">EDITAR</div>
          <div className="header-list-text">Reportes</div>
        </div>
        {filterList.map(user => (
          <UserInfo
            key={user.id}
            user={user}
            getUsers={getUsers}
            onUpdate={() => editUser(user)}
          />
        ))}
      </div>
      <CardGenerateReport />

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
