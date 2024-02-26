import { Group, Option } from '../../../../types';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import './groupListBar.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { DotsRight } from '../../../../components';
import { GroupBtnAdd } from '..';

interface GroupListBarProps {
  group: Group;
  onSave: () => void;
}
const GroupListBar = ({ group, onSave }: GroupListBarProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  // const handleEditContract = () =>
  //   (isOpenCardRegisteContract$.setSubject = { isOpen: true, contract });

  //   const handleDeleteContract = () =>
  //     axiosInstance.delete(`contract/${contract.id}`).then(() => {
  //       SnackbarUtilities.success('El Contrato fue eliminado exitosamente');
  //       onSave();
  //     });

  const dataDots: Option[] = [
    {
      name: 'Editar',
      type: 'button',
      icon: 'pencil',
      function: () => setEdit(true),
    },
    // {
    //   name: 'Eliminar',
    //   type: 'button',
    //   icon: 'trash-red',
    //   //   function: handleDeleteContract,
    //   function: undefined,
    // },
  ];
  return (
    <ContextMenuTrigger id={`gr-sidebar-${group.id}`} key={group.id}>
      {!edit ? (
        <NavLink
          to={`contenido/${group.id}/GRUPO-${group.gNumber}`}
          className={({ isActive }) =>
            `gr-sidebar-data  ${isActive && 'contract-selected'} `
          }
        >
          <figure className="gr-sidebar-figure">
            <img
              src="/svg/dashicons_groups.svg"
              alt="W3Schools"
              style={{ width: 18 }}
            />
          </figure>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 className="gr-sidebar-name">GRUPO {group.gNumber}</h4>
            <h5 className="gr-sidebar-cui">{group.name}</h5>
          </div>

          <DotsRight data={dataDots} idContext={`gr-sidebar-${group.id}`} />
        </NavLink>
      ) : (
        <GroupBtnAdd
          setBtnActive={() => setEdit(!edit)}
          onSave={onSave}
          groupName={group.name}
          id={group.id}
        />
      )}
    </ContextMenuTrigger>
  );
};

export default GroupListBar;
