import { useEffect, useState } from 'react';
import CardRegisterContract from '../../../components/shared/card/cardRegisterContract/CardRegisterContract';
import { isOpenCardRegisteContract$ } from '../../../services/sharingSubject';
import './contracts.css';
import { axiosInstance } from '../../../services/axiosInstance';
import { Contract } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { rolSecondLevel } from '../../../utils/roles';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarContractCard from '../../../components/contracts/sidebarContractCard/SidebarContractCard';

const Contracts = () => {
  const [contract, setContract] = useState<Contract | null>(null);

  const [contracts, setContracts] = useState<Contract[] | null>(null);
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

  const authUsers = rolSecondLevel.includes(role);

  const handleSelectContract = (contract: Contract) => {
    setContract(contract);
    navigate(`contrato/${contract.id}/detalles`, { state: { contract } });
  };
  return (
    <div className="contracts">
      <div className="contracts-sidebar">
        <h2 className="contracts-sidebar-tilte">14.CONTRATOS EN ACTIVIDAD</h2>
        <div className="contracts-sidebar-main">
          {contracts?.map(agreement => (
            <SidebarContractCard
              key={agreement.id}
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
        <Outlet />
      </div>
      <CardRegisterContract onSave={getContracts} />
    </div>
  );
};

export default Contracts;
