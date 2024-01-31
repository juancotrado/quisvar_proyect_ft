import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';
import { RolesAndPermissionsRadio } from '..';
import {
  MenuPoint,
  MenuRole,
  MenuRoleForm,
  Option,
  Roles,
} from '../../../../../../types';
import './roleTableRow.css';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { DotsRight } from '../../../../../../components';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { handleMenu } from '../../utils';
import { SnackbarUtilities } from '../../../../../../utils';

interface RoleTableRowProps {
  rol: Roles;
  onSave: () => void;
}

const RoleTableRow = ({ rol, onSave }: RoleTableRowProps) => {
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const [role, setRole] = useState<string>(rol.name);
  const [menuPoints, setMenuPoints] = useState<MenuRoleForm[]>(rol.menuPoints);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [editMenuPoints, setEditMenuPoints] = useState<MenuPoint[]>(
    rol.menuPointsDb
  );

  const handeChangeRol = ({ target }: FocusEvent<HTMLInputElement>) =>
    setRole(target.value);

  useEffect(() => {
    setEditMenuPoints(rol.menuPointsDb);
    setMenuPoints(menuPoints);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [rol]);

  const handleEditMenuPoint = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = target;
    const [_roleId, menuId] = id.split('-');

    const newMenuOption = handleMenu(
      value as MenuRole,
      +menuId,
      editMenuPoints
    );
    setEditMenuPoints(newMenuOption);
  };

  const handleDeleteRole = () => {
    axiosInstance.delete(`/role/${rol.id}`).then(() => {
      SnackbarUtilities.success(`Rol: "${role}" eliminado correctamente`);
      onSave();
    });
  };

  const handleEditMenu = () => {
    const body = {
      name: role,
      menuPoints: editMenuPoints,
    };
    if (!role)
      return SnackbarUtilities.warning('No deje el campo de rol vacio.');
    if (editMenuPoints.length === 0)
      return SnackbarUtilities.warning('Seleccion permisos para el rol.');
    axiosInstance.put(`/role/${rol.id}`, body).then(() => {
      SnackbarUtilities.success(`Rol: "${role}" editado correctamente`);
      handlOpenEditData();
      onSave();
    });
  };

  const handlOpenEditData = () => {
    if (openEditData) {
      setRole(rol.name);
      setMenuPoints([]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setMenuPoints(rol.menuPoints);
      }, 1);
    }
    setOpenEditData(!openEditData);
  };
  const dataDots: Option[] = [
    {
      name: openEditData ? 'Cancelar' : 'Editar',
      type: openEditData ? 'submit' : 'button',
      icon: openEditData ? 'close' : 'pencil',
      function: handlOpenEditData,
    },
    {
      name: openEditData ? 'Guardar' : 'Eliminar',
      type: openEditData ? 'submit' : 'button',
      icon: openEditData ? 'save' : 'trash-red',
      function: openEditData ? handleEditMenu : handleDeleteRole,
    },
  ];

  return (
    <ContextMenuTrigger id={`RoleTableRow-${rol.id}`}>
      <div
        key={rol.id}
        className="rolesAndPermissions-table-body"
        style={{
          gridTemplateColumns: `2fr repeat(${rol.menuPoints?.length}, 1fr)`,
        }}
      >
        {!openEditData && <div className="roleTableRow-block" />}
        {openEditData ? (
          <div className="rolesAndPermissions-table-input-contain">
            <input
              className="rolesAndPermissions-table-input"
              placeholder="Escriba el rol"
              onBlur={handeChangeRol}
              defaultValue={role}
            />
          </div>
        ) : (
          <div className="rolesAndPermissions-table-subHeader-text">
            {rol.name}
          </div>
        )}
        {menuPoints.map(menuPoint => (
          <div
            key={menuPoint.id}
            className="rolesAndPermissions-table-body-options"
          >
            {menuPoint.access.map(acc => (
              <RolesAndPermissionsRadio
                key={acc}
                value={acc}
                text={acc}
                menuPointId={`${rol.id}-${menuPoint.id}`}
                checked={acc === menuPoint.typeRol}
                onChange={handleEditMenuPoint}
              />
            ))}
            <RolesAndPermissionsRadio
              value={''}
              text={'NO'}
              checked={!menuPoint.typeRol}
              menuPointId={`${rol.id}-${menuPoint.id}`}
              onChange={handleEditMenuPoint}
            />
          </div>
        ))}
      </div>

      <DotsRight data={dataDots} idContext={`RoleTableRow-${rol.id}`} />
    </ContextMenuTrigger>
  );
};

export default RoleTableRow;
