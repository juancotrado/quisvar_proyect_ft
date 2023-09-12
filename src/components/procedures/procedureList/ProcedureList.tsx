import { useState } from 'react';
// import Button from '../../shared/button/Button'
import './ProcedureList.css';
import { Input } from '../..';
import { User } from '../../../types/types';

interface ProcedureListProps {
  onRadioChange: (value: string, id: number) => void;
  user: User;
  index: number;
}
const ProcedureList = ({ onRadioChange, user, index }: ProcedureListProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(user.id);

  const handleRadioChange = (value: string, id: number) => {
    setSelectedValue(value);
    setUserId(id);
    onRadioChange(value, id);
  };
  return (
    <div
      className={`procedureList-container ${
        index % 2 !== 0 ? 'procedureList-bg' : ''
      }`}
    >
      <div className="procedureList-col procedureList-place">{index + 1}</div>
      <div className="procedureList-col procedureList-place   ">403</div>
      <div className="procedureList-col">
        {user.profile.lastName} {user.profile.firstName}
      </div>
      <div className="procedureList-col">{user.profile.dni}</div>
      <div className="procedureList-col">{user.profile.phone}</div>
      <div className="procedureList-col">EQUIPO 01 (101)</div>
      <div className="procedureList-col">USUARIO 01</div>
      <div className="procedureList-col procedureList-place">
        <Input
          type="radio"
          value="PUNTUAL"
          classNameMain="procedureList-radio"
          checked={selectedValue === 'PUNTUAL'}
          onChange={() => handleRadioChange('PUNTUAL', userId)}
        />
      </div>
      <div className="procedureList-col procedureList-place">
        <Input
          type="radio"
          value="TARDE"
          classNameMain="procedureList-radio"
          checked={selectedValue === 'TARDE'}
          onChange={() => handleRadioChange('TARDE', userId)}
        />
      </div>
      <div className="procedureList-col procedureList-place">
        <Input
          type="radio"
          value="SIMPLE"
          classNameMain="procedureList-radio"
          checked={selectedValue === 'SIMPLE'}
          onChange={() => handleRadioChange('SIMPLE', userId)}
        />
      </div>
      <div className="procedureList-col procedureList-place">
        <Input
          type="radio"
          value="GRAVE"
          classNameMain="procedureList-radio"
          checked={selectedValue === 'GRAVE'}
          onChange={() => handleRadioChange('GRAVE', userId)}
        />
      </div>
      <div className="procedureList-col procedureList-place">
        <Input
          type="radio"
          value="MUY_GRAVE"
          classNameMain="procedureList-radio"
          checked={selectedValue === 'MUY_GRAVE'}
          onChange={() => handleRadioChange('MUY_GRAVE', userId)}
        />
      </div>
      <div className="procedureList-col procedureList-place">
        <Input
          type="radio"
          value="PERMISO"
          classNameMain="procedureList-radio"
          checked={selectedValue === 'PERMISO'}
          onChange={() => handleRadioChange('PERMISO', userId)}
        />
      </div>
    </div>
  );
};

export default ProcedureList;
