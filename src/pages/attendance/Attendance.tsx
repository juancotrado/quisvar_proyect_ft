import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { AttendanceList, CardViewPdf, Input, Legend } from '../../components';
import './Attendance.css';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { _date } from '../../utils/formatDate';
import { AttendanceRange, ListAttendance, User } from '../../types/types';
import { SocketContext } from '../../context/SocketContex';
import { generateReportRange } from './GenerateReportRange';
// import { generateReportDaily } from './GenerateReportDaily';
// import html2canvas from 'html2canvas';
import { isOpenCardViewPdf$ } from '../../services/sharingSubject';
interface sendItemsProps {
  usersId: number;
  status: string;
}
const llamados = [
  { title: 'primer llamado' },
  { title: 'segundo llamado' },
  { title: 'tercero llamado' },
  { title: 'cuarto llamado' },
  { title: 'quinto llamado' },
  { title: 'sexto llamado' },
];
const today = new Date();
const Attendance = () => {
  const [sendItems, setSendItems] = useState<sendItemsProps[]>([]);
  const [callLists, setCallLists] = useState<ListAttendance[] | null>(null);
  const [callList, setCallList] = useState<ListAttendance | null>(null);
  const [date, setDate] = useState(_date(today));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportPDF, setExportPdf] = useState<AttendanceRange[]>();

  const { listUsers: users } = useSelector((state: RootState) => state);
  const socket = useContext(SocketContext);

  const componentRef = useRef(null);

  // const handleCapture = () => {
  //   const currentComponent = componentRef.current;
  //   if (currentComponent) {
  //     html2canvas(currentComponent).then(canvas => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const link = document.createElement('a');
  //       link.href = imgData;
  //       link.download = 'captura.png';
  //       link.click();
  //     });
  //   }
  // };
  const handleRadioChange = (status: string, usersId: number) => {
    const findId = sendItems.find(item => item.usersId === usersId);
    if (findId) {
      const filterList = sendItems.map(item =>
        item.usersId === usersId ? { ...item, status } : item
      );
      setSendItems(filterList);
    } else {
      setSendItems([...sendItems, { usersId, status }]);
    }
  };
  // console.log({ callLists });
  const filterUsers = useMemo(() => {
    return callList?.users.length
      ? users?.filter(
          (user, index) => user.id === callList?.users[index]?.usersId
        )
      : users?.filter(user => user.status === true);
  }, [callList?.users, users]);
  useEffect(() => {
    getTodayData();
    deleteLists();
  }, []);
  const getTodayData = async () => {
    const res = await axiosInstance.get(
      `/list/attendance/?startDate=${_date(today)}`
    );
    setCallLists(res.data);
    return res.data;
  };
  // borrar listas de ayer que no tengan asuarios
  const deleteLists = async () => {
    const res = await axiosInstance.delete('/list');
    return res.data;
  };
  const generateAttendance = () => {
    axiosInstance
      .post(`/list/attendance/${callList?.id}`, sendItems)
      .then(async () => {
        const data = await getTodayData();
        const callListFind = data.find(
          (list: ListAttendance) => list.id === callList?.id
        );
        setCallList(callListFind);
      });
  };
  const callNotification = () => {
    socket.emit('client:call-notification');
  };
  const addCall = async () => {
    const res = await axiosInstance.get(
      `/list/attendance/?startDate=${_date(today)}`
    );
    if (!(llamados.length > res.data.length)) return;
    const body = llamados[res.data.length];
    axiosInstance.post(`/list`, body).then(async () => {
      const data = await getTodayData();
      setCallList(data[data.length - 1]);
    });
  };

  const getDate = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDate(value);
    axiosInstance.get(`/list/attendance/?startDate=${value}`).then(res => {
      setCallLists(res.data);
      setCallList(null);
    });
  };
  const showAttendanceUsers = (data: ListAttendance) => {
    setCallList(data);
  };
  const getStatus = (user: User) => {
    const data = callList?.users?.filter(el => el.usersId === user.id);
    return data?.[0]?.status;
  };

  const isCompletCallAttendance = callLists?.every(
    list => list.users.length > 0
  );
  const todayVerify = date === _date(today);
  const exportExcel = async () => {
    const response = await axiosInstance.get(
      `/list/attendance/range/?startDate=${startDate}&endDate=${endDate}`
    );
    const newData: AttendanceRange[] = response.data;
    // console.log(newData);
    setExportPdf(newData);
    generateReportRange({
      startDate,
      endDate,
      printData: newData,
    });
  };
  const exportDaily = async () => {
    const response = await axiosInstance.get(
      `/list/attendance/range/?startDate=${date}&endDate=${date}`
    );
    const newData: AttendanceRange[] = response.data;
    // console.log(newData);
    // setExportPdf(newData);
    const patito = { isOpen: true, data: newData, daily: date };
    isOpenCardViewPdf$.setSubject = patito;
    // generateReportDaily({
    //   startDate: date,
    //   printData: newData,
    // });
  };
  const handleOpenPreView = () => {
    exportDaily();
  };
  return (
    <div className="attendance container">
      <div className="attendance-head">
        <div>
          <h1 className="main-title">
            <span className="main-title-span">Asistencia</span>
          </h1>
        </div>
      </div>
      <span className="attendance-date">
        <img src="/svg/calendary-icon.svg" alt="" className="attendance-icon" />
        <Input
          type="date"
          onChange={getDate}
          classNameMain="attendace-date-filter"
          max={_date(today)}
          defaultValue={_date(today)}
        />
        {callLists?.map(data => (
          <div
            className="attendance-call-status"
            onClick={() => {
              showAttendanceUsers(data);
            }}
            key={data.id}
          >
            <img
              src={`/svg/${
                !data?.users.length
                  ? 'arrow-pressed'
                  : callList?.id !== data.id
                  ? 'arrow-gray'
                  : 'arrow-border'
              }.svg`}
              className="attendance-img"
            />
            <p className="attendance-text">{data.title}</p>
          </div>
        ))}
        {isCompletCallAttendance && todayVerify && (
          <Button
            onClick={addCall}
            className="attendance-add-btn"
            icon="plus"
          />
        )}
      </span>
      {callList && (
        <>
          <div className="attendance-card-container" ref={componentRef}>
            <div className="attendance-header">
              <div className="attendance-list-text">ITEM</div>
              <div className="attendance-list-text">CUARTOS</div>
              <div className="attendance-list-text">APELLIDO Y NOMBRE</div>
              <div className="attendance-list-text">DNI</div>
              <div className="attendance-list-text">CELULAR</div>
              <div className="attendance-list-text">EQUIPO</div>
              <div className="attendance-list-text">USUARIO</div>
              <div className="attendance-list-text attendance-p">P</div>
              <div className="attendance-list-text attendance-t">T</div>
              <div className="attendance-list-text attendance-f">F</div>
              <div className="attendance-list-text attendance-g">G</div>
              <div className="attendance-list-text attendance-m">M</div>
              <div className="attendance-list-text attendance-l">L</div>
            </div>
            {filterUsers?.map((user, index) => (
              <AttendanceList
                key={user.id}
                onRadioChange={handleRadioChange}
                user={user}
                status={getStatus(user)}
                index={index}
              />
            ))}
          </div>
          {callList.users.length === 0 && (
            <div className="attendance-btn-area">
              <Button
                text="Mandar notificacion"
                onClick={callNotification}
                className="attendance-btn-notify"
              />
              <Button
                text="Guardar"
                onClick={generateAttendance}
                className="attendance-btn-save"
              />
            </div>
          )}
          {/* {callList.users.length > 0 && (
            <Button
              text="Captura"
              onClick={handleCapture}
              className="attendance-btn-screenshot"
            />
          )} */}
          <div className="attendance-info-area">
            <Legend />
            <div className="attendance-reports">
              <label className="attendance-labels">
                Generar asistencia actual
              </label>
              {/* <Button
                text="Generar"
                onClick={exportDaily}
                className="attendance-btn-report"
              /> */}
              <Button
                text="Vista Previa"
                onClick={handleOpenPreView}
                className="attendance-btn-preview"
              />

              <label className="attendance-labels">
                Generar asistencia por fechas
              </label>
              <div className="attendance-inputs">
                <Input
                  label="Fecha inicio"
                  type="date"
                  onChange={e => setStartDate(e.target.value)}
                  classNameMain="attendace-date-filter"
                  max={_date(today)}
                />
                <Input
                  label="Fecha fin"
                  type="date"
                  onChange={e => setEndDate(e.target.value)}
                  classNameMain="attendace-date-filter"
                  max={_date(today)}
                />
              </div>
              <Button
                text="Generar"
                onClick={exportExcel}
                className="attendance-btn-report"
              />
            </div>
          </div>
        </>
      )}
      {!callList && callLists && callLists?.length > 0 && (
        <div className="attendance-list-empty">
          <h1>Seleccione una Lista</h1>
        </div>
      )}
      <CardViewPdf />
    </div>
  );
};

export default Attendance;
