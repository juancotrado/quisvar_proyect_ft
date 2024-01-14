import { Group, Option } from '../../../types/types';
// import { isOpenCardRegisteContract$ } from '../../../services/sharingSubject';
import { ContextMenuTrigger } from 'rctx-contextmenu';
// import { axiosInstance } from '../../../services/axiosInstance';
// import { SnackbarUtilities } from '../../../utils/SnackbarManager';
import './groupListBar.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { DotsRight, GroupBtnAdd } from '../..';

interface GroupListBarProps {
  group: Group;
  index: number;
  onSave: () => void;
}
const GroupListBar = ({ group, onSave, index }: GroupListBarProps) => {
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
          to={`contenido/${group.id}/GRUPO ${index}`}
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
            <h4 className="gr-sidebar-name">GRUPO {index}</h4>
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
