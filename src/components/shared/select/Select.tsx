import './Select.css';
import { InputHTMLAttributes, useState } from 'react';

interface SelectOptionsProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  data: any;
  onchange?: Function;
}
const SelectOptions = ({ label, ...props }: SelectOptionsProps) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  return (
    <div className="input-container">
      {label && (
        <label htmlFor="email" className="input-label">
          {label}
        </label>
      )}
      <select
        {...props}
        value={selectedValue}
        onChange={handleSelectChange}
        className="input-select"
      >
        <option>Seleccione</option>
        {props.data.map((element: any, index: number) => (
          <option key={index} value={`option${index}`}>
            {element.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOptions;
