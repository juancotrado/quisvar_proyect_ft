import { NavLink, Outlet, useSearchParams } from 'react-router-dom';
import './generalIndex.css';
import { axiosInstance } from '../../services/axiosInstance';
import { useEffect, useState } from 'react';
import { CoorpEntity } from '../../types/types';
import DropDownSimple from '../../components/dropDownSimple/DropDownSimple';

const indexData = [
  { id: 14, name: 'CAEC', route: 'contratos' },
  { id: 13, name: 'DEE', route: 'contratos1' },
  { id: 12, name: 'DEP', route: 'contratos2' },
  { id: 11, name: 'CF', route: 'contratos3' },
  { id: 10, name: 'DCA,CC', route: 'contratos4' },
  { id: 9, name: 'SUNAT', route: 'contratos5' },
  { id: 8, name: 'OSCE', route: 'contratos6' },
  { id: 7, name: 'Imagen Inst', route: 'contratos7' },
  { id: 6, name: 'CPE', route: 'contratos8' },
  { id: 5, name: 'DIEB', route: 'contratos8' },
  { id: 4, name: 'DRP', route: 'contratos8' },
  { id: 3, name: 'DPP', route: 'contratos8' },
  { id: 2, name: 'AC', route: 'contratos8' },
  { id: 1, name: 'DTI', route: 'contratos8' },
];

const DEFAULT_COMPANY: CoorpEntity = {
  id: 0,
  name: 'Dhyrium SAA',
  type: '',
  newId: '',
  urlImg: '/img/quisvar_logo.png',
};
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
          {indexData.map(index => (
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
