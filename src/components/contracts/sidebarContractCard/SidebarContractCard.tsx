import { Contract, Option } from '../../../types/types';
import { isOpenCardRegisteContract$ } from '../../../services/sharingSubject';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import DotsRight from '../../shared/dotsRight/DotsRight';
import { axiosInstance } from '../../../services/axiosInstance';
import { SnackbarUtilities } from '../../../utils/SnackbarManager';
import './sidebarContractCard.css';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarContractCardProps {
  contract: Contract;
  onSave: () => void;
  authUsers: boolean;
}
const SidebarContractCard = ({
  contract,
  onSave,
  authUsers,
}: SidebarContractCardProps) => {
  const handleEditContract = () =>
    (isOpenCardRegisteContract$.setSubject = { isOpen: true, contract });

  const handleDeleteContract = () =>
    axiosInstance.delete(`contract/${contract.id}`).then(() => {
      SnackbarUtilities.success('El Contrato fue eliminado exitosamente');
      onSave();
    });

  const dataDots: Option[] = [
    {
      name: 'Editar',
      type: 'button',
      icon: 'pencil',
      function: handleEditContract,
    },
    {
      name: 'Eliminar',
      type: 'button',
      icon: 'trash-red',
      function: handleDeleteContract,
    },
  ];
  return (
    <ContextMenuTrigger
      id={`SidebarContractCard-sidebar-${contract.id}`}
      key={contract.id}
    >
      <NavLink
        to={`contrato/${contract.id}/detalles`}
        // className={`SidebarContractCard-sidebar-data   ${
        //   contractId === contract.id && 'contract-selected'
        // }`}
        className={({ isActive }) =>
          `SidebarContractCard-sidebar-data  ${
            isActive && 'contract-selected'
          } `
        }
      >
        <figure className="SidebarContractCard-sidebar-figure">
          <img src="/svg/contracts-icon.svg" alt="W3Schools" />
        </figure>
        <div>
          <h4 className="SidebarContractCard-sidebar-name">{contract.name}</h4>
          <h5 className="SidebarContractCard-sidebar-cui">{contract.cui}</h5>
        </div>
        {authUsers && (
          <DotsRight
            data={dataDots}
            idContext={`SidebarContractCard-sidebar-${contract.id}`}
          />
        )}
      </NavLink>
    </ContextMenuTrigger>
  );
};

export default SidebarContractCard;
