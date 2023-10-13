import { NavLink, Outlet } from 'react-router-dom';
import { CardCompany, Input } from '../../components';
import Button from '../../components/shared/button/Button';
import { isOpenCardCompany$ } from '../../services/sharingSubject';
import './company.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { Companies } from '../../types/types';
import { getIconDefault } from '../../utils/tools';

const Company = () => {
  const [companies, setCompanies] = useState<Companies[]>();
  useEffect(() => {
    getSpecialists();
  }, []);
  const getSpecialists = () => {
    axiosInstance.get('/companies').then(item => setCompanies(item.data));
  };
  const handleAddCompany = () => {
    isOpenCardCompany$.setSubject = true;
  };

  return (
    <div className="company container">
      <div className="specialist-list">
        <div className="specialist-add-area">
          <h3 className="specialist-title">Empresas: </h3>
          <Button
            icon="plus-dark"
            onClick={handleAddCompany}
            className="specialist-add-btn"
          />
        </div>
        <Input
          placeholder="Buscar por RUC"
          className="specialist-search-input"
        />
        {companies &&
          companies.map(item => (
            <NavLink
              className="specialist-items"
              key={item.id}
              to={`informacion/${item.id}`}
            >
              <img
                src={getIconDefault(item.name)}
                alt=""
                className="specialist-item-user-img"
              />
              <div className="specialist-items-content">
                <h3 className="specialist-item-name">{item.name}</h3>
                <h3 className="specialist-item-dni">DNI: {item.ruc}</h3>
              </div>
            </NavLink>
          ))}
      </div>
      <section className="specialist-info">
        <Outlet />
      </section>
      {/* <Button text="Agregar" onClick={viewCompany} /> */}
      <CardCompany onSave={getSpecialists} />
    </div>
  );
};

export default Company;
