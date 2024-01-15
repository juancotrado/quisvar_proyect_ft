import { NavLink, Outlet, useSearchParams } from 'react-router-dom';
import './generalIndex.css';
import { axiosInstance } from '../../services/axiosInstance';
import { useEffect, useState } from 'react';
import { CoorpEntity } from '../../types';
import { INDEX_OPTIONS, DEFAULT_COMPANY } from './models';
import { DropDownSimple } from '../../components';

export const GeneralIndex = () => {
  const [coorpEntity, setCoorpEntity] = useState<CoorpEntity[] | null>(null);
  const [urlImgCompany, setUrlImgCompany] = useState('');
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    getCompanyData();
  }, []);

  const getCompanyData = () => {
    axiosInstance.get('/consortium/both').then(res => {
      setCoorpEntity(res.data);
    });
  };

  const findCompany = () => {
    const idCompany = [...params.values()].join('-');
    if (!idCompany || !coorpEntity) return DEFAULT_COMPANY;
    const company = coorpEntity.find(coorp => coorp.newId === idCompany);
    return company ?? DEFAULT_COMPANY;
  };

  const getCompanySelect = (textFiel: keyof CoorpEntity) => {
    const company = findCompany();
    return String(company[textFiel]);
  };

  const selectCompany = (item: CoorpEntity) => {
    const { type, id, urlImg } = item;
    setUrlImgCompany(urlImg);
    if (id === 0) return setParams({});
    setParams({
      typeCompany: type,
      idCompany: String(id),
    });
  };
  return (
    <div className="generalIndex">
      <div className="generalIndex-header">
        <div className="generalIndex-header-search">
          {coorpEntity && (
            <div className="generalIndex-header-search-company">
              <figure className="generalIndex-header-figure">
                <img
                  src={urlImgCompany || getCompanySelect('urlImg')}
                  alt="W3Schools"
                />
              </figure>
              <DropDownSimple
                name="coorpEntity"
                data={[DEFAULT_COMPANY, ...coorpEntity]}
                defaultInput={getCompanySelect('name')}
                type="search"
                itemKey="newId"
                textField="name"
                classNameListOption="generalIndex-header-selector-cotainer"
                classNameSelectText="generalIndex-header-selector-text generalIndex-header-option-text"
                allData={item => selectCompany(item as CoorpEntity)}
                selector
                imgField="urlImg"
                classNameInput="generalIndex-header-selector"
                classNameInputText="generalIndex-header-selector-text  "
              />
            </div>
          )}
          <input
            type="text"
            className="generalIndex-header-input"
            placeholder="Buscar documentos, profesionales o empresas"
          />
        </div>
        <div className="generalIndex-header-indexData">
          {INDEX_OPTIONS.map(index => (
            <NavLink key={index.id} to={{ pathname: index.route }}>
              {({ isActive }) => (
                <span
                  className={
                    isActive
                      ? ' generalIndex-header-indexData-span generalIndex--active '
                      : 'generalIndex-header-indexData-span'
                  }
                >
                  {index.id} {index.name}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
};
