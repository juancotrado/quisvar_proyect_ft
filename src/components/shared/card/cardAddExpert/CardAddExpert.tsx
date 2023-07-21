import { useEffect, useState } from 'react';
import Outside from '../../../portal/Outside';
import './CardAddExpert.css';
import InputText from '../../Input/Input';
import Button from '../../button/Button';
import { PersonalBussines } from '../../../../types/types';
interface DataLabels {
  [key: string]: string;
}

interface DataInitialValues {
  [key: string]: string;
}
interface CardAddExpertProps {
  personalBussines?: (value: PersonalBussines[]) => void;
  project?: PersonalBussines[];
  data?: {
    labels: DataLabels;
    initialValues: DataInitialValues;
  };
}
const CardAddExpert = ({
  personalBussines,
  project,
  data,
}: CardAddExpertProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([data?.initialValues]);
  const handleAddRow = () => {
    setRows(prevRows => [...prevRows, data?.initialValues]);
  };
  useEffect(() => {
    if (project && project.length > 0) {
      setRows(project);
    } else {
      setRows([data?.initialValues]);
    }
  }, [project, data?.initialValues]);
  const handleChange = (
    index: number,
    { target }: React.FocusEvent<HTMLInputElement>
  ) => {
    const { value, name, type } = target;

    const newValue = type === 'number' ? +value : value;

    setRows(prevRows =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [name]: newValue } : row
      )
    );
  };
  const handleQuery = () => {
    personalBussines?.(rows);
    setIsOpen(false);
  };
  const handleDeleteRow = (index: number) => {
    setRows(prevRows => prevRows.filter((row, i) => i !== index));
  };
  return (
    <Outside onClickOutside={() => setIsOpen(false)}>
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
            <div key={index} className="card-add-expert-row">
              {data &&
                Object.entries(data.labels).map(([key]) => (
                  <InputText
                    key={key}
                    name={key}
                    type={key === 'zip' ? 'number' : 'text'}
                    defaultValue={row[key as keyof typeof row]}
                    onBlur={e => handleChange(index, e)}
                  />
                ))}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteRow(index)}
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
              text="Agregar"
              className="send-button"
              onClick={handleAddRow}
            />
            <Button
              type="button"
              text="Consultar"
              className="send-button"
              onClick={handleQuery}
            />
          </div>
        </div>
      )}
    </Outside>
  );
};

export default CardAddExpert;
