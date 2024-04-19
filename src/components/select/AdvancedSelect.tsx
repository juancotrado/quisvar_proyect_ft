import { CSSProperties, Ref } from 'react';
import SelectReact, {
  GroupBase,
  Props as SelectProps,
  SelectInstance,
} from 'react-select';
// import SelectReact from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { StylesVariant } from '../../types';
import { STYLE_SELECT_ADVANCE } from './selectDefinitions';
import { FieldErrors, FieldValues, Path } from 'react-hook-form';

interface AdvancedSelectProps<FormData extends FieldValues>
  extends SelectProps {
  label?: string;
  name: Path<FormData>;
  errors?: FieldErrors<FormData>;
  errorPosX?: number;
  errorPosY?: number;
  onCreateOption?: (inputValue: string) => void;
  isCreatable?: boolean;
  isRelative?: boolean;
  className?: string;
  refSelect?: Ref<SelectInstance<unknown, boolean, GroupBase<unknown>>>;
  styleVariant?: StylesVariant;
}

const AdvancedSelect = <FormData extends FieldValues>({
  label,
  name,
  errorPosX = 0,
  errorPosY = 0,
  errors,
  isRelative = false,
  className,
  refSelect,
  isCreatable,
  styleVariant = 'primary',
  onCreateOption,
  ...props
}: AdvancedSelectProps<FormData>) => {
  const style: CSSProperties = {
    transform: `translate(${errorPosX}px,${errorPosY}px)`,
    position: isRelative ? 'static' : 'absolute',
  };
  const SelectComponent = isCreatable ? CreatableSelect : SelectReact;
  return (
    <div className="select-container">
      {label && <label className="select-label">{label}</label>}

      <SelectComponent
        formatCreateLabel={inputValue => 'Crear: ' + inputValue}
        onCreateOption={onCreateOption}
        ref={refSelect}
        {...props}
        className={`AdvancedSelect ${STYLE_SELECT_ADVANCE[styleVariant]} ${className}`}
      />
      {name && errors && errors[name] && (
        <span className="input-span-error" style={style}>
          <img
            src="/svg/warning.svg"
            alt="warning"
            className="input-span-icon"
          />
          {errors[name]?.type === 'required'
            ? errors[name]?.message?.toString() || 'Por favor llene el campo.'
            : errors[name]?.message?.toString()}
        </span>
      )}
    </div>
  );
};

export default AdvancedSelect;
