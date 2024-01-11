import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import './userList.css';
import {
  CardAssign,
  CardGenerateReport,
  CardOpenFile,
  CardRegisterUser,
  CardViewDocs,
  Equipment,
  Input,
} from '../../components';
import Button from '../../components/shared/button/Button';
import {
  isOpenCardAddEquipment$,
  isOpenCardAssing$,
  isOpenCardFiles$,
  isOpenCardGenerateReport$,
  isOpenCardRegisterUser$,
  isOpenViewDocs$,
} from '../../services/sharingSubject';
import {
  Equipment as Equip,
  GeneralFile,
  User,
  WorkStation,
} from '../../types/types';
import UserInfo from '../../components/users/UserInfo';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getListUsers } from '../../store/slices/listUsers.slice';
import CardAddEquipment from '../../components/shared/card/CardAddEquipment/CardAddEquipment';
import { axiosInstance } from '../../services/axiosInstance';

const UsersList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { listUsers: users } = useSelector((state: RootState) => state);
  const [userDocs, setUserDocs] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isArchived, setIsArchived] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [printReportId, setPrintReportId] = useState<number>();
  const [workStations, setWorkStations] = useState<WorkStation[]>();
  const [generalFiles, setGeneralFiles] = useState<GeneralFile[] | null>(null);
  const getGeneralFiles = async () => {
    await axiosInstance.get('/files/generalFiles').then(res => {
      setGeneralFiles(res.data);
    });
  };
  const getUsers = async () => {
    dispatch(getListUsers());
  };
  const getWorkStations = useCallback(() => {
    axiosInstance.get('/workStation').then(res => setWorkStations(res.data));
  }, []);
  useEffect(() => {
    getWorkStations();
    getGeneralFiles();
  }, [getWorkStations]);

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
  const handleOpenAddEquipment = (isOpen: boolean, data?: WorkStation) => {
    isOpenCardAddEquipment$.setSubject = {
      isOpen,
      data,
    };
  };
  const handleOpenAssing = (isOpen: boolean, id: number, data?: Equip) => {
    isOpenCardAssing$.setSubject = {
      isOpen,
      id,
      data,
    };
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
            <p>
              Usuarios {isArchived ? 'Activos' : 'Inactivos'}:{' '}
              <span
                className={`${
                  !isArchived
                    ? 'btn-filter-unavailable'
                    : 'btn-filter-available'
                } user-count`}
              >
                {filterList.length}
              </span>
            </p>
            <Button
              text={`${isArchived ? 'Ver archivados' : 'Ver en actividad'}`}
              className={`btn-filter ${
                isArchived ? 'btn-filter-unavailable' : 'btn-filter-available'
              }`}
              onClick={() => setIsArchived(!isArchived)}
            />
            <Button
              text="Equipos"
              className="userList-btn"
              // onClick={handleOpenCardFiles}
            />
            <Button
              text="Ver Directivas"
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
        <div className="header-container-list header-grid-row">
          <div className="header-list-text">USUARIO</div>
          <div className="header-list-text">ROL DE TRABAJO</div>
          <div className="header-list-text">PROFESIÓN</div>
          <div className="header-list-text">CELULAR</div>
          <div className="header-list-text">ESTADO</div>
          <div className="header-list-text">DOCUMENTOS</div>
          <div className="header-list-text">EDITAR</div>
          <div className="header-list-text">REPORTES</div>
        </div>
        <div style={{ width: '100%', height: '750px', overflowY: 'auto' }}>
          {filterList.map((user, index) => (
            <UserInfo
              key={user.id}
              user={user}
              index={index}
              onUpdate={() => editUser(user)}
              onPrint={() => printReport(user.id)}
              onViewDocs={() => handleViewDocs(user)}
            />
          ))}
        </div>
      </div>
      <div className="user-list-equipment">
        <div className="ule-header">
          <h4>Equipos</h4>
          <Button
            text="Agregar Equipo"
            icon="plus"
            className="userList-btn"
            onClick={() => handleOpenAddEquipment(true)}
          />
        </div>
        {workStations &&
          workStations.map(workStation => (
            <Equipment
              data={workStation}
              openCard={handleOpenAssing}
              key={workStation.id}
              handleEdit={handleOpenAssing}
              handleEditWS={handleOpenAddEquipment}
              onSave={() => getWorkStations()}
            />
          ))}
      </div>
      <CardAddEquipment onSave={() => getWorkStations()} />
      <CardAssign onSave={() => getWorkStations()} />
      <CardGenerateReport employeeId={printReportId} />
      {generalFiles && (
        <CardOpenFile
          generalFiles={generalFiles}
          getGeneralFiles={getGeneralFiles}
        />
      )}
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
        generalFiles={generalFiles}
        workStations={workStations}
      />
    </div>
  );
};

export default UsersList;
