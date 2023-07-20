import { useState } from 'react';
import Outside from '../../../portal/Outside';
import './CardAddExpert.css';
import InputText from '../../Input/Input';
import Button from '../../button/Button';

const CardAddExpert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([
    { input1: '', input2: '', input3: '', input4: '' },
  ]);
  const handleAddRow = () => {
    setRows(prevRows => [
      ...prevRows,
      { input1: '', input2: '', input3: '', input4: '' },
    ]);
  };
  const handleChange = (index: number, field: string, value: string) => {
    setRows(prevRows =>
      prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };
  const handleQuery = () => {
    console.log(rows);
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
                type="text"
                value={row.input1}
                onChange={e => handleChange(index, 'input1', e.target.value)}
              />
              <InputText
                type="text"
                value={row.input2}
                onChange={e => handleChange(index, 'input2', e.target.value)}
              />
              <InputText
                type="text"
                value={row.input3}
                onChange={e => handleChange(index, 'input3', e.target.value)}
              />
              <InputText
                type="text"
                value={row.input4}
                onChange={e => handleChange(index, 'input4', e.target.value)}
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
