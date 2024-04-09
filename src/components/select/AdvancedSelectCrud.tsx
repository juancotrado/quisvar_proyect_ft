import { useEffect, useState } from 'react';
import { OptionSelect, StylesVariant } from '../../types';
import { OptionProps, components } from 'react-select';
import { AdvancedSelect, ButtonDelete, IconAction } from '..';
import { Control, Controller } from 'react-hook-form';

interface AdvancedSelectCrudProps {
  options: OptionSelect[];
  control: Control<any, any, any>;
  errors?: { [key: string]: any };
  label?: string;
  name: string;
  placeholder?: string;
  itemKey: string;
  styleVariant?: StylesVariant;
  onCreateOption?: (value: string) => void;
  onEditOption?: (value: any) => void;
  onSave?: () => void;
  urlDelete: string;
}
const AdvancedSelectCrud = ({
  options,
  control,
  errors,
  label,
  name,
  styleVariant,
  onEditOption,
  onCreateOption,
  onSave,
  urlDelete,
  itemKey,
  placeholder = 'Seleccione...',
}: AdvancedSelectCrudProps) => {
  const [selectData, setSelectData] = useState(options);
  useEffect(() => {
    setSelectData(options);
  }, [options]);

  const Option = (props: OptionProps<any>) => {
    const { data } = props;
    const isNew = data.__isNew__;
    return (
      <components.Option {...props}>
        <div className="AdvancedSelectCrud-option">
          <span style={{ marginRight: '8px' }}>{data.label}</span>

          {!isNew && (
            <div className="AdvancedSelectCrud-option-actions">
              <ButtonDelete
                icon="trash-red"
                url={`${urlDelete}/${data.value}`}
                className="subtaskFile-btn-delete"
                onSave={onSave}
                type="button"
              />
              <IconAction
                icon="pencil-line"
                position="none"
                onClick={() => onEditOption?.(data)}
              />
            </div>
          )}
        </div>
      </components.Option>
    );
  };
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: 'Debes seleccionar una opción' }}
      render={({ field: { onChange: onChangeForm, value: data } }) => (
        <AdvancedSelect
          placeholder={placeholder}
          components={{ Option }}
          options={selectData}
          isClearable
          isCreatable
          onCreateOption={onCreateOption}
          value={selectData.find(c => c.value === data?.[itemKey])}
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
