import { useState } from 'react';
import { OptionSelect, StylesVariant } from '../../types';
import { OptionProps, components } from 'react-select';
import { AdvancedSelect, IconAction } from '..';
import { Control, Controller } from 'react-hook-form';

interface AdvancedSelectCrudProps {
  options: OptionSelect[];
  control: Control<any, any, any>;
  errors?: { [key: string]: any };
  label?: string;
  name: string;
  placeholder?: string;
  styleVariant?: StylesVariant;
}
const AdvancedSelectCrud = ({
  options,
  control,
  errors,
  label,
  name,
  styleVariant,
  placeholder = 'Seleccione...',
}: AdvancedSelectCrudProps) => {
  const [selectData, setSelectData] = useState(options);

  const handleDeleteOption = (data: OptionSelect) => {
    const newOptions = selectData.filter(option => option.value !== data.value);
    setSelectData(newOptions);
  };
  const Option = (props: OptionProps<any>) => {
    return (
      <components.Option {...props}>
        <div className="AdvancedSelectCrud-option">
          <span style={{ marginRight: '8px' }}>{props.data.label}</span>

          <div className="AdvancedSelectCrud-option-actions">
            <IconAction
              icon="trash-red"
              position="none"
              onClick={() => handleDeleteOption(props.data)}
            />
            <IconAction
              icon="pencil-line"
              position="none"
              onClick={() => handleDeleteOption(props.data)}
            />
          </div>
        </div>
      </components.Option>
    );
  };
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: 'Debes seleccionar una opción' }}
      render={({ field: { onChange: onChangeForm } }) => (
        <AdvancedSelect
          placeholder={placeholder}
          components={{ Option }}
          options={selectData}
          isClearable
          label={label}
          errors={errors}
          name={name}
          onChange={onChangeForm}
          styleVariant={styleVariant}
        />
      )}
    />
  );
};

export default AdvancedSelectCrud;
