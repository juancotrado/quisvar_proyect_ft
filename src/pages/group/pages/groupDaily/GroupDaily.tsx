import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Input } from '../../../../components';
import { DutyList, GroupAttendance } from '../../components';
import './groupDaily.css';
import { _date } from '../../../../utils';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { Duty, GroupAttendanceRes, GroupRes } from '../../types';
const now = new Date();
interface toSend {
  id: number;
  status: string;
  description?: string;
}
export const GroupDaily = () => {
  const [addBtn, setAddBtn] = useState<boolean>(true);
  const [option, setOption] = useState<boolean>(true);
  const [hasItems, setHasItems] = useState<boolean>(false);
  const [isToday, setIsToday] = useState<boolean>(true);
  const [calls, setCalls] = useState<GroupRes[]>([]);
  const [idList, setIdList] = useState<number>();
  const [hasDuty, setHasDuty] = useState<Duty[]>([]);
  const [groupUsers, setGroupUsers] = useState<GroupAttendanceRes[]>([]);
  const [sendItems, setSendItems] = useState<toSend[]>([]);
  const { groupId } = useParams();

  const getMembers = () => {
    axiosInstance
      .get<GroupAttendanceRes[]>(`/attendanceGroup/users/${groupId}`)
      .then(res => {
        setGroupUsers(res.data);
        setHasItems(false);
        const resultado = res.data.map(({ id, status }) => ({
          id,
          status,
          description: '',
        }));
        setSendItems(resultado);
      });
  };

  useEffect(() => {
    getTodayCalls();
    // getMembers();
  }, []);
  const getTodayCalls = () => {
    setGroupUsers([]);
    setCalls([]);
    setHasDuty([]);
    const today = new Date();
    axiosInstance
      .get<GroupRes[]>(`/attendanceGroup/list/${groupId}?date=${_date(today)}`)
      .then(res => {
        setCalls(res.data);
        setAddBtn(res.data[res.data.length - 1]?.attendance.length !== 0);
      });
  };
  const getDate = (e: ChangeEvent<HTMLInputElement>) => {
    const today = new Date();
    const { value } = e.target;
    setGroupUsers([]);
    setCalls([]);
    setHasDuty([]);
    axiosInstance
      .get<GroupRes[]>(`/attendanceGroup/list/${groupId}?date=${value}`)
      .then(res => {
        setCalls(res.data);
        setIsToday(_date(today) === value);
      });
  };
  const addList = (order: number) => {
    setAddBtn(false);
    setGroupUsers([]);
    setCalls([]);
    setHasDuty([]);
    const values = {
      nombre: order.toString(),
      groupId: +(groupId as string),
    };
    axiosInstance.post(`/attendanceGroup/list`, values).then(() => {
      getTodayCalls();
    });
  };
  const handleRadioChange = (
    status: string,
    id: number,
    description?: string
  ) => {
    const updatedSendItems = sendItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          description: description || item.description,
        };
      }
      return item;
    });
    setSendItems(updatedSendItems);
  };
  const viewList = (item: GroupRes) => {
    setIdList(item.id);
    if (item.attendance.length > 0) {
      setGroupUsers(item.attendance);
      setHasItems(true);
      setHasDuty(item.duty);
    } else {
      getMembers();
    }
    // setAddBtn(true);
  };
  const handleDeleteList = (id: number) => {
    axiosInstance.delete(`/attendanceGroup/list/${id}`).then(() => {
      setAddBtn(true);
      // setCalls([])
      setGroupUsers([]);
      getTodayCalls();
    });
  };
  const handleRegisterCall = () => {
    const data = sendItems.map(({ id, ...rest }) => ({
      ...rest,
      userId: id,
      groupListId: idList,
    }));
    // setAddBtn(!addBtn)
    axiosInstance.post(`/attendanceGroup/relation`, data).then(() => {
      setAddBtn(true);
      setGroupUsers([]);
      getTodayCalls();
    });
  };
  // console.log(isToday)
  return (
    <div className="gd-content">
      <div className="gd-header">
        <span className="attendance-date">
          <img src="/svg/calendary-icon.svg" className="attendance-icon" />
          <Input
            type="date"
            onChange={getDate}
            classNameMain="attendace-date-filter"
            max={_date(now)}
            defaultValue={_date(now)}
          />
          {calls &&
            calls.map(call => (
              <div key={call.id} style={{ position: 'relative' }}>
                {!call?.attendance.length && (
                  <span
                    onClick={() => handleDeleteList(call.id)}
                    className="gd-close-span"
                  >
                    x
                  </span>
                )}
                <Button
                  onClick={() => viewList(call)}
                  className="attendance-add-btn"
                  style={{ width: '2rem', justifyContent: 'center' }}
                  // icon="plus"
                  text={`${call.nombre}`}
                />
              </div>
            ))}
          {isToday && addBtn && (
            <Button
              onClick={() => addList(calls.length + 1)}
              className="attendance-add-btn"
              // icon="plus"
              text="Añadir Nueva Lista"
            />
          )}
        </span>
        {isToday && !addBtn && (
          <Button
            onClick={handleRegisterCall}
            className="attendance-add-btn"
            // icon="plus"
            text="Guardar"
          />
        )}
      </div>
      {calls.length > 0 && groupUsers.length > 0 && (
        <div className="gd-options">
          <Button
            text="Asistencias"
            className="gd-options-btn"
            onClick={() => setOption(true)}
          />
          <Button
            text="Compromisos"
            className="gd-options-btn"
            onClick={() => setOption(false)}
          />
        </div>
      )}
      <div className="gd-body">
        {option
          ? groupUsers.length > 0 && (
              <GroupAttendance
                hasItems={hasItems}
                groupUsers={groupUsers}
                onRadioChange={(e, v, d) => {
                  // console.log(e, v);
                  handleRadioChange(e, v, d);
                }}
              />
            )
          : (hasDuty.length > 0 || isToday) &&
            groupUsers.length > 0 && (
              <DutyList
                groupUsers={groupUsers}
                isToday={isToday}
                hasDuty={hasDuty}
                idList={idList}
                onSave={getTodayCalls}
              />
            )}
      </div>
    </div>
  );
};

export default GroupDaily;
