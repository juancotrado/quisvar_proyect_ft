import { ChangeEvent, useEffect, useState } from 'react';
import { isOpenCardRegisteContract$ } from '../../../../services/sharingSubject';
import './contracts.css';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Contract } from '../../../../types';
import { Outlet, useSearchParams } from 'react-router-dom';
import { SidebarContractCard } from './components';
import { CardObservations, CardRegisterContract } from './views';
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
import { Resizable } from 're-resizable';

let initialContract: Contract[] = [];
export const Contracts = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
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
    const handleResize = () => {
      setIsSidebarHidden(window.innerWidth < 1000);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
  const toggleSidebarVisibility = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };
  return (
    <div className="contracts">
      {/* rezise */}
      <Resizable
        defaultSize={{
          width: 300,
          height: '100%',
        }}
        //  className="contracts-sidebar"
        className={`contracts-sidebar ${
          isSidebarHidden ? 'sidebar-hidden' : ''
        }`}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
        }}
      >
        <h2
          className={`contracts-sidebar-tilte ${
            isSidebarHidden ? 'display-hidden' : ''
          }`}
        >
          14.CONTRATOS EN ACTIVIDAD
        </h2>
        <IconAction icon="file-excel" onClick={handleReport} />
        <div
          className={`${
            isSidebarHidden ? 'display-hidden' : 'contract-filters-contain'
          }`}
        >
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
        <div
          className={`contracts-add-content ${
            isSidebarHidden ? 'display-hidden' : ''
          }`}
          onClick={addContract}
        >
          <span className="contracts-add-span">Añadir Contrato</span>
          <figure className="contracts-sideba-figure">
            <img src="/svg/plus.svg" alt="W3Schools" />
          </figure>
        </div>
      </Resizable>
      <div className="button-sidebar">
        <button className="button-icon" onClick={toggleSidebarVisibility}>
          <svg
            className={`icon ${isSidebarHidden ? 'icon-invert' : ''}`}
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 330 330"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <path
                id="XMLID_222_"
                d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
              ></path>{' '}
            </g>
          </svg>
        </button>
      </div>
      <div className="contracts-main">
        <Outlet />
      </div>
      <CardRegisterContract onSave={getContracts} />
      <CardObservations />
    </div>
  );
};

export default Contracts;
