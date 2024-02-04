import { ChangeEvent, useEffect, useState, useContext } from 'react';
import { Button, Input } from '../../../../components';
import { DutyList, GroupAttendance } from '../../components';
import './groupDaily.css';
import { _date } from '../../../../utils';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { Duty, GroupAttendanceRes, GroupRes, PdfInfoProps } from '../../types';
import { SocketContext } from '../../../../context';
import { DutyPdf } from '../groupContent/views';
const now = new Date();
interface toSend {
  id: number;
  status: string;
  description?: string;
}
export const GroupDaily = () => {
  const socket = useContext(SocketContext);
  const [addBtn, setAddBtn] = useState<boolean>(true);
  const [selectedBtn, setSelectedBtn] = useState<number | null>(null);
  const [option, setOption] = useState<boolean>(true);
  const [pdfInfo, setPdfInfo] = useState<PdfInfoProps>();
  const [hasItems, setHasItems] = useState<boolean>(false);
  const [isToday, setIsToday] = useState<boolean>(true);
  const [showSecond, setShowSecond] = useState<boolean>(false);
  const [calls, setCalls] = useState<GroupRes[]>([]);
  const [idList, setIdList] = useState<number>();
  const [title, setTitle] = useState<string | undefined>('');
  const [hasDuty, setHasDuty] = useState<Duty[]>([]);
  const [groupUsers, setGroupUsers] = useState<GroupAttendanceRes[]>([]);
  const [sendItems, setSendItems] = useState<toSend[]>([]);
  const { groupId } = useParams();

  useEffect(() => {
    socket.on('server:action-button', () => {
      getTodayCalls();
    });

    return () => {
      socket.off('server:action-button');
    };
  }, []);

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
        viewList(res.data[res.data.length - 1], res.data.length);
      });
  };
  const getDate = (e: ChangeEvent<HTMLInputElement>) => {
    const today = new Date();
    const { value } = e.target;
    setGroupUsers([]);
    setCalls([]);
    setHasDuty([]);
    setOption(true);
    axiosInstance
      .get<GroupRes[]>(`/attendanceGroup/list/${groupId}?date=${value}`)
      .then(res => {
        setCalls(res.data);
        setIsToday(_date(today) === value);
      });
  };
  const addList = (order: number) => {
    setAddBtn(false);
    setTitle('');
    setGroupUsers([]);
    setCalls([]);
    setHasDuty([]);
    setOption(true);
    const today = new Date();
    const values = {
      nombre: order.toString(),
      groupId: +(groupId as string),
    };
    axiosInstance
      .post<GroupRes[]>(
        `/attendanceGroup/list?id=${groupId}&date=${_date(today)}`,
        values
      )
      .then(res => {
        // getTodayCalls();
        setSelectedBtn(res.data.length);
        // setAddBtn(res.data[res.data.length - 1]?.attendance.length !== 0);
        // socket.emit('client:action-button');
        viewList(res.data[res.data.length - 1], res.data.length);
        setCalls(res.data);
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
  const viewList = (item: GroupRes, idx: number) => {
    setPdfInfo({
      title: item.title,
      group: `Grupo : ${item.groups.name}`,
      mod: `${
        item.groups.moderator.profile.firstName +
        ' ' +
        item.groups.moderator.profile.lastName
      }`,
      createdAt: item.createdAt,
    });
    setIdList(item.id);
    setTitle(item?.title ?? '');
    setGroupUsers([]);
    setHasDuty([]);
    setShowSecond(false);
    if (item.attendance.length > 0) {
      setGroupUsers(item.attendance);
      setShowSecond(true);
      setHasItems(true);
      setHasDuty(item.duty);
    } else {
      getMembers();
    }
    setSelectedBtn(idx);
  };
  const handleDeleteList = (id: number) => {
    axiosInstance.delete(`/attendanceGroup/list/${id}`).then(() => {
      socket.emit('client:action-button');
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
      socket.emit('client:action-button');
      setAddBtn(true);
      setGroupUsers([]);
      getTodayCalls();
    });
  };
  // console.log(isToday)
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // console.log(value);
    axiosInstance
      .patch(`/attendanceGroup/list/title/${idList}`, { title: value })
      .then(() => {
        setTitle(value);
      });
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
            max={_date(now)}
            defaultValue={_date(now)}
          />
          {calls &&
            calls.map((call, idx) => {
              return (
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
                    onClick={() => viewList(call, idx + 1)}
                    className={`attendance-add-btn ${
                      selectedBtn === idx + 1 ? 'selected' : 'gd-gray'
                    }`}
                    style={{ width: '2rem', justifyContent: 'center' }}
                    // icon="plus"
                    text={`${call.nombre}`}
                    type="button"
                  />
                </div>
              );
            })}
          {isToday && addBtn && (
            <Button
              onClick={() => addList(calls.length + 1)}
              className="attendance-add-btn"
              // icon="plus"
              text="Añadir Nueva Lista"
            />
          )}
        </span>
      </div>
      {calls.length > 0 && groupUsers.length > 0 && (
        <div className="gd-attach">
          <div className="gd-options">
            <Button
              text="Asistencias"
              className="gd-options-btn"
              onClick={() => setOption(true)}
              type="button"
            />
            {showSecond && (
              <Button
                text="Compromisos"
                className="gd-options-btn"
                onClick={() => setOption(false)}
                type="button"
              />
            )}
          </div>
          {!option && (
            <div className="gd-titles">
              <h4 className="gd-header-title">Asunto de la reunión:</h4>
              {title ? (
                <h1 className="gdh-input">{title ?? ''}</h1>
              ) : (
                <input
                  placeholder="--> Inserte un titulo aquí <--"
                  className="gdh-input"
                  defaultValue={title}
                  onBlur={handleChangeTitle}
                  disabled={title ? true : false}
                />
              )}
              <h4 className="gd-header-title">Acta de reunión:</h4>
              <DutyPdf info={pdfInfo} attendance={groupUsers} duty={hasDuty} />
            </div>
          )}
        </div>
      )}
      <div>
        {option
          ? groupUsers.length > 0 && (
              <div className="gda-content">
                <GroupAttendance
                  hasItems={hasItems}
                  groupUsers={groupUsers}
                  onRadioChange={(e, v, d) => {
                    handleRadioChange(e, v, d);
                  }}
                />
                {isToday && !addBtn && !hasItems && (
                  <Button
                    onClick={handleRegisterCall}
                    className="gda-save"
                    // icon="plus"
                    text="Guardar"
                  />
                )}
              </div>
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
