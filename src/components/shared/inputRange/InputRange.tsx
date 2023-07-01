import { forwardRef, useState } from 'react';
import { InputHTMLAttributes } from 'react';

import './inputRange.css';

interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name?: string;
  maxRange: number;
  newPercentage?: number;
  defaultValue?: number;
  disabled?: boolean;
}

const InputRange = forwardRef<HTMLInputElement, InputTextProps>(
  (
    { name, maxRange, newPercentage, defaultValue, disabled, ...props },
    ref
  ) => {
    const [value, setValue] = useState<number | undefined>(defaultValue);

    const getBackgroundSize = () => ({
      backgroundSize: newPercentage
        ? `${(newPercentage * 100) / 100}% 100%`
        : `${defaultValue}% 100%`,
    });

    return (
      <div className="input-range range-container">
        <input
          name={name}
          ref={ref}
          type="range"
          maxLength={maxRange}
          defaultValue={newPercentage || defaultValue}
          {...props}
          className="input-range"
          style={getBackgroundSize()}
          disabled={disabled}
        />
        <input
          {...props}
          type="number"
          max={100}
          value={newPercentage || value}
          onChange={e => setValue(Number(e.target.value))}
          className="input-range-text"
          disabled={disabled}
        />
      </div>
    );
  }
);
export default InputRange;
