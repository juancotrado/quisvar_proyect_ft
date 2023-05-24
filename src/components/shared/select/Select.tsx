import './Select.css';
import { LegacyRef, SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOptionsProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  data: { [key: string]: string | number }[];
  itemKey: string;
  textField: string;
  name: string;
  defaultValue?: any;
}
const SelectOptions = forwardRef(
  (
    {
      name,
      label,
      itemKey,
      textField,
      data,
      defaultValue,
      ...props
    }: SelectOptionsProps,
    ref: LegacyRef<HTMLSelectElement>
  ) => {
    return (
      <div className="input-container">
        {label && (
          <label htmlFor="email" className="input-label">
            {label}
          </label>
        )}
        <select
          className="input-select"
          {...props}
          ref={ref}
          defaultValue={defaultValue}
          name={name}
        >
          <option>Seleccione</option>
          {data.map(element => (
            <option key={element[itemKey]} value={element[itemKey]}>
              {element[textField]}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default SelectOptions;
