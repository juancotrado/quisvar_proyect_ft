import { ChangeEvent, useMemo, useState } from 'react';
import './userList.css';
import {
  CardGenerateReport,
  CardOpenFile,
  CardRegisterUser,
  CardViewDocs,
  Input,
} from '../../components';
import Button from '../../components/shared/button/Button';
import {
  isOpenCardFiles$,
  isOpenCardGenerateReport$,
  isOpenCardRegisterUser$,
  isOpenViewDocs$,
} from '../../services/sharingSubject';
import { User } from '../../types/types';
import UserInfo from '../../components/users/UserInfo';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getListUsers } from '../../store/slices/listUsers.slice';

const UsersList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { listUsers: users } = useSelector((state: RootState) => state);
  const [userDocs, setUserDocs] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isArchived, setIsArchived] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [printReportId, setPrintReportId] = useState<number>();

  const getUsers = async () => {
    dispatch(getListUsers());
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
  const handleViewDocs = (value: User) => {
    setUserDocs(value);
    isOpenViewDocs$.setSubject = true;
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
              text={`${isArchived ? 'Ver archivados' : 'Ver en actividad'}`}
              className={`btn-filter ${
                isArchived ? 'btn-filter-unavailable' : 'btn-filter-available'
              }`}
              onClick={() => setIsArchived(!isArchived)}
            />
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
          </div>
        </div>
        <div className="header-container-list">
          <div className="header-list-text user-grid">USUARIO</div>
          <div className="header-list-text">ROL DE TRABAJO</div>
          <div className="header-list-text">ESTADO</div>
          <div className="header-list-text">CARGO</div>
          <div className="header-list-text">CELULAR</div>
          <div className="header-list-text">Documentos</div>
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
            onViewDocs={() => handleViewDocs(user)}
          />
        ))}
      </div>
      <CardGenerateReport employeeId={printReportId} />
      <CardOpenFile />
      <CardViewDocs user={userDocs} />
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
