import { useState } from 'react';
import { Input } from '../../../../components';
import { GroupUsersRes } from '../../types';
import './listItems.css';
interface ListItemProps {
  onRadioChange: (value: string, id: number) => void;
  groupUsers: GroupUsersRes;
  idx: number;
}
const ListItems = ({ groupUsers, idx, onRadioChange }: ListItemProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    groupUsers.status
  );
  const [usersId, setUserId] = useState<number>(groupUsers.id);
  const handleRadioChange = (value: string, id: number) => {
    const selectedValue = value !== undefined ? value : 'PUNTUAL';
    setSelectedValue(selectedValue);
    setUserId(id);
    onRadioChange(value, id);
  };
  return (
    <div className="li-list">
      <h1 className="li-member">{idx + 1}</h1>
      <h1 className="li-member" style={{ marginRight: 15 }}>
        {groupUsers.firstName + ' ' + groupUsers.lastName}
      </h1>
      <h1 className="li-attendance">
        <div className="attendanceList-col attendanceList-place attendanceList-config list-p">
          <Input
            type="radio"
            value="PUNTUAL"
            classNameMain="attendanceList-radio"
            checked={selectedValue === 'PUNTUAL'}
            onChange={() => handleRadioChange('PUNTUAL', usersId)}
            //   disabled={isActive ? true : !!status}
          />
        </div>
        <div className="attendanceList-col attendanceList-place attendanceList-config list-t">
          <Input
            type="radio"
            value="TARDE"
            classNameMain="attendanceList-radio"
            checked={selectedValue === 'TARDE'}
            onChange={() => handleRadioChange('TARDE', usersId)}
            //   disabled={isActive ? true : !!status}
          />
        </div>
        <div className="attendanceList-col attendanceList-place attendanceList-config list-f">
          <Input
            type="radio"
            value="FALTA"
            classNameMain="attendanceList-radio"
            checked={selectedValue === 'FALTA'}
            onChange={() => handleRadioChange('FALTA', usersId)}
            //   disabled={isActive ? true : !!status}
          />
        </div>
        <div className="attendanceList-col attendanceList-place attendanceList-config list-g">
          <Input
            type="radio"
            value="GRAVE"
            classNameMain="attendanceList-radio"
            checked={selectedValue === 'GRAVE'}
            onChange={() => handleRadioChange('GRAVE', usersId)}
            //   disabled={isActive ? true : !!status}
          />
        </div>
        <div className="attendanceList-col attendanceList-place attendanceList-config list-m">
          <Input
            type="radio"
            value="MUY_GRAVE"
            classNameMain="attendanceList-radio"
            checked={selectedValue === 'MUY_GRAVE'}
            onChange={() => handleRadioChange('MUY_GRAVE', usersId)}
            //   disabled={isActive ? true : !!status}
          />
        </div>
        <div className="attendanceList-col attendanceList-place attendanceList-config list-l">
          <Input
            type="radio"
            value="PERMISO"
            classNameMain="attendanceList-radio"
            checked={selectedValue === 'PERMISO'}
            onChange={() => handleRadioChange('PERMISO', usersId)}
            //   disabled={isActive ? true : !!status}
          />
        </div>
      </h1>
      <h1 className="li-member" style={{ marginLeft: 15 }}>
        Terminar el proyecto llaquepa
      </h1>
    </div>
  );
};

export default ListItems;
