import { OptionProps, components } from 'react-select';
import { OptionSelect } from '../../../../types';
import { ButtonDelete } from '../../../button';
import { IconAction } from '../../../iconAction';
import './optionCrudSelect.css';
interface CustomOptionProps<T extends OptionSelect> extends OptionProps<T> {
  onEditOption?: (data: T) => void;
  onSave?: () => void;
  urlDelete: (data: T) => String;
}

const OptionCrudSelect = <T extends OptionSelect>(
  props: CustomOptionProps<T>
) => {
  const { data, onEditOption, onSave, urlDelete } = props;
  const isNew = '__isNew__' in data && data.__isNew__;
  return (
    <components.Option {...props}>
      <div className="OptionCrudSelect-option">
        <span style={{ marginRight: '8px' }}>{data.label}</span>
        {!isNew && (
          <div className="OptionCrudSelect-option-actions">
            <ButtonDelete
              icon="trash-red"
              url={`${urlDelete(data)}`}
              className="OptionCrudSelect-btn-delete"
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

export default OptionCrudSelect;
