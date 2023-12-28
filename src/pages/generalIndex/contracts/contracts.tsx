import { useEffect, useState } from 'react';
import DropdownLevelContract from '../../../components/contracts/dropdownLevelContract/DropdownLevelContract';
import CardRegisterContract from '../../../components/shared/card/cardRegisterContract/CardRegisterContract';
import { isOpenCardRegisteContract$ } from '../../../services/sharingSubject';
import './contracts.css';
import { contractIndexData } from './contractsData';
import { axiosInstance } from '../../../services/axiosInstance';
import { Contract, ContractIndexData } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { rolSecondLevel } from '../../../utils/roles';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarContractCard from '../../../components/contracts/sidebarContractCard/SidebarContractCard';

const Contracts = () => {
  const [contractIndex, setContractIndex] = useState(contractIndexData);
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const { role } = useSelector((state: RootState) => state.userSession);
  const navigate = useNavigate();

  const addContract = () => {
    isOpenCardRegisteContract$.setSubject = { isOpen: true };
  };

  useEffect(() => {
    getContracts();
  }, []);

  const getContracts = () => {
    axiosInstance.get('contract').then(res => {
      setContracts(res.data);
    });
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

  const authUsers = rolSecondLevel.includes(role);

  const getLevelData = (contract: Contract) => {
    const contractIndex: ContractIndexData[] = JSON.parse(
      contract?.indexContract
    );
    return { id: '0', name: '', nivel: 0, nextLevel: contractIndex };
  };
  const handleSelectContract = (contract: Contract) => {
    setContract(contract);
    navigate('detalles', { state: { contract } });
  };
  return (
    <div className="contracts">
      <div className="contracts-sidebar">
        <h2 className="contracts-sidebar-tilte">14.CONTRATOS EN ACTIVIDAD</h2>
        <div className="contracts-sidebar-main">
          {contracts?.map(agreement => (
            <SidebarContractCard
              contract={agreement}
              onSave={getContracts}
              handleSelectContract={handleSelectContract}
              authUsers={authUsers}
              contractSelected={contract}
            />
          ))}
          <div className="contracts-add-content" onClick={addContract}>
            <span className="contracts-add-span">Añadir Contrato</span>
            <figure className="contracts-sideba-figure">
              <img src="/svg/plus.svg" alt="W3Schools" />
            </figure>
          </div>
        </div>
      </div>
      <div className="contracts-main">
        {contract ? (
          <>
            <div className="contracts-main-level">
              <h3 className="contracts-level-title">{contract.name}</h3>
              <div className="contracts-level-contain">
                <DropdownLevelContract
                  level={getLevelData(contract)}
                  editFileContractIndex={editFileContractIndex}
                />
              </div>
            </div>
            <div className="contracts-main-info">
              <Outlet />
            </div>
          </>
        ) : (
          <div className="contracts-select-empty">
            <h1>Seleccione un Contrato</h1>
          </div>
        )}
      </div>
      <CardRegisterContract onSave={getContracts} />
    </div>
  );
};

export default Contracts;
