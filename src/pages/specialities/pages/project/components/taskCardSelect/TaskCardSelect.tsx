import SelectReact, { MultiValue, SingleValue } from 'react-select';
import { OptionUserExtend } from '../../../../../../types';
import './taskCardSelect.css';
import {
  OptionUserSelect,
  ControlUser,
} from '../../../../../../components/select/optionComponents';

// type OptionValuesExtend<OptionValues> = OptionValues;

interface TaskCardSelectProps<OptionValues extends OptionUserExtend> {
  label?: string;
  options: OptionValues[];
  viewAssigned?: boolean;
  onAssigned?: () => void;
  isDisabled?: boolean;
  onChange?: (value: OptionValues | null) => void;
}
function TaskCardSelect<OptionValues extends OptionUserExtend>({
  label,
  options,
  onAssigned,
  isDisabled = false,
  viewAssigned = false,
  onChange,
}: TaskCardSelectProps<OptionValues>) {
  const handleSelectOption = (option: SingleValue<OptionValues>) => {
    console.log(option);
    if (!option) {
      return onChange?.(null);
    }
    onChange?.(option);
  };

  return (
    <div className="taskCardSelect">
      {label && <span className="taskCardSelect-label">{label}</span>}
      <div className="taskCardSelect-contain">
        <SelectReact
          isClearable
          options={options}
          components={{
            Option: OptionUserSelect<OptionValues>,
            Control: ControlUser,
          }}
          isDisabled={isDisabled}
          onChange={handleSelectOption}
          placeholder="Sin asignar..."
          className="taskCardSelect-select"
          styles={{
            control: baseStyles => ({
              ...baseStyles,
              borderColor: 'transparent',
              fontSize: '0.875rem',
              fontWeight: '500',
              paddingLeft: 10,
            }),
            placeholder: provided => ({
              ...provided,
              fontSize: '0.8rem',
              fontWeight: '500',
            }),
          }}
        />
        {viewAssigned && (
          <span className="taskCardSelect-assign" onClick={onAssigned}>
            Asignarme
          </span>
        )}
      </div>
    </div>
  );
}

export default TaskCardSelect;
