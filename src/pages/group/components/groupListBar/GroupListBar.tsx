import { Group, Option } from '../../../../types';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import './groupListBar.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { DotsRight } from '../../../../components';
import { GroupBtnAdd } from '..';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GroupListBarProps {
  group: Group;
  onSave?: () => void;
  editOrder?: boolean;
}
const GroupListBar = ({ group, onSave, editOrder }: GroupListBarProps) => {
  const [edit, setEdit] = useState<boolean>(false);

  const dataDots: Option[] = [
    {
      name: 'Editar',
      type: 'button',
      icon: 'pencil',
      function: () => setEdit(true),
    },
  ];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: group.id,
    data: {
      type: 'Group',
      group,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className=" gr-sidebar-data xd"></div>
    );
  }
  return (
    <ContextMenuTrigger id={`gr-sidebar-${group.id}`} key={group.id}>
      {!edit ? (
        <NavLink
          to={`${
            editOrder ? '' : `contenido/${group.id}/GRUPO-${group.gNumber}`
          }`}
          className={({ isActive }) =>
            `gr-sidebar-data  ${isActive && 'contract-selected'} `
          }
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
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

          {!editOrder && (
            <DotsRight data={dataDots} idContext={`gr-sidebar-${group.id}`} />
          )}
        </NavLink>
      ) : (
        <GroupBtnAdd
          setBtnActive={() => setEdit(!edit)}
          onSave={() => onSave?.()}
          groupName={group.name}
          id={group.id}
        />
      )}
    </ContextMenuTrigger>
  );
};

export default GroupListBar;
