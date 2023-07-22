import { useEffect, useState } from 'react';
import './CardAddExpert.css';
import InputText from '../../Input/Input';
import Button from '../../button/Button';
import { PersonalBussines } from '../../../../types/types';
import { v4 as uuidv4 } from 'uuid';
interface DataLabels {
  [key: string]: string;
}

interface DataInitialValues {
  [key: string]: string;
}
interface CardAddExpertProps {
  personalBussines?: (value: PersonalBussines[]) => void;
  experts?: PersonalBussines[];
  data?: {
    labels: DataLabels;
    initialValues: DataInitialValues;
  };
}
const CardAddExpert = ({
  personalBussines,
  experts,
  data,
}: CardAddExpertProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const init = {
    ...data?.initialValues,
    id: uuidv4(),
  };
  const [rows, setRows] = useState([init]);
  const handleAddRow = () => {
    setRows([...rows, init]);
  };
  useEffect(() => {
    if (experts && experts.length > 0) {
      console.log(experts);

      setRows(experts.map(expert => ({ id: uuidv4(), ...expert })));
    }
  }, [experts]);

  const handleChange = (
    index: number,
    { target }: React.FocusEvent<HTMLInputElement>
  ) => {
    const { value, name, type } = target;
    const newValue = type === 'number' ? +value : value;

    setRows(
      rows.map((row, i) => (i === index ? { ...row, [name]: newValue } : row))
    );
  };
  const handleQuery = () => {
    personalBussines?.(rows);
    setIsOpen(false);
  };
  const handleDeleteRow = (id: string) => {
    const deleteRow = rows.filter(row => row.id !== id);
    setRows(deleteRow);
  };
  return (
    <div>
      <Button
        className="card-add-expert-btn"
        text="Agregar Experto"
        type="button"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className={`card-add-expert-modal ${isOpen ? 'show' : ''}`}>
          <div className="card-add-header-title">
            {data &&
              Object.entries(data.labels).map(
                ([key, value]) => value && <label key={key}>{value}</label>
              )}
          </div>
          {rows.map((row, index) => (
            <div key={row.id} className="card-add-expert-row">
              <h1>{index}</h1>
              {data &&
                Object.entries(data.initialValues).map(([key]) => (
                  <InputText
                    key={key}
                    name={key}
                    type={key === 'cip' ? 'number' : 'text'}
                    defaultValue={row ? row[key as keyof typeof row] : ''}
                    onBlur={e => handleChange(index, e)}
                  />
                ))}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteRow(row.id)}
                  className="card-add-expert-delete"
                >
                  <img
                    src="/svg/close.svg"
                    className="cardSubtaskHold-user-delete"
                  />
                </button>
              )}
            </div>
          ))}
          <div className="card-add-btn-options">
            <Button
              type="button"
              text="Agregar otro Experto +"
              className="card-register-project-button-show-bussiness"
              onClick={handleAddRow}
            />
          </div>
          <Button
            type="button"
            text="Consultar"
            className="send-button"
            onClick={handleQuery}
          />
        </div>
      )}
    </div>
  );
};

export default CardAddExpert;
