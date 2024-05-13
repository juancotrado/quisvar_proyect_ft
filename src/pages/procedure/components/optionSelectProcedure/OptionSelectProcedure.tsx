import { components } from 'react-select';
import { OptionProps } from 'react-select';
import { IconAction } from '../../../../components';
import './optionSelectProcedure.css';
import { Contact } from '../../models';

function OptionSelectProcedure(props: OptionProps<Contact>) {
  const { data, isSelected } = props;
  const isArea = 'quantity' in data;
  return (
    <components.Option {...props}>
      <div className="optionSelectProcedure" key={props.innerProps.key}>
        <span
          style={{
            marginRight: '8px',
            display: 'flex',
            gap: 5,
            alignItems: 'center',
          }}
          className={`optionSelectProcedure-text-${isArea ? 'area' : 'user'}`}
        >
          {isArea && (
            <IconAction
              size={2}
              icon={isSelected ? 'office-white' : 'office'}
              position="none"
            />
          )}
          {!isArea && '- '} {data.label}
        </span>

        {isArea && (
          <span className="optionSelectProcedure-count-office">
            {data.quantity}
          </span>
        )}
      </div>
    </components.Option>
  );
}

export default OptionSelectProcedure;
