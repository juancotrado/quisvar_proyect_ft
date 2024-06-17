import { ChangeEvent, FocusEvent, useState } from 'react';
import { RolesAndPermissionsRadio } from '..';
import { Menu, MenuPoint, MenuRole } from '../../../../../../types';
import './addNewRol.css';
import { handleMenu } from '../../utils';
import { SnackbarUtilities } from '../../../../../../utils';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { Button } from '../../../../../../components';

interface AddNewRolProps {
  menuPoints: Menu[];
  onSave: () => void;
  handleAddNewRole: () => void;
}

const AddNewRol = ({
  menuPoints,
  onSave,
  handleAddNewRole,
}: AddNewRolProps) => {
  const [role, setRole] = useState<string>('');
  const [saveMenuPoints, setsaveMenuPoints] = useState<MenuPoint[]>([]);

  const handeChangeRol = ({ target }: FocusEvent<HTMLInputElement>) =>
    setRole(target.value);

  const addMenuPoint = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = target;
    const newMenuOption = handleMenu(value as MenuRole, +id, saveMenuPoints);
    setsaveMenuPoints(newMenuOption);
  };

  const createRol = () => {
    const body = {
      name: role,
      menuPoints: saveMenuPoints,
    };

    if (!role)
      return SnackbarUtilities.warning('No deje el campo de rol vacio.');
    if (saveMenuPoints.length === 0)
      return SnackbarUtilities.warning('Seleccion permisos para el rol.');
    axiosInstance.post('/role', body).then(() => {
      SnackbarUtilities.success('Rol creado correctamente');
      handleAddNewRole();
      onSave();
    });
  };
  return (
    <div>
      <div
        className="rolesAndPermissions-table-body"
        style={{
          gridTemplateColumns: `2fr repeat(${menuPoints?.length}, 1fr)`,
        }}
      >
        <div className="rolesAndPermissions-table-input-contain">
          <input
            className="rolesAndPermissions-table-input"
            placeholder="Escriba el rol"
            onBlur={handeChangeRol}
          />
        </div>
        {menuPoints.map(menuPoint => (
          <div className="rolesAndPermissions-table-body-options">
            {!menuPoint.menu && (
              <>
                {menuPoint.access.map(acc => (
                  <RolesAndPermissionsRadio
                    value={acc}
                    text={acc}
                    menuPointId={String(menuPoint.id)}
                    onChange={addMenuPoint}
                  />
                ))}
                <RolesAndPermissionsRadio
                  value={''}
                  text={'no'}
                  checked
                  menuPointId={String(menuPoint.id)}
                  onChange={addMenuPoint}
                />
              </>
            )}
          </div>
        ))}
      </div>
      <Button text="Guardar Rol" onClick={createRol} />
    </div>
  );
};

export default AddNewRol;
