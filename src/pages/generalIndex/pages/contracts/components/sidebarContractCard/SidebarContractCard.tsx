import { Contract, Option } from '../../../../../../types';
import { isOpenCardRegisteContract$ } from '../../../../../../services/sharingSubject';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { SnackbarUtilities, millisecondsToDays } from '../../../../../../utils';
import './sidebarContractCard.css';
import { NavLink, useLocation } from 'react-router-dom';
import { DotsRight } from '../../../../../../components';
import { PhaseData } from '../../pages/detailsContracts/models';
import { useCallback } from 'react';

interface SidebarContractCardProps {
  contract: Contract;
  onSave: () => void;
  authUsers: boolean;
}
export const SidebarContractCard = ({
  contract,
  onSave,
  authUsers,
}: SidebarContractCardProps) => {
  const handleEditContract = () =>
    (isOpenCardRegisteContract$.setSubject = { isOpen: true, contract });
  const location = useLocation();
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

  const getColorStatus = useCallback(() => {
    const { createdAt, phases } = contract;
    const phasesParse: PhaseData[] = JSON.parse(phases);
    const findPhase = phasesParse.find(phase => phase.isActive);
    if (!findPhase) return 'bg-color-review';
    const dayPhase = findPhase?.days ?? 0;
    const contractSigningDate = new Date(createdAt);
    const actualDate = new Date();
    contractSigningDate.setDate(
      contractSigningDate.getDate() + Number(dayPhase) + 1
    );
    const daysDifference = millisecondsToDays(
      contractSigningDate.valueOf() - actualDate.valueOf()
    );
    if (Math.sign(daysDifference) === -1) return 'bg-color-unresolved';
    if (daysDifference - 14 < 0) return 'bg-color-process';
    return 'bg-color-done';
  }, [contract]);

  return (
    <ContextMenuTrigger
      id={`SidebarContractCard-sidebar-${contract.id}`}
      key={contract.id}
      className="SidebarContractCard"
    >
      <NavLink
        to={{
          pathname: `contrato/${contract.id}/detalles`,
          search: location.search,
        }}
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
          <h4 className="SidebarContractCard-sidebar-name">
            {contract.contractNumber}
          </h4>
          <h5 className="SidebarContractCard-sidebar-cui">{contract.cui}</h5>
        </div>
        {authUsers && (
          <DotsRight
            data={dataDots}
            idContext={`SidebarContractCard-sidebar-${contract.id}`}
          />
        )}
      </NavLink>

      <div className={`contractCard-circle-status  ${getColorStatus()}`} />
    </ContextMenuTrigger>
  );
};
