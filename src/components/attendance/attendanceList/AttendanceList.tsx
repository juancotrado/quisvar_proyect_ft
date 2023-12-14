import { useCallback, useEffect, useState } from 'react';
// import Button from '../../shared/button/Button'
import './AttendanceList.css';
import { Input } from '../..';
import { User, getLicenses } from '../../../types/types';
// import { axiosInstance } from '../../../services/axiosInstance';

interface AttendanceListProps {
  onRadioChange: (value: string, id: number) => void;
  user: User;
  index: number;
  status?: string | null;
  list: getLicenses[];
}
const AttendanceList = ({
  list,
  onRadioChange,
  user,
  index,
  status = null,
}: AttendanceListProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>();
  const [isActive, setisActive] = useState<boolean>(false);
  const haslength = list.find(lis => lis.usersId === user.id);
  const [usersId, setUserId] = useState<number>(user.id);

  const getLicense = useCallback(() => {
    if (haslength) {
      setisActive(!!haslength);
    }

    if (!status) {
      setSelectedValue(haslength ? 'PERMISO' : 'PUNTUAL');
    } else {
      setSelectedValue(status);
    }
  }, [haslength, status]);

  useEffect(() => {
    getLicense();
  }, [getLicense]);
  const handleRadioChange = (value: string, id: number) => {
    console.log(value, id);
    const selectedValue = value !== undefined ? value : 'PUNTUAL';
    setSelectedValue(selectedValue);
    setUserId(id);
    onRadioChange(value, id);
  };

  return (
    <div
      className={`attendanceList-container ${
        index % 2 !== 0 && 'attendanceList-bg'
      }`}
    >
      <div className="attendanceList-col attendanceList-place hide-field">
        {index + 1}
      </div>
      <div className="attendanceList-col attendanceList-place hide-field">
        {user.profile.room ?? '---'}
      </div>
      <div className="attendanceList-col">
        {user.profile.lastName} {user.profile.firstName}
      </div>
      <div className="attendanceList-col hide-field">{user.profile.dni}</div>
      <div className="attendanceList-col hide-field">{user.profile.phone}</div>
      {/* <div className="attendanceList-col">EQUIPO 01 (101)</div>
      <div className="attendanceList-col">USUARIO 01</div> */}
      <div className="attendanceList-col hide-field">
        {user.equipment ? user.equipment.workStation.name : '---'}
      </div>
      <div className="attendanceList-col hide-field">
        {' '}
        {user.profile.userPc ?? '---'}{' '}
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-config list-p">
        <Input
          type="radio"
          value="PUNTUAL"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'PUNTUAL'}
          onChange={() => handleRadioChange('PUNTUAL', usersId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place  attendanceList-config list-t">
        <Input
          type="radio"
          value="TARDE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'TARDE'}
          onChange={() => handleRadioChange('TARDE', usersId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-config list-f">
        <Input
          type="radio"
          value="SIMPLE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'SIMPLE'}
          onChange={() => handleRadioChange('SIMPLE', usersId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-config list-g">
        <Input
          type="radio"
          value="GRAVE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'GRAVE'}
          onChange={() => handleRadioChange('GRAVE', usersId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-config list-m">
        <Input
          type="radio"
          value="MUY_GRAVE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'MUY_GRAVE'}
          onChange={() => handleRadioChange('MUY_GRAVE', usersId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-config list-l">
        <Input
          type="radio"
          value="PERMISO"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'PERMISO'}
          onChange={() => handleRadioChange('PERMISO', usersId)}
          disabled={isActive ? true : !!status}
          // disabled={true}
        />
      </div>
    </div>
  );
};

export default AttendanceList;
