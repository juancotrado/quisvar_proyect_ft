import { Contract, Option } from '../../../types/types';
import { isOpenCardRegisteContract$ } from '../../../services/sharingSubject';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import DotsRight from '../../shared/dotsRight/DotsRight';
import { axiosInstance } from '../../../services/axiosInstance';
import { SnackbarUtilities } from '../../../utils/SnackbarManager';
import './sidebarContractCard.css';

interface SidebarContractCardProps {
  contract: Contract;
  contractSelected: Contract | null;
  onSave: () => void;
  handleSelectContract: (contract: Contract) => void;
  authUsers: boolean;
}
const SidebarContractCard = ({
  contract,
  onSave,
  authUsers,
  handleSelectContract,
  contractSelected,
}: SidebarContractCardProps) => {
  const handleEditContract = () =>
    (isOpenCardRegisteContract$.setSubject = { isOpen: true, contract });

  const handleDeleteContract = () =>
    axiosInstance.delete(`contract/${contract.id}`).then(() => {
      SnackbarUtilities.success('El Contrato fue eliminado exitosamente');
      onSave();
    });

  const onSelect = () => {
    handleSelectContract(contract);
  };
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
      <div
        className={`SidebarContractCard-sidebar-data   ${
          contractSelected?.id === contract.id && 'contract-selected'
        }`}
        onClick={onSelect}
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
      </div>
    </ContextMenuTrigger>
  );
};

export default SidebarContractCard;
