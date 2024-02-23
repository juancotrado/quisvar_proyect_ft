import './contractRowSchedule.css';

interface ContractRowScheduleProps {
  title: string;
  firstValue: string;
  secondValue: string;
  isHeader?: boolean;
}
const ContractRowSchedule = ({
  title,
  firstValue,
  secondValue,
  isHeader = false,
}: ContractRowScheduleProps) => {
  return (
    <div className="detailsContracts-row-schedule">
      <span
        className={`${
          isHeader
            ? 'contractRowSchedule-text-title'
            : 'contractRowSchedule-text-subtitle'
        }`}
      >
        {title}
      </span>
      <span
        className={`${
          isHeader
            ? 'contractRowSchedule-text-title'
            : 'contractRowSchedule-text-info'
        }`}
      >
        {firstValue}
      </span>
      <span
        className={`${
          isHeader
            ? 'contractRowSchedule-text-title'
            : 'contractRowSchedule-text-info'
        }`}
      >
        {secondValue}
      </span>
    </div>
  );
};

export default ContractRowSchedule;
