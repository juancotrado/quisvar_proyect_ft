import { NavLink, Outlet } from 'react-router-dom';
import { CardCompany, Input } from '../../components';
import Button from '../../components/shared/button/Button';
import {
  isOpenCardCompany$,
  isOpenCardConsortium$,
} from '../../services/sharingSubject';
import './company.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { Companies } from '../../types/types';
// import { getIconDefault } from '../../utils/tools';
import { URL } from '../../services/axiosInstance';
import CardConsortium from '../../components/shared/card/cardConsortium/CardConsortium';
const Company = () => {
  const [companies, setCompanies] = useState<Companies[]>();
  const [consortiums, setConsortiums] = useState<any[]>();
  const [swap, setSwap] = useState<boolean>(false);
  useEffect(() => {
    getCompanies();
    getConsortium();
  }, []);
  const getCompanies = () => {
    axiosInstance.get('/companies').then(item => setCompanies(item.data));
  };
  const getConsortium = () => {
    axiosInstance
      .get('/consortium/all')
      .then(item => setConsortiums(item.data));
  };
  const handleAddCompany = () => {
    isOpenCardCompany$.setSubject = true;
  };
  const handleAddConsortium = () => {
    isOpenCardConsortium$.setSubject = true;
  };
  return (
    <div className="company container">
      <div className="specialist-list">
        <div className="specialist-add-area">
          <button
            className={`consortium-title ${!swap && 'cs-selected'}`}
            onClick={() => setSwap(!swap)}
          >
            Empresas{' '}
          </button>
          <button
            className={`consortium-title ${swap && 'cs-selected'}`}
            onClick={() => setSwap(!swap)}
          >
            Consorcios{' '}
          </button>
          <Button
            icon="plus-dark"
            onClick={!swap ? handleAddCompany : handleAddConsortium}
            className="specialist-add-btn"
          />
        </div>
        <Input
          placeholder="Buscar por RUC"
          className="specialist-search-input"
        />
        {!swap &&
          companies &&
          companies.map(item => (
            <NavLink
              className="specialist-items"
              key={item.id}
              to={`informacion/${item.id}`}
            >
              <img
                src={`${URL}/images/img/companies/${item.img}`}
                alt=""
                className="specialist-item-user-img"
              />
              <div className="specialist-items-content">
                <h3 className="specialist-item-name">{item.name}</h3>
                <h3 className="specialist-item-dni">RUC: {item.ruc}</h3>
              </div>
            </NavLink>
          ))}
        {swap &&
          consortiums &&
          consortiums.map(item => (
            <NavLink
              className="specialist-items"
              key={item.id}
              to={`consorcio/${item.id}`}
            >
              <img
                src={`${URL}/images/img/companies/${item.img}`}
                alt=""
                className="specialist-item-user-img"
              />
              <div className="specialist-items-content">
                <h3 className="specialist-item-name">{item.name}</h3>
                <h3 className="specialist-item-dni">{item.manager}</h3>
              </div>
            </NavLink>
          ))}
      </div>
      <section className="specialist-info">
        <Outlet />
      </section>
      {/* <Button text="Agregar" onClick={viewCompany} /> */}
      <CardCompany onSave={getCompanies} />
      <CardConsortium onSave={getConsortium} />
    </div>
  );
};

export default Company;
