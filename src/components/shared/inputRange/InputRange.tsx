import { ChangeEvent, forwardRef, useState } from 'react';
import { InputHTMLAttributes } from 'react';

import './inputRange.css';

interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  maxRange: number;
  percentage?: number;
  onChange?: (value: number) => void;
}

const InputRange = forwardRef<HTMLInputElement, InputTextProps>(
  ({ maxRange, percentage, onChange, ...props }, ref) => {
    const [value, setValue] = useState(percentage ? percentage : 0);
    const getBackgroundSize = (v: number) => ({
      backgroundSize:
        typeof v === 'number' ? `${(v * 100) / 100}% 100%` : '0% 100%',
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = +e.target.value;
      if (newValue > maxRange) return;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };
    // const barFilledStyle = {
    //   width: `${value}%`,
    // };
    // console.log(value);
    return (
      <div className="input-range range-container">
        <input
          ref={ref}
          type="range"
          value={value}
          maxLength={maxRange}
          {...props}
          className="input-range"
          onChange={handleChange}
          style={getBackgroundSize(value)}
        />
        <input
          type="text"
          max={100}
          value={value}
          onChange={handleChange}
          className="input-range-text"
        />
      </div>
    );
  }
);
export default InputRange;
