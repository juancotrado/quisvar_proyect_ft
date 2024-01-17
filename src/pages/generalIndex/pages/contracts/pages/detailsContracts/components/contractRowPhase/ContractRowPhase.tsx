import { FocusEvent } from 'react';

import './contractRowPhase.css';
import { PhaseData } from '../../models';
import { CloseIcon } from '../../../../../../../../components';

interface ContractRowPhaseProps {
  phaseData: PhaseData;
  addPhase: (data: PhaseData, type: keyof PhaseData) => void;
  deletePhase: (id: string) => void;
}

const ContractRowPhase = ({
  phaseData,
  addPhase,
  deletePhase,
}: ContractRowPhaseProps) => {
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const values = {
      ...phaseData,
      [name]: name === 'isActive' ? value === 'on' : value,
    };
    addPhase(values, name as keyof PhaseData);
  };
  const handleDelete = () => {
    deletePhase(phaseData.id);
  };
  return (
    <div className="detailsContracts-phase-ejecution-row contractRowPhase-row">
      <CloseIcon
        size={0.8}
        left={0}
        top={0}
        className="contractRowPhase-close"
        onClick={handleDelete}
      />
      <input
        type="text"
        className="contractRowPhase-input"
        name="name"
        defaultValue={phaseData.name}
        onBlur={handleBlur}
      />
      <div className="contractRowPhase-input-day">
        <input
          type="text"
          name="days"
          className="contractRowPhase-input"
          defaultValue={phaseData.days}
          onBlur={handleBlur}
        />
        <span className="contractRowPhase-text">dias</span>
      </div>
      <div className="contractRowPhase-input-radio-contain">
        <input
          type="radio"
          className="contractRowPhase-input-radio"
          name="isActive"
          defaultChecked={phaseData.isActive}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default ContractRowPhase;
