import { useState } from 'react';
// import Button from '../../shared/button/Button'
import './AttendanceList.css';
import { Input } from '../..';
import { User } from '../../../types/types';

interface AttendanceListProps {
  onRadioChange: (value: string, id: number) => void;
  user: User;
  index: number;
}
const AttendanceList = ({
  onRadioChange,
  user,
  index,
}: AttendanceListProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(user.id);

  const handleRadioChange = (value: string, id: number) => {
    setSelectedValue(value);
    setUserId(id);
    onRadioChange(value, id);
  };
  return (
    <div
      className={`attendanceList-container ${
        index % 2 !== 0 ? 'attendanceList-bg' : ''
      }`}
    >
      <div className="attendanceList-col attendanceList-place">{index + 1}</div>
      <div className="attendanceList-col attendanceList-place">403</div>
      <div className="attendanceList-col">
        {user.profile.lastName} {user.profile.firstName}
      </div>
      <div className="attendanceList-col">{user.profile.dni}</div>
      <div className="attendanceList-col">{user.profile.phone}</div>
      <div className="attendanceList-col">EQUIPO 01 (101)</div>
      <div className="attendanceList-col">USUARIO 01</div>
      <div className="attendanceList-col attendanceList-place">
        <Input
          type="radio"
          value="PUNTUAL"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'PUNTUAL'}
          onChange={() => handleRadioChange('PUNTUAL', userId)}
        />
      </div>
      <div className="attendanceList-col attendanceList-place">
        <Input
          type="radio"
          value="TARDE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'TARDE'}
          onChange={() => handleRadioChange('TARDE', userId)}
        />
      </div>
      <div className="attendanceList-col attendanceList-place">
        <Input
          type="radio"
          value="SIMPLE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'SIMPLE'}
          onChange={() => handleRadioChange('SIMPLE', userId)}
        />
      </div>
      <div className="attendanceList-col attendanceList-place">
        <Input
          type="radio"
          value="GRAVE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'GRAVE'}
          onChange={() => handleRadioChange('GRAVE', userId)}
        />
      </div>
      <div className="attendanceList-col attendanceList-place">
        <Input
          type="radio"
          value="MUY_GRAVE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'MUY_GRAVE'}
          onChange={() => handleRadioChange('MUY_GRAVE', userId)}
        />
      </div>
      <div className="attendanceList-col attendanceList-place">
        <Input
          type="radio"
          value="PERMISO"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'PERMISO'}
          onChange={() => handleRadioChange('PERMISO', userId)}
        />
      </div>
    </div>
  );
};

export default AttendanceList;
