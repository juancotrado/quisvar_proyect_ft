import './Select.css';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOptionsProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  data?: { [key: string]: any }[];
  itemKey: string;
  textField: string;
  name: string;
  placeholder?: string;
  className?: string;
}
const SelectOptions = forwardRef<HTMLSelectElement, SelectOptionsProps>(
  (
    {
      label,
      data,
      itemKey,
      textField,
      name,
      defaultValue,
      className,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className="select-container">
        {label && (
          <label htmlFor="email" className="select-label">
            {label}
          </label>
        )}
        <select
          className={`${className} select-field`}
          {...props}
          ref={ref}
          defaultValue={defaultValue}
          name={name}
        >
          <option value={0}>{`${
            placeholder ? placeholder : 'Seleccionar'
          }`}</option>
          {data?.map(element => (
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
