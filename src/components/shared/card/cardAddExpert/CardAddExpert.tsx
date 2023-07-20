import { useState } from 'react';
import Outside from '../../../portal/Outside';
import './CardAddExpert.css';
import InputText from '../../Input/Input';
import Button from '../../button/Button';
import { PersonalBussines } from '../../../../types/types';

interface CardAddExpertProps {
  personalBussines?: (value: PersonalBussines[]) => void;
}

const CardAddExpert = ({ personalBussines }: CardAddExpertProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([
    { name: '', career: '', zip: '', phone: '' },
  ]);
  const handleAddRow = () => {
    setRows(prevRows => [
      ...prevRows,
      { name: '', career: '', zip: '', phone: '' },
    ]);
  };
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
    console.log(rows);

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
            <label>Nombre</label>
            <label>Carrera</label>
            <label>Zip</label>
            <label>Phone</label>
          </div>
          {rows.map((row, index) => (
            <div key={index} className="card-add-expert-row">
              <InputText
                name="name"
                type="text"
                defaultValue={row.name}
                onBlur={e => handleChange(index, e)}
              />
              <InputText
                name="career"
                type="text"
                defaultValue={row.career}
                onBlur={e => handleChange(index, e)}
              />
              <InputText
                name="zip"
                type="number"
                defaultValue={row.zip}
                onBlur={e => handleChange(index, e)}
              />
              <InputText
                name="phone"
                type="text"
                defaultValue={row.phone}
                onBlur={e => handleChange(index, e)}
              />
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
