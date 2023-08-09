import { useEffect, useState } from 'react';
import { Input } from '../../..';
import './cardRegisterCompany.css';
// import Button from '../../button/Button';
import { CompanyForm } from '../../../../types/types';

const InitialValues: CompanyForm = {
  ruc: '',
  name: '',
  manager: '',
  percentage: 100,
};

interface CardRegisterCompanyProps {
  hasPercentage: boolean;
  onSave?: (value: CompanyForm) => void;
  company?: CompanyForm;
}

const CardRegisterCompany = ({
  hasPercentage,
  onSave,
  company,
}: CardRegisterCompanyProps) => {
  const [form, setForm] = useState(InitialValues);

  useEffect(() => {
    if (company) {
      setForm(company);
    } else {
      setForm(InitialValues);
    }
  }, [company]);

  const [readOnly, setReadOnly] = useState(false);

  const handleChange = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const { value, name, type } = target;
    const _value = type == 'number' ? +value : value;
    const newForm = { ...form, [name]: _value };
    !readOnly && onSave?.(newForm);
    setForm(newForm);
  };

  // const toggleSave = () => {
  //   setReadOnly(!readOnly);
  // };

  return (
    <div className="cardRegisterCompany-container">
      <div className="container-grid-company">
        <Input
          classNameMain="col-span-1 "
          readOnly={readOnly}
          required
          label="RUC: "
          name="ruc"
          placeholder="ruc"
          onBlur={event => handleChange(event)}
          defaultValue={form.ruc}
          disabled={readOnly}
        />
        <Input
          classNameMain="col-span-2"
          readOnly={readOnly}
          required
          label="Representante Invidual:"
          placeholder="Representante Invidual"
          name="manager"
          onBlur={event => handleChange(event)}
          defaultValue={form.manager}
          disabled={readOnly}
        />
        <Input
          classNameMain={`${hasPercentage ? 'col-span-2' : 'col-span-3'}`}
          readOnly={readOnly}
          required
          label="Nombre de la Empresa:"
          placeholder="Nombre de la Empresa"
          name="name"
          onBlur={event => handleChange(event)}
          defaultValue={form.name}
          disabled={readOnly}
        />
        {hasPercentage && (
          <Input
            classNameMain="col-span-1"
            readOnly={readOnly}
            label="% de particiación:"
            placeholder="porcentaje %"
            type="number"
            name="percentage"
            onBlur={event => handleChange(event)}
            defaultValue={form.percentage}
            disabled={readOnly}
          />
        )}
      </div>
      {/* <div className=" container-grid-company justify-end">
        <Button
          type="button"
          className={`cardRegisterCompany-button-send ${
            readOnly && 'cardRegisterCompany-button-cancel'
          }`}
          text={`${readOnly ? 'Editar Cambios' : 'Guardar Datos'}`}
          onClick={toggleSave}
        />
      </div> */}
    </div>
  );
};

CardRegisterCompany.defaultProps = {
  hasPercentage: false,
};

export default CardRegisterCompany;
