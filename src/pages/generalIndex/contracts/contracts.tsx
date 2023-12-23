import { useEffect, useState } from 'react';
import DropdownLevelContract from '../../../components/contracts/costTable/dropdownLevelContract/DropdownLevelContract';
import CardRegisterContract from '../../../components/shared/card/cardRegisterContract/CardRegisterContract';
import { isOpenCardRegisteContract$ } from '../../../services/sharingSubject';
import './contracts.css';
import { contractIndexData } from './contractsData';
import { axiosInstance } from '../../../services/axiosInstance';
import { Contract, Option } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { rolSecondLevel } from '../../../utils/roles';
import DotsRight from '../../../components/shared/dotsRight/DotsRight';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { SnackbarUtilities } from '../../../utils/SnackbarManager';

const Contracts = () => {
  const [contractIndex, setContractIndex] = useState(contractIndexData);
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const { role } = useSelector((state: RootState) => state.userSession);
  const addContract = () => {
    isOpenCardRegisteContract$.setSubject = { isOpen: true };
  };

  useEffect(() => {
    getContracts();
  }, []);

  const getContracts = () => {
    axiosInstance.get('contract').then(res => setContracts(res.data));
  };

  const editFileContractIndex = (id: string, value: 'yes' | 'no') => {
    const arrayId = id.split('.').map(el => +el - 1);
    const contract = contractIndex?.at(arrayId[0]);
    const nextLevel = contract?.nextLevel?.at(arrayId[1]);
    if (arrayId.length === 2) {
      if (contract && nextLevel) {
        nextLevel.hasFile = value;
      }
    }
    if (arrayId.length === 3) {
      const nextLevel2 = nextLevel?.nextLevel?.at(arrayId[2]);
      if (contract && nextLevel && nextLevel2) {
        nextLevel2.hasFile = value;
      }
    }
    setContractIndex([...contractIndex]);
  };

  const levelData = { id: '0', name: '', nivel: 0, nextLevel: contractIndex };
  const authUsers = rolSecondLevel.includes(role);

  const sidebarDataContainer = (contract: Contract) => {
    const handleEditContract = () =>
      (isOpenCardRegisteContract$.setSubject = { isOpen: true, contract });

    const handleDeleteContract = () =>
      axiosInstance
        .delete(`contract/${contract.id}`)
        .then(() =>
          SnackbarUtilities.success('El Contrato fue eliminado exitosamente')
        );

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
        id={`contracts-sidebar-${contract.id}`}
        key={contract.id}
        className="contracts-sidebar-data"
      >
        <figure className="contracts-sidebar-figure">
          <img src="/svg/contracts-icon.svg" alt="W3Schools" />
        </figure>
        <div>
          <h4 className="contracts-sidebar-name">{contract.name}</h4>
          <h5 className="contracts-sidebar-cui">{contract.cui}</h5>
        </div>
        {authUsers && (
          <DotsRight
            data={dataDots}
            idContext={`contracts-sidebar-${contract.id}`}
          />
        )}
      </ContextMenuTrigger>
    );
  };
  return (
    <div className="contracts">
      <div className="contracts-sidebar">
        <h2 className="contracts-sidebar-tilte">14.CONTRATOS EN ACTIVIDAD</h2>
        <div className="contracts-sidebar-main">
          {contracts?.map(sidebarDataContainer)}
          <div className="contracts-add-content" onClick={addContract}>
            <span className="contracts-add-span">Añadir Contrato</span>
            <figure className="contracts-sideba-figure">
              <img src="/svg/plus.svg" alt="W3Schools" />
            </figure>
          </div>
        </div>
      </div>
      <div className="contracts-main">
        <div className="contracts-main-level">
          <h3 className="contracts-level-title">
            CONTRATO DE SERVICIOS N° 02-2020-MDP/GM
          </h3>
          <div className="contracts-level-contain">
            <DropdownLevelContract
              level={levelData}
              editFileContractIndex={editFileContractIndex}
            />
          </div>
        </div>
        <div className="contracts-main-info"></div>
      </div>
      <CardRegisterContract onSave={getContracts} />
    </div>
  );
};

export default Contracts;
