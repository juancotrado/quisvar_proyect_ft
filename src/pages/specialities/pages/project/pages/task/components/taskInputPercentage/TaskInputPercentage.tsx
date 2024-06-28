import { VscPercentage } from 'react-icons/vsc';
import { Input } from '../../../../../../../../components';
import './taskInputPercentage.css';
import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';

interface TaskInputPercentageProps {
  onChange?: (value: number) => void;
  value?: number;
  disabled?: boolean;
}

const TaskInputPercentage = ({
  onChange,
  value,
  disabled = false,
}: TaskInputPercentageProps) => {
  const [percentage, setPercentage] = useState('0');
  const isControlled = useRef(!!onChange);

  const handlePercentage = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    handleSetPercentage(String(Math.min(+value, 100) || ''));
  };
  const handleBlurPercentage = ({ target }: FocusEvent<HTMLInputElement>) => {
    if (!target.value) handleSetPercentage('0');
  };

  const handleSetPercentage = (value: string) => {
    if (isControlled.current) {
      return onChange!(+value);
    }
    setPercentage(value);
  };

  const PERCENTAGE_VALUES = ['25', '50', '75', '100'];

  useEffect(() => {
    setPercentage(String(value));
  }, [value]);

  return (
    <div className="taskInpuPercentage">
      <div className="taskInpuPercentage-input-container">
        <Input
          type="number"
          value={percentage}
          className="taskInpuPercentage-input"
          onChange={handlePercentage}
          onFocus={({ target }) => target?.select()}
          onBlur={handleBlurPercentage}
          disabled={disabled}
          styleInputDisabled={2}
        />
        <VscPercentage className="taskInpuPercentage-icon" />
      </div>
      {!disabled && (
        <div className="taskInpuPercentage-span-container">
          {PERCENTAGE_VALUES.map(el => (
            <span
              key={el}
              className="taskInpuPercentage-span-text"
              onClick={() => handleSetPercentage(el)}
            >
              {el}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskInputPercentage;
