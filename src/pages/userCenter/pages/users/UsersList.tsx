import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './userList.css';
import { Button, CardGenerateReport, Input } from '../../../../components';
import {
  isOpenCardAddEquipment$,
  isOpenCardAssing$,
  isOpenCardFiles$,
  isOpenCardGenerateReport$,
  isOpenCardRegisterUser$,
} from '../../../../services/sharingSubject';
import {
  Equipment as Equip,
  GeneralFile,
  RoleForm,
  WorkStation,
} from '../../../../types';
import { AppDispatch, RootState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getListUsers } from '../../../../store/slices/listUsers.slice';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Equipment, UserInfo } from './components';
import {
  CardAddEquipment,
  CardAssign,
  CardOpenFile,
  CardRegisterUser,
  CardViewDocs,
} from './views';

const UsersList = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.listUsers);
  const [isArchived, setIsArchived] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [printReportId, setPrintReportId] = useState<number>();
  const [workStations, setWorkStations] = useState<WorkStation[]>();
  const [roles, setRoles] = useState<RoleForm[] | null>(null);
  const [generalFiles, setGeneralFiles] = useState<GeneralFile[] | null>(null);

  useEffect(() => {
    (async () => {
      await getWorkStations();
      await getGeneralFiles();
      await getRoles();
    })();
  }, []);

  const getGeneralFiles = async () => {
    const response = await axiosInstance.get('/files/generalFiles');
    setGeneralFiles(response.data);
  };
  const getRoles = async () => {
    const response = await axiosInstance.get<RoleForm[]>('/role/form');
    setRoles(response.data);
  };
  const getUsers = async () => {
    dispatch(getListUsers());
  };
  const getWorkStations = async () => {
    const response = await axiosInstance.get('/workStation');
    setWorkStations(response.data);
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
    if (!roles) return;
    isOpenCardRegisterUser$.setSubject = { isOpen: true, roles };
  };

  const printReport = (value: number) => {
    setPrintReportId(value);
    isOpenCardGenerateReport$.setSubject = true;
  };
  const handleOpenCardFiles = () => {
    isOpenCardFiles$.setSubject = true;
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
        <div style={{ width: '100%', overflowY: 'auto' }}>
          {roles &&
            filterList.map((user, index) => (
              <UserInfo
                key={user.id}
                user={user}
                roles={roles}
                index={index}
                onPrint={() => printReport(user.id)}
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
      <CardAddEquipment onSave={getWorkStations} />
      <CardAssign onSave={getWorkStations} />
      <CardGenerateReport employeeId={printReportId} />
      {generalFiles && (
        <CardOpenFile
          generalFiles={generalFiles}
          getGeneralFiles={getGeneralFiles}
        />
      )}
      <CardViewDocs />
      <CardRegisterUser onSave={getUsers} generalFiles={generalFiles} />
    </div>
  );
};

export default UsersList;
