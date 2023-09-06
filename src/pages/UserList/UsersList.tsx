import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './userList.css';
import {
  CardGenerateReport,
  CardOpenFile,
  CardRegisterUser,
  Input,
} from '../../components';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import {
  isOpenCardFiles$,
  isOpenCardGenerateReport$,
  isOpenCardRegisterUser$,
} from '../../services/sharingSubject';
import { User } from '../../types/types';
import UserInfo from '../../components/users/UserInfo';

const UsersList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isArchived, setIsArchived] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [printReportId, setPrintReportId] = useState<number>();
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    await axiosInstance.get('/users').then(res => {
      setUsers(res.data);
    });
  };

  const filterList = useMemo(() => {
    if (!users) return [];

    const filteredByStatus = users.filter(user => user.status === isArchived);

    if (!searchTerm) return filteredByStatus;

    return filteredByStatus.filter(user =>
      user.profile.dni.startsWith(searchTerm)
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
  const printReport = (value: number) => {
    setPrintReportId(value);
    isOpenCardGenerateReport$.setSubject = true;
  };
  const handleOpenCardFiles = () => {
    isOpenCardFiles$.setSubject = true;
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
            placeholder="Buscar por DNI"
            value={searchTerm}
            onChange={handleSearchChange}
            classNameMain="filter-user-input"
          />
          <div className="userList-options-right">
            <Button
              text="Ver Archivos"
              className="userList-btn"
              onClick={handleOpenCardFiles}
            />

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
            onPrint={() => printReport(user.id)}
          />
        ))}
      </div>
      <CardGenerateReport employeeId={printReportId} />
      <CardOpenFile />
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
