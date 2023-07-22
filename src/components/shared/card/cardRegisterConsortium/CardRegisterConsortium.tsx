import { FocusEvent, useEffect, useState } from 'react';
import { CompanyType, ConsortiumForm } from '../../../../types/types';
import { Input } from '../../..';
import Button from '../../button/Button';
import './cardRegisgterConsortium.css';

const InitialValues: ConsortiumForm = {
  name: '',
  manager: '',
  companies: [],
};

interface CardRegisterConsortiumProps {
  onSave?: (value: ConsortiumForm) => void;
  consortium?: ConsortiumForm;
}

const CardRegisterConsortium = ({
  onSave,
  consortium,
}: CardRegisterConsortiumProps) => {
  const [form, setForm] = useState<ConsortiumForm>(InitialValues);
  const [idCount, setIdCount] = useState(1);
  const [readOnly, setReadOnly] = useState(false);
  const [companiesList, setCompaniesList] = useState<CompanyType[]>([]);

  useEffect(() => {
    if (consortium) {
      setForm(consortium);
      setReadOnly(true);
      const _companies = consortium.companies.map((data, id) => ({
        id,
        ...data,
      }));
      setIdCount(_companies.length);
      setCompaniesList(_companies);
    } else {
      setForm(InitialValues);
    }
  }, [consortium]);

  const toggleSave = () => {
    const _companies = companiesList.map(({ id, ...data }) => {
      id;
      return data;
    });
    const newForm = { ...form, companies: _companies };
    setForm(newForm);
    !readOnly && onSave?.(form);
    setReadOnly(!readOnly);
  };

  const handleChange = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const { value, name, type } = target;
    const _value = type == 'number' ? +value : value;
    const newForm = { ...form, [name]: _value };
    setForm(newForm);
  };

  const handleAddCompany = () => {
    const newCompany: CompanyType = {
      id: idCount,
      manager: '',
      name: '',
      ruc: '',
      percentage: 0,
    };
    setIdCount(idCount + 1);
    const newListConsortium = [...companiesList, newCompany];
    setCompaniesList(newListConsortium);
  };

  const toggleOnChange = (
    id: number,
    { target }: FocusEvent<HTMLInputElement>,
    field: keyof CompanyType
  ) => {
    const { value } = target;
    const _index = companiesList.findIndex(company => company.id === id);
    if (field == 'manager') companiesList[_index].manager = value;
    if (field == 'ruc') companiesList[_index].ruc = value;
    if (field == 'percentage') companiesList[_index].percentage = +value;
    if (field == 'name') companiesList[_index].name = value;
    const _consortium = [...companiesList];
    setCompaniesList(_consortium);
  };

  const handleDeleteCompany = (id: number) => {
    const filterCompany = companiesList.filter(company => company.id !== id);
    setCompaniesList(filterCompany);
  };
  return (
    <div className="cardRegisterConsortium-container">
      <div className="container-grid-consortium">
        <Input
          classNameMain="col-span-3"
          readOnly={readOnly}
          required
          label="Representante Común:"
          placeholder="Representante Común"
          name="manager"
          onBlur={event => handleChange(event)}
          defaultValue={form.manager}
          disabled={readOnly}
        />
        <Input
          classNameMain="col-span-3"
          readOnly={readOnly}
          required
          label="Nombre del Consorcio:"
          placeholder="Nombre del Consorcio"
          name="name"
          onBlur={event => handleChange(event)}
          defaultValue={form.name}
          disabled={readOnly}
        />
      </div>
      <span className="switch-status-label">Lista de Empresas:</span>
      <ul className="cardRegisterConsortium-list">
        <li className="cardRegisterConsortium-list-li">
          <span className="col-span-1 headers-company">RUC</span>
          <span className="col-span-2 headers-company">
            Nombre de la Empresa
          </span>
          <span className="col-span-2 headers-company">
            Representante Individual
          </span>
          <span className="col-span-1 headers-company">% Participación</span>
        </li>
        {companiesList &&
          companiesList.map(company => (
            <li key={company.id} className="cardRegisterConsortium-list-li">
              <Input
                name={`ruc-c-${company.id}`}
                placeholder="RUC"
                required
                onBlur={e => toggleOnChange(company.id, e, 'ruc')}
                disabled={readOnly}
                classNameMain="col-span-1"
                defaultValue={company.ruc}
              />
              <Input
                name={`name-c-${company.id}`}
                placeholder="Nombre de la Empresa "
                required
                onBlur={e => toggleOnChange(company.id, e, 'name')}
                disabled={readOnly}
                classNameMain="col-span-2"
                defaultValue={company.name}
              />
              <Input
                name={`manager-c-${company.id}`}
                placeholder="Representante Invidual"
                required
                onBlur={e => toggleOnChange(company.id, e, 'manager')}
                disabled={readOnly}
                classNameMain="col-span-2"
                defaultValue={company.manager}
              />
              <Input
                name={`percentage-c-${company.id}`}
                placeholder="% "
                required
                type="number"
                onBlur={e => toggleOnChange(company.id, e, 'percentage')}
                disabled={readOnly}
                classNameMain="col-span-1"
                defaultValue={company.percentage}
              />
              <Button
                className="cardRegisterConsortium-button-add-company button-icon"
                type="button"
                icon="close"
                disabled={readOnly}
                onClick={() => handleDeleteCompany(company.id)}
              />
            </li>
          ))}
      </ul>
      <div className=" container-grid-consortium justify-start">
        <Button
          className="cardRegisterConsortium-button-add-company"
          type="button"
          disabled={readOnly}
          text="Añadir Empresa +"
          onClick={handleAddCompany}
        />
      </div>
      <div className=" container-grid-consortium justify-end">
        <Button
          type="button"
          className={`cardRegisterConsortium-button-send ${
            readOnly && 'cardRegisterConsortium-button-cancel'
          }  `}
          text={`${readOnly ? 'Editar Cambios' : 'Guardar Datos'}`}
          onClick={toggleSave}
        />
      </div>
    </div>
  );
};

export default CardRegisterConsortium;
