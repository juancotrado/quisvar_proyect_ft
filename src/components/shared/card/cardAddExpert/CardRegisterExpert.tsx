import { FocusEvent, useEffect, useState } from 'react';
import Button from '../../button/Button';
import { ExpertForm, ExpertType } from '../../../../types/types';
import { Input } from '../../..';

const InitialValues: ExpertType = {
  id: 0,
  name: '',
  career: '',
  cip: 0,
  dni: '',
  phone: '',
  pdf: undefined,
};

const HeadersExperts = {
  name: 'Nombre Completo',
  dni: 'DNI',
  career: 'Ocupación',
  cip: 'CIP',
  phone: 'Teléfono',
  // pdf: 'PDF',
};

interface CardRegisterExpertProps {
  onSave?: (value: ExpertForm[]) => void;
  experts?: ExpertForm[];
}

const CardRegisterExpert = ({ onSave, experts }: CardRegisterExpertProps) => {
  const [readOnly] = useState(false);
  const [idCount, setIdCount] = useState(2);
  const [expertList, setExpertList] = useState<ExpertType[]>([]);

  useEffect(() => {
    if (experts) {
      const _experts = experts.map((data, id) => ({
        id,
        ...data,
      }));
      setExpertList(_experts);
      setIdCount(_experts.length);
    } else {
      const InitialExpert = { ...InitialValues, id: 1 };
      setExpertList([InitialExpert]);
    }
  }, [experts]);

  const handleAddExpert = () => {
    const newExpert: ExpertType = { ...InitialValues, id: idCount };
    setIdCount(idCount + 1);
    const newListConsortium = [...expertList, newExpert];
    setExpertList(newListConsortium);
  };

  const toggleOnChange = (
    id: number,
    { target }: FocusEvent<HTMLInputElement>,
    field: keyof ExpertType
  ) => {
    const { value } = target;
    const _index = expertList.findIndex(expert => expert.id === id);
    if (field == 'name') expertList[_index].name = value;
    if (field == 'career') expertList[_index].career = value;
    if (field == 'cip') expertList[_index].cip = +value;
    if (field == 'dni') expertList[_index].dni = value;
    if (field == 'phone') expertList[_index].phone = value;
    const _experts = [...expertList];
    const _newExperts = _experts.map(({ id, ...data }) => {
      return data;
    });
    onSave?.(_newExperts);
    setExpertList(_experts);
  };

  const handleDeleteCompany = (id: number) => {
    const fliterExpert = expertList.filter(expert => expert.id !== id);
    setExpertList(fliterExpert);
    onSave?.(fliterExpert);
  };

  return (
    <div className="cardRegisterConsortium-container">
      <span className="switch-status-label">Lista de Especialitas:</span>
      <div className="container-grid-consortium">
        <ul className="cardRegisterConsortium-list">
          <li className="cardRegisterConsortium-list-li">
            {Object.values(HeadersExperts).map((key, index) => (
              <span key={index} className="col-span-1 headers-company">
                {key}
              </span>
            ))}
          </li>
          {expertList &&
            expertList.map(expert => (
              <li key={expert.id} className="cardRegisterConsortium-list-li">
                <Input
                  name={`name-e-${expert.id}`}
                  placeholder="Nombre Completo"
                  required
                  onBlur={e => toggleOnChange(expert.id, e, 'name')}
                  disabled={readOnly}
                  classNameMain="col-span-1"
                  defaultValue={expert.name}
                />
                <Input
                  name={`dni-e-${expert.id}`}
                  placeholder="DNI"
                  required
                  onBlur={e => toggleOnChange(expert.id, e, 'dni')}
                  disabled={readOnly}
                  classNameMain="col-span-1"
                  defaultValue={expert.dni}
                />
                <Input
                  name={`career-e-${expert.id}`}
                  placeholder="Ocupación"
                  required
                  onBlur={e => toggleOnChange(expert.id, e, 'career')}
                  disabled={readOnly}
                  classNameMain="col-span-1"
                  defaultValue={expert.career}
                />
                <Input
                  name={`cip-e-${expert.id}`}
                  placeholder="CIP"
                  required
                  type="number"
                  onBlur={e => toggleOnChange(expert.id, e, 'cip')}
                  disabled={readOnly}
                  classNameMain="col-span-1"
                  defaultValue={expert.cip}
                />
                <Input
                  name={`phone-e-${expert.id}`}
                  placeholder="Teléfono / Celular"
                  required
                  onBlur={e => toggleOnChange(expert.id, e, 'phone')}
                  disabled={readOnly}
                  classNameMain="col-span-1"
                  defaultValue={expert.phone}
                />

                <span className="col-span-1">{expert.pdf}</span>

                {!expert.pdf && (
                  <Button
                    className="cardRegisterConsortium-button-add-company button-icon"
                    type="button"
                    icon="close"
                    disabled={readOnly}
                    onClick={() => handleDeleteCompany(expert.id)}
                  />
                )}
              </li>
            ))}
        </ul>
      </div>
      <div className=" container-grid-consortium justify-start">
        <Button
          className="cardRegisterConsortium-button-add-company"
          type="button"
          disabled={readOnly}
          text="Añadir Especialistas +"
          onClick={handleAddExpert}
        />
      </div>
    </div>
  );
};

export default CardRegisterExpert;
