import './Select.css';
import { SelectHTMLAttributes } from 'react';

interface SelectOptionsProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  data: { [key: string]: string | number }[];
  itemKey: string;
  textField: string;
}
const SelectOptions = ({
  label,
  itemKey,
  textField,
  data,
  ...props
}: SelectOptionsProps) => {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor="email" className="input-label">
          {label}
        </label>
      )}
      <select className="input-select" {...props}>
        <option>Seleccione</option>
        {data.map(element => (
          <option key={element[itemKey]} value={element[itemKey]}>
            {element[textField]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOptions;
