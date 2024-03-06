import { CSSProperties } from 'react';
import './contractRowSchedule.css';
import { PayData } from '../../models';

interface ContractRowScheduleProps {
  data: {
    [key: string]: {
      value: string;
      fr: string;
    };
  };
  isHeader?: boolean;
  extraData?: PayData[];
  hasBorder?: boolean;
}
const ContractRowSchedule = ({
  data,
  isHeader = false,
  extraData,
  hasBorder = true,
}: ContractRowScheduleProps) => {
  const frs = Object.values(data)
    .map(({ fr }) => fr)
    .join(' ');
  const style: CSSProperties = {
    gridTemplateColumns: frs,
    borderTop: hasBorder ? ' 1px solid #dce4f1' : '',
  };
  return (
    <div className="contractRowSchedule">
      <div className="detailsContracts-row-schedule" style={style}>
        {Object.values(data).map(({ value }) => (
          <span
            className={`${
              isHeader
                ? 'contractRowSchedule-text-title'
                : 'contractRowSchedule-text-subtitle'
            }`}
          >
            {value}
          </span>
        ))}
      </div>
      <div className="detailsContracts-row-extra">
        {extraData?.map(({ amount, description, percentage, id }, i) => (
          <ContractRowSchedule
            key={id}
            data={{
              1: { value: `C.P. ${i + 1}`, fr: '1fr' },
              2: { value: description, fr: '2fr' },
              3: { value: `${percentage}% `, fr: '1fr' },
              4: { value: String(amount), fr: '1fr' },
              5: { value: true ? '✅' : '', fr: '1fr' },
            }}
            hasBorder={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ContractRowSchedule;
