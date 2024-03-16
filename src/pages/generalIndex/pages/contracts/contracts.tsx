import { ChangeEvent, useEffect, useState } from 'react';
import { isOpenCardRegisteContract$ } from '../../../../services/sharingSubject';
import './contracts.css';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Contract } from '../../../../types';
import { Outlet, useSearchParams } from 'react-router-dom';
import { SidebarContractCard } from './components';
import { CardRegisterContract } from './views';
import { IconAction, Select } from '../../../../components';
import {
  CONTRACT_TYPE,
  INIT_VALUES_FILTER_CONTRACT,
  STATUS_CONTRACT,
} from './models';
import { FilterContract } from './models/type.contracts';
import { YEAR_DATA } from '../../../specialities/models';
import { getStatusContract } from './utils';
import { excelContractReport } from './generateExcel';

let initialContract: Contract[] = [];
export const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [filterContract, setFilterContract] = useState<FilterContract>(
    INIT_VALUES_FILTER_CONTRACT
  );
  const [params] = useSearchParams();

  const addContract = () => {
    isOpenCardRegisteContract$.setSubject = { isOpen: true };
  };

  useEffect(() => {
    getContracts();
  }, [params, filterContract.date, filterContract.type]);

  const getContracts = () => {
    const typeCompany = params.get('typeCompany');
    const id = params.get('idCompany');
    const { date, type } = filterContract;
    axiosInstance
      .get(
        `/contract/?${id ? `${typeCompany}=${id}` : ''}${
          date ? `&date=${date}` : ''
        }${type ? `&type=${type}` : ''}`
      )
      .then(res => {
        initialContract = res.data;
        setContracts(res.data);
      });
  };

  const handleFilterValues = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = target;
    setFilterContract({ ...filterContract, status: '', [name]: value });
  };
  const handleFilterStatus = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const { value } = target;
    if (!value) return setContracts(initialContract);
    if (!contracts) return;
    const filterContracts = initialContract.filter(contract => {
      const colorStatus = getStatusContract(
        contract.createdAt,
        contract.phases,
        JSON.parse(contract.indexContract)
      );
      return colorStatus === value;
    });
    setFilterContract({ ...filterContract, status: value });

    setContracts(filterContracts);
  };

  const handleReport = () => {
    if (!contracts) return;
    excelContractReport(contracts);
  };
  return (
    <div className="contracts">
      <div className="contracts-sidebar">
        <h2 className="contracts-sidebar-tilte">14.CONTRATOS EN ACTIVIDAD</h2>
        <IconAction icon="file-excel" onClick={handleReport} position="none" />
        <div className="contract-filters-contain">
          <Select
            value={filterContract.status}
            name="status"
            data={STATUS_CONTRACT}
            itemKey="key"
            textField="name"
            placeholder="Estado"
            className="contract-filter-select"
            onChange={handleFilterStatus}
          />
          <Select
            name="date"
            data={YEAR_DATA}
            itemKey="year"
            textField="year"
            placeholder="Año"
            className="contract-filter-select"
            onChange={handleFilterValues}
          />
          <Select
            name="type"
            data={CONTRACT_TYPE}
            itemKey="key"
            textField="name"
            placeholder="Tipo"
            className="contract-filter-select"
            onChange={handleFilterValues}
          />
        </div>
        <div className="contracts-sidebar-main">
          {contracts?.map(agreement => (
            <SidebarContractCard
              key={agreement.id}
              contract={agreement}
              onSave={getContracts}
            />
          ))}
        </div>
        <div className="contracts-add-content" onClick={addContract}>
          <span className="contracts-add-span">Añadir Contrato</span>
          <figure className="contracts-sideba-figure">
            <img src="/svg/plus.svg" alt="W3Schools" />
          </figure>
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
