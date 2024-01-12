import { useEffect } from 'react';
import DropdownLevelContract from '../../../../components/contracts/dropdownLevelContract/DropdownLevelContract';
import { Contract, ContractIndexData } from '../../../../types/types';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Outlet, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getContractThunks } from '../../../../store/slices/contract.slice';
import './contractsLevels.css';

const ContractsLevels = () => {
  const dispatch: AppDispatch = useDispatch();

  const { contract } = useSelector((state: RootState) => state);
  const { contractId } = useParams();

  useEffect(() => {
    getContract();
  }, [contractId]);

  const getContract = () => {
    if (!contractId) return;
    dispatch(getContractThunks(contractId));
  };
  const getLevelData = (contract: Contract) => {
    const contractIndex: ContractIndexData[] = JSON.parse(
      contract?.indexContract
    );
    return {
      id: '0',
      name: '',
      nivel: 0,
      nextLevel: contractIndex,
    };
  };
  const editFileContractIndex = (id: string, value: 'yes' | 'no') => {
    if (!contract) return;
    const arrayId = id.split('.').map(el => +el - 1);
    const contractIndex: ContractIndexData[] = JSON.parse(
      contract?.indexContract
    );
    const newcontract = contractIndex?.at(arrayId[0]);
    const nextLevel = newcontract?.nextLevel?.at(arrayId[1]);
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
    const indexContract = JSON.stringify(contractIndex);
    axiosInstance
      .put(`/contract/${contract.id}/index`, { indexContract })
      .then(() => getContract());
  };
  return contract ? (
    <>
      <div className="contractsLevels-main-level">
        <h3 className="contractsLevels-level-title">{contract.name}</h3>
        <div className="contractsLevels-level-contain">
          <DropdownLevelContract
            level={getLevelData(contract)}
            idContract={contract.id}
            editFileContractIndex={editFileContractIndex}
          />
        </div>
      </div>
      <div className="contractsLevels-main-info">
        <Outlet />
      </div>
    </>
  ) : (
    <div className="contractsLevels-select-empty">
      <h1>Seleccione un Contrato</h1>
    </div>
  );
};

export default ContractsLevels;
