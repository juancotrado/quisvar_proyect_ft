import { useEffect, useState } from 'react';
import { OptionSelect, StylesVariant } from '../../types';
import { OptionProps, components, Props as SelectProps } from 'react-select';
import { AdvancedSelect, ButtonDelete, IconAction } from '..';
import { Control, Controller } from 'react-hook-form';

interface AdvancedSelectCrudProps extends SelectProps {
  options: OptionSelect[];
  control?: Control<any, any, any>;
  errors?: { [key: string]: any };
  label?: string;
  name: string;
  placeholder?: string;
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
  placeholder = 'Seleccione...',
  isMulti,
  ...props
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
                size={1.5}
                onClick={() => onEditOption?.(data)}
              />
            </div>
          )}
        </div>
      </components.Option>
    );
  };
  return control ? (
    <Controller
      control={control}
      name={name}
      rules={{ required: 'Debes seleccionar una opción' }}
      render={({ field: { onChange: onChangeForm, value: data } }) => {
        console.log('data', data);
        return (
          <AdvancedSelect
            placeholder={placeholder}
            components={{ Option }}
            options={selectData}
            isClearable
            isCreatable
            onCreateOption={onCreateOption}
            value={
              !isMulti ? selectData.find(c => c.value === data.value) : data
            }
            label={label}
            errors={errors}
            name={name}
            onChange={onChangeForm}
            styleVariant={styleVariant}
            isMulti={isMulti}
            {...props}
          />
        );
      }}
    />
  ) : (
    <AdvancedSelect
      placeholder={placeholder}
      components={{ Option }}
      options={selectData}
      isClearable
      isCreatable
      onCreateOption={onCreateOption}
      label={label}
      errors={errors}
      name={name}
      styleVariant={styleVariant}
      {...props}
    />
  );
};

export default AdvancedSelectCrud;
