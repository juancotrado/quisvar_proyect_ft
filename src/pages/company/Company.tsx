import { NavLink, Outlet } from 'react-router-dom';
import { DotsRight, Input, Button, Aside } from '../../components';
import {
  isOpenCardCompany$,
  isOpenCardConsortium$,
} from '../../services/sharingSubject';
import './company.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { Companies, ConsortiumType, Option } from '../../types';
import { URL } from '../../services/axiosInstance';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { CardCompany, CardConsortium } from './views';
// import React, {  ReactNode } from 'react';

export const Company = () => {
  const [companies, setCompanies] = useState<Companies[]>();
  const [consortiums, setConsortiums] = useState<ConsortiumType[]>();
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
  const handleAddCompany = (id?: number) => {
    isOpenCardCompany$.setSubject = {
      isOpen: true,
      id,
    };
  };
  const handleAddConsortium = (id?: number) => {
    isOpenCardConsortium$.setSubject = {
      isOpen: true,
      id,
    };
  };
  return (
    <div className="company">
      <Aside>
        <div className="specialist-add-area">
          <button
            className={`consortium-title ${!swap && 'cs-selected'}`}
            onClick={() => setSwap(false)}
          >
            Empresas{' '}
          </button>
          <button
            className={`consortium-title ${swap && 'cs-selected'}`}
            onClick={() => setSwap(true)}
          >
            Consorcios{' '}
          </button>
          <Button
            icon="plus-dark"
            onClick={() => (!swap ? handleAddCompany() : handleAddConsortium())}
            className="specialist-add-btn"
          />
        </div>
        <div className="search-box">
          <Input
            placeholder="Buscar por RUC"
            className="specialist-search-input"
            styleInput={4}
          />
        </div>

        <div className="scroll-y">
          {!swap &&
            companies &&
            companies.map(item => {
              const optionsData: Option[] = [
                {
                  name: 'Editar',
                  type: 'button',
                  icon: 'pencil',
                  function: () => handleAddCompany(item.id),
                },
              ];
              return (
                <div key={item.id} className="">
                  <ContextMenuTrigger
                    // className="experience-table-body"
                    // key={idx}
                    id={`company-${item.id}`}
                  >
                    <NavLink
                      className="specialist-items"
                      to={`informacion/${item.id}`}
                    >
                      <img
                        src={
                          item.img
                            ? `${URL}/images/img/companies/${item.img}`
                            : '/svg/user_icon.svg'
                        }
                        alt=""
                        className="specialist-item-user-img"
                      />
                      <div className="specialist-items-content">
                        <h3 className="specialist-item-name">{item.name}</h3>
                        <h3 className="specialist-item-dni">RUC: {item.ruc}</h3>
                      </div>
                    </NavLink>
                  </ContextMenuTrigger>
                  <DotsRight
                    data={optionsData}
                    idContext={`company-${item.id}`}
                  />
                </div>
              );
            })}
          {swap &&
            consortiums &&
            consortiums.map(item => {
              const optionsData: Option[] = [
                {
                  name: 'Editar',
                  type: 'button',
                  icon: 'pencil',
                  function: () => handleAddConsortium(item.id),
                },
              ];
              return (
                <div key={item.id}>
                  <ContextMenuTrigger id={`consortium-${item.id}`}>
                    <NavLink
                      className="specialist-items"
                      to={`consorcio/${item.id}`}
                    >
                      <img
                        src={
                          item.img
                            ? `${URL}/images/img/consortium/${item.img}`
                            : '/svg/user_icon.svg'
                        }
                        alt=""
                        className="specialist-item-user-img"
                      />
                      <div className="specialist-items-content">
                        <h3 className="specialist-item-name">{item.name}</h3>
                        <h3 className="specialist-item-dni">{item.manager}</h3>
                      </div>
                    </NavLink>
                  </ContextMenuTrigger>
                  <DotsRight
                    data={optionsData}
                    idContext={`consortium-${item.id}`}
                  />
                </div>
              );
            })}
        </div>
      </Aside>
      <section className="specialist-info">
        <Outlet />
      </section>
      <CardCompany onSave={getCompanies} />
      <CardConsortium onSave={getConsortium} />
    </div>
  );
};
