import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Input } from '../../../../components';
import { GroupAttendance } from '../../components';
import './groupDaily.css';
import { _date } from '../../../../utils';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { GroupRes, GroupUsersRes } from '../../types';
const today = new Date();
export const GroupDaily = () => {
  const [addBtn, setAddBtn] = useState<boolean>(true);
  const [calls, setCalls] = useState<GroupRes[]>([]);
  const [groupUsers, setGroupUsers] = useState<GroupUsersRes[]>([]);
  const { groupId } = useParams();

  const getMembers = () => {
    axiosInstance
      .get<GroupUsersRes[]>(`/attendanceGroup/users/${groupId}`)
      .then(res => {
        setGroupUsers(res.data);
      });
  };

  useEffect(() => {
    getTodayCalls();
    getMembers();
  }, []);
  const getTodayCalls = () => {
    axiosInstance
      .get<GroupRes[]>(`/attendanceGroup/list/${groupId}?date=${_date(today)}`)
      .then(res => {
        // console.log(res.data);
        setCalls(res.data);
      });
  };

  const getDate = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log(value);
    axiosInstance
      .get<GroupRes[]>(`/attendanceGroup/list/${groupId}?date=${value}`)
      .then(res => {
        // console.log(res.data);
      });
  };
  const addList = (order: number) => {
    setAddBtn(false);
    const values = {
      nombre: order.toString(),
      groupId: +(groupId as string),
    };
    axiosInstance.post(`/attendanceGroup/list`, values).then(res => {
      console.log(res.data);
      getTodayCalls();
    });
  };
  const addCall = () => {
    setAddBtn(true);
  };
  return (
    <div className="gd-content">
      <div className="gd-header">
        <span className="attendance-date">
          <img src="/svg/calendary-icon.svg" className="attendance-icon" />
          <Input
            type="date"
            onChange={getDate}
            classNameMain="attendace-date-filter"
            max={_date(today)}
            defaultValue={_date(today)}
          />
          {calls &&
            calls.map(call => (
              <div key={call.id}>
                <Button
                  // onClick={addList}
                  className="attendance-add-btn"
                  // icon="plus"
                  text={`${call.nombre}`}
                />
              </div>
            ))}
          {addBtn && (
            <Button
              onClick={() => addList(calls.length + 1)}
              className="attendance-add-btn"
              // icon="plus"
              text="Añadir Nueva Lista"
            />
          )}
        </span>
        {!addBtn && (
          <Button
            onClick={addCall}
            className="attendance-add-btn"
            // icon="plus"
            text="Guardar"
          />
        )}
      </div>
      <div className="gd-body">
        <GroupAttendance groupUsers={groupUsers} />
      </div>
    </div>
  );
};

export default GroupDaily;
