import { ChangeEvent, forwardRef, useState } from 'react';
import { InputHTMLAttributes } from 'react';

import './inputRange.css';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  maxRange: number;
}

const InputRange = forwardRef<HTMLInputElement, InputTextProps>(
  ({ maxRange, ...props }, ref) => {
    const [value, setValue] = useState(0);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (+e.target.value > maxRange) return;
      setValue(+e.target.value);
    };
    console.log(value);
    return (
      <div className="input-range">
        <input
          ref={ref}
          type="range"
          value={value}
          maxLength={maxRange}
          {...props}
          className="input-range"
          onChange={handleChange}
        />
        <input type="text" max={100} value={value} onChange={handleChange} />
      </div>
    );
  }
);

export default InputRange;
