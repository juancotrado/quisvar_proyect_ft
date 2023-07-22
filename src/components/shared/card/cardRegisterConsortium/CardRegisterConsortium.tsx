import { useEffect, useState } from 'react';
import { ConsortiumForm } from '../../../../types/types';
import { Input } from '../../..';
import Button from '../../button/Button';

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
  const [form, setForm] = useState(InitialValues);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    if (consortium) {
      setForm(consortium);
      setReadOnly(true);
    } else {
      setForm(InitialValues);
    }
  }, [consortium]);

  const toggleSave = () => {
    !readOnly && onSave?.(form);
    setReadOnly(!readOnly);
  };

  const handleChange = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const { value, name, type } = target;
    const _value = type == 'number' ? +value : value;
    const newForm = { ...form, [name]: _value };
    setForm(newForm);
  };
  return (
    <div className="cardRegisterCompany-container">
      <div className="container-grid-company">
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
      <div className=" container-grid-company justify-end">
        <Button
          type="button"
          className={`cardRegisterCompany-button-send ${
            readOnly && 'cardRegisterCompany-button-cancel'
          }`}
          text={`${readOnly ? 'Editar Cambios' : 'Guardar Datos'}`}
          onClick={toggleSave}
        />
      </div>
    </div>
  );
};

export default CardRegisterConsortium;
