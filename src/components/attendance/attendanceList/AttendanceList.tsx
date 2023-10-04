import { useEffect, useState } from 'react';
// import Button from '../../shared/button/Button'
import './AttendanceList.css';
import { Input } from '../..';
import { ListAttendance, User } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';

interface AttendanceListProps {
  onRadioChange: (value: string, id: number) => void;
  user: User;
  index: number;
  status?: string | null;
  // list: ListAttendance;
  list: any[];
}
const AttendanceList = ({
  list,
  onRadioChange,
  user,
  index,
  status = null,
}: AttendanceListProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isActive, setisActive] = useState<boolean>(false);
  useEffect(() => {
    // getLicense();
    setSelectedValue(status);
  }, [status]);
  console.log(list.find(lis => lis.id === user.id));

  // const haslength = list.users.length === 0;
  // const getLicense = async () => {
  //   const response = await axiosInstance.get(`/license/${user.id}?status=ACTIVE`);
  //   const license = response.data ? true : false;
  //   // console.log(response.data ? true : false);
  //   setisActive(license && haslength);
  //   setSelectedValue(license && haslength ? 'PERMISO' : status);
  //   onRadioChange('PERMISO', user.id);
  // };
  // console.log(getLicense);

  const [userId, setUserId] = useState<number>(user.id);

  const handleRadioChange = (value: string, id: number) => {
    setSelectedValue(value);
    setUserId(id);
    onRadioChange(value, id);
  };
  // console.log(user);

  return (
    <div
      className={`attendanceList-container ${
        index % 2 !== 0 && 'attendanceList-bg'
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
      <div className="attendanceList-col attendanceList-place attendanceList-p">
        <Input
          type="radio"
          value="PUNTUAL"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'PUNTUAL'}
          onChange={() => handleRadioChange('PUNTUAL', userId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-t">
        <Input
          type="radio"
          value="TARDE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'TARDE'}
          onChange={() => handleRadioChange('TARDE', userId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-f">
        <Input
          type="radio"
          value="SIMPLE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'SIMPLE'}
          onChange={() => handleRadioChange('SIMPLE', userId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-g">
        <Input
          type="radio"
          value="GRAVE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'GRAVE'}
          onChange={() => handleRadioChange('GRAVE', userId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-m">
        <Input
          type="radio"
          value="MUY_GRAVE"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'MUY_GRAVE'}
          onChange={() => handleRadioChange('MUY_GRAVE', userId)}
          disabled={isActive ? true : !!status}
        />
      </div>
      <div className="attendanceList-col attendanceList-place attendanceList-l">
        <Input
          type="radio"
          value="PERMISO"
          classNameMain="attendanceList-radio"
          checked={selectedValue === 'PERMISO'}
          onChange={() => handleRadioChange('PERMISO', userId)}
          disabled={isActive ? true : !!status}
        />
      </div>
    </div>
  );
};

export default AttendanceList;
