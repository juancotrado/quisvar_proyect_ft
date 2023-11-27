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
import {
  AttendanceRange,
  ListAttendance,
  User,
  getLicenses,
} from '../../types/types';
import { SocketContext } from '../../context/SocketContex';
import { generateReportRange } from './GenerateReportRange';
// import { generateReportDaily } from './GenerateReportDaily';
// import html2canvas from 'html2canvas';
import { isOpenCardViewPdf$ } from '../../services/sharingSubject';
import { generateReportDaily } from './GenerateReportDaily';
import { SnackbarUtilities } from '../../utils/SnackbarManager';
interface sendItemsProps {
  usersId: number;
  status: string;
}

const llamados = [
  { title: 'primer llamado' },
  { title: 'segundo llamado' },
  { title: 'tercer llamado' },
  { title: 'cuarto llamado' },
  { title: 'quinto llamado' },
  { title: 'sexto llamado' },
  { title: 'sétimo llamado' },
];
interface RangeDate {
  startDate: string;
  endDate: string;
}
const today = new Date();
const Attendance = () => {
  const [sendItems, setSendItems] = useState<sendItemsProps[]>([]);
  const [callLists, setCallLists] = useState<ListAttendance[] | null>(null);
  const [callList, setCallList] = useState<ListAttendance | null>(null);
  const [date, setDate] = useState(_date(today));
  const [license, setLicense] = useState<getLicenses[]>([]);
  const [rangeDate, setRangeDate] = useState<RangeDate>({
    startDate: '',
    endDate: '',
  });

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
  useEffect(() => {
    verifyLicenses();
    getTodayData();
    deleteLists();
    getLicenses();
  }, []);
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

  const filterUsers = useMemo(() => {
    const callListUserIds = callList?.users.map(user => user.usersId);
    return callList?.users.length
      ? users?.filter(user => callListUserIds?.includes(user.id))
      : users?.filter(user => user.status === true);
  }, [callList?.users, users]);
  const getTodayData = async () => {
    const res = await axiosInstance.get(
      `/list/attendance/?startDate=${_date(today)}`
    );
    setCallLists(res.data);
    return res.data;
  };
  const verifyLicenses = () => {
    axiosInstance.post('/license/expired');
  };
  // borrar listas de ayer que no tengan asuarios
  const deleteLists = async () => {
    const res = await axiosInstance.delete('/list');
    return res.data;
  };
  const generateAttendance = () => {
    if (sendItems.length !== users?.length) {
      return SnackbarUtilities.error('Upps, te olvidaste de alguien');
    }
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
  const getLicenses = () => {
    axiosInstance.get(`/license`).then(res => {
      setLicense(res.data);
      const listItems = res.data.map((item: getLicenses) => ({
        ...item,
        status: 'PERMISO',
      }));
      setSendItems(listItems);
    });
  };
  const callNotification = () => {
    socket.emit('client:call-notification');
  };
  const addCall = async () => {
    const hours = today.getHours().toString().padStart(2, '0');
    const min = today.getMinutes().toString().padStart(2, '0');
    const hour = `${hours}:${min}`;
    const res = await axiosInstance.get(
      `/list/attendance/?startDate=${_date(today)}`
    );
    if (!(llamados.length > res.data.length)) return;
    const title = llamados[res.data.length];
    axiosInstance.post(`/list`, { ...title, timer: hour }).then(async () => {
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
  const genarteReportRange = async (type: 'pdf' | 'excel') => {
    const { endDate, startDate } = rangeDate;
    if (!endDate && !startDate) {
      return SnackbarUtilities.error('Ingresar rangos de fecha');
    }
    const response = await axiosInstance.get(
      `/list/attendance/range/?startDate=${startDate}&endDate=${endDate}`
    );
    const newData: AttendanceRange[] = response.data;
    if (type === 'pdf') {
      isOpenCardViewPdf$.setSubject = {
        isOpen: true,
        data: newData,
        rangeDate: {
          startDate,
          endDate,
        },
        typeReport: 'range',
      };
      return;
    }
    generateReportRange({
      startDate,
      endDate,
      printData: newData,
    });
  };

  const genarteReportDaily = async (type: 'pdf' | 'excel') => {
    const response = await axiosInstance.get(
      `/list/attendance/range/?startDate=${date}&endDate=${date}`
    );
    const newData: AttendanceRange[] = response.data;
    if (!newData[0].list.length) {
      return SnackbarUtilities.error('Datos no guardados');
    }
    if (type === 'pdf') {
      isOpenCardViewPdf$.setSubject = {
        isOpen: true,
        data: newData,
        daily: date,
        typeReport: 'daily',
      };
      return;
    }
    generateReportDaily({
      startDate: date,
      printData: newData,
    });
  };

  const handleRangeData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRangeDate({ ...rangeDate, [name]: value });
  };
  // console.log(users)
  return (
    <div className="attendance">
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
            <p className="attendance-text">{data.timer}</p>
          </div>
        ))}
        {callLists?.length !== 7 && isCompletCallAttendance && todayVerify && (
          <Button
            onClick={addCall}
            className="attendance-add-btn"
            // icon="plus"
            text="Añadir Nueva Lista"
          />
        )}
      </span>
      {callList && (
        <div className="attendance-card-container-main">
          <div className="attendance-card-container-list">
            {callList.users.length === 0 && (
              <div className="attendance-btn-area">
                <Button
                  text="Mandar notificación"
                  onClick={callNotification}
                  className="attendance-btn-notify"
                />
                <Button
                  text="Guardar Lista"
                  onClick={generateAttendance}
                  className="attendance-btn-save"
                />
              </div>
            )}
            <div className="attendance-card-container" ref={componentRef}>
              <div className="attendance-header">
                <div className="attendance-list-text">ITEM</div>
                <div className="attendance-list-text">CUARTOS</div>
                <div className="attendance-list-text">APELLIDO Y NOMBRE</div>
                <div className="attendance-list-text">DNI</div>
                <div className="attendance-list-text">CELULAR</div>
                <div className="attendance-list-text">EQUIPO</div>
                <div className="attendance-list-text">USUARIO</div>
                <div className="attendance-list-text attendance-config head-p">
                  P
                </div>
                <div className="attendance-list-text attendance-config head-t">
                  T
                </div>
                <div className="attendance-list-text attendance-config head-f">
                  F
                </div>
                <div className="attendance-list-text attendance-config head-g">
                  G
                </div>
                <div className="attendance-list-text attendance-config head-m">
                  M
                </div>
                <div className="attendance-list-text attendance-config head-l">
                  L
                </div>
              </div>
              {filterUsers?.map((user, index) => (
                <AttendanceList
                  key={user.id}
                  onRadioChange={(e, v) => {
                    // console.log(e, v);
                    handleRadioChange(e, v);
                  }}
                  user={user}
                  status={getStatus(user)}
                  index={index}
                  list={license}
                />
              ))}
            </div>
          </div>
          <div className="attendance-info-area">
            <Legend />
            <div className="attendance-report-container">
              <div className="attendance-reports">
                <label className="attendance-labels">
                  Generar asistencia actual
                </label>
                <div className="attendace-btns">
                  <Button
                    icon="report-pdf-icon"
                    text="Vista Previa"
                    onClick={() => genarteReportDaily('pdf')}
                    className="attendance-btn-link"
                    imageStyle="attendance-btn-link-image"
                  />
                  <Button
                    text="Descargar Excel"
                    icon="report-excel-icon"
                    onClick={() => genarteReportDaily('excel')}
                    className="attendance-btn-link"
                    imageStyle="attendance-btn-link-image"
                  />
                </div>
              </div>
              <div className="attendance-reports">
                <label className="attendance-labels">
                  Reporte de asistencia
                </label>
                <div className="attendace-btns">
                  <Input
                    label="Fecha inicio"
                    type="date"
                    name="startDate"
                    onChange={handleRangeData}
                    classNameMain="attendace-date-filter"
                    max={_date(today)}
                    required
                  />
                  <Input
                    label="Fecha fin"
                    type="date"
                    name="endDate"
                    onChange={handleRangeData}
                    classNameMain="attendace-date-filter"
                    max={_date(today)}
                    required
                  />
                </div>
                <div className="attendace-btns">
                  <Button
                    text="Vista Previa"
                    onClick={() => genarteReportRange('pdf')}
                    icon="report-pdf-icon"
                    className="attendance-btn-link"
                    imageStyle="attendance-btn-link-image"
                  />
                  <Button
                    text="Reporte en Excel"
                    onClick={() => genarteReportRange('excel')}
                    icon="report-excel-icon"
                    className="attendance-btn-link"
                    imageStyle="attendance-btn-link-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!callList && callLists && callLists?.length > 0 && (
        <div className="attendance-list-empty">
          <h1>Seleccione una Lista</h1>
        </div>
      )}
      <CardViewPdf />
      {/* <input type='datetime-local' onChange={e=> console.log(e.target.value)}/> */}
    </div>
  );
};

export default Attendance;
