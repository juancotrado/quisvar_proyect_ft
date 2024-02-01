import { useState } from 'react';
import { Duty, GroupAttendanceRes } from '../../types';
import './dutyList.css';
import { Button, Input } from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
interface DutyListProps {
  groupUsers: GroupAttendanceRes[];
  idList?: number;
  onSave: () => void;
  hasDuty?: Duty[];
  isToday?: boolean;
}
type sendData = {
  fullName: string;
  description: string;
  untilDate: string;
  listId?: number;
};
const DutyList = ({
  groupUsers,
  idList,
  onSave,
  hasDuty,
  isToday,
}: DutyListProps) => {
  // console.log(groupUsers)
  const data = groupUsers.map(({ user, description }) => {
    return {
      fullName: user.profile.firstName + ' ' + user.profile.lastName,
      description: description,
      untilDate: '',
      listId: idList,
    };
  });
  const [items, setItems] = useState<sendData[]>(data);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setItems(updatedItems);
  };
  const handleAddRow = () => {
    setItems([
      ...items,
      { fullName: '', description: '', untilDate: '', listId: idList },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };
  const handleSubmit = () => {
    axiosInstance.post(`/duty`, items).then(() => {
      onSave();
    });
  };
  const formattedDate = (value: string) => {
    return value.split('T')[0];
  };
  return (
    <div className="dl-content">
      <div className="dl-header">
        <h1 className="dl-title dl-center">#</h1>
        <h1 className="dl-title">PARTICIPANTE</h1>
        <h1 className="dl-title">COMPROMISO DIARIO</h1>
        <h1 className="dl-title dl-center">FECHA LIMITE</h1>
      </div>
      {isToday &&
        hasDuty &&
        hasDuty?.length === 0 &&
        items &&
        items.map((item, idx) => (
          <div className="dl-body" key={idx}>
            <h1 className="dl-list dl-center">{idx + 1}</h1>
            {groupUsers.length > idx ? (
              <h1 className="dl-list">{item.fullName}</h1>
            ) : (
              <input
                type="text"
                className="dl-list"
                defaultValue={item.description}
                onBlur={e => handleInputChange(idx, 'fullName', e.target.value)}
              />
            )}
            <input
              type="text"
              className="dl-list"
              defaultValue={item.description}
              onBlur={e =>
                handleInputChange(idx, 'description', e.target.value)
              }
            />
            <Input
              type="date"
              classNameMain="dl-list"
              className=""
              defaultValue={item.untilDate}
              onChange={e =>
                handleInputChange(idx, 'untilDate', e.target.value)
              }
            />
            {groupUsers.length <= idx && (
              <span
                className="dl-delete-btn"
                onClick={() => handleDeleteRow(idx)}
              >
                x
              </span>
            )}
          </div>
        ))}
      {hasDuty &&
        hasDuty.map((item, idx) => (
          <div className="dl-body" key={item.id}>
            <h1 className="dl-list dl-center">{idx + 1}</h1>
            <h1 className="dl-list">{item.fullName}</h1>
            {/* {item.fullName ? (
              <h1 className="dl-list">{item.fullName}</h1>
            ) : (
              <input
                type="text"
                className="dl-list"
                value={item.description}
                onChange={e =>
                  handleInputChange(idx, 'fullName', e.target.value)
                }
              />
            )} */}
            <input
              type="text"
              className="dl-list"
              defaultValue={item.description}
              disabled
              // onChange={e =>
              //   handleInputChange(idx, 'description', e.target.value)
              // }
              onBlur={e => console.log(e.target.value)}
            />
            <Input
              type="date"
              classNameMain="dl-list"
              className=""
              value={formattedDate(item.untilDate as string)}
              // onChange={e =>
              //   handleInputChange(idx, 'untilDate', e.target.value)
              // }
              disabled
            />
            {groupUsers.length <= idx && !hasDuty && (
              <span
                className="dl-delete-btn"
                onClick={() => handleDeleteRow(idx)}
              >
                x
              </span>
            )}
          </div>
        ))}
      {isToday && hasDuty?.length === 0 && (
        <div className="dl-btns">
          <Button
            text="GUARDAR"
            className="attendance-add-btn"
            onClick={handleSubmit}
          />
          <Button
            text="AÑADIR"
            className="attendance-add-btn"
            onClick={handleAddRow}
          />
        </div>
      )}
    </div>
  );
};

export default DutyList;
