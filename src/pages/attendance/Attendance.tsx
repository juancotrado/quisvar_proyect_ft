import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, CloseIcon } from '../../components';
import './Attendance.css';
import { axiosInstance } from '../../services/axiosInstance';
import { _date, SnackbarUtilities } from '../../utils';
import {
  AttendanceRange,
  ListAttendance,
  User,
  getLicenses,
} from '../../types';
import { SocketContext } from '../../context';
import { isOpenCardViewPdf$ } from '../../services/sharingSubject';
import { generateReportDaily, generateReportRange } from './excelGenerator';
import { AttendanceList, CardViewPdf, Legend } from './components';
import { CALLS } from './models';
import { RootState } from '../../store';
import { Navbar } from '../../components/navbar';
interface sendItemsProps {
  usersId: number;
  status: string;
}

interface RangeDate {
  startDate: string;
  endDate: string;
}
const today = new Date();
export const Attendance = () => {
  const [sendItems, setSendItems] = useState<sendItemsProps[]>([]);
  const [callLists, setCallLists] = useState<ListAttendance[] | null>(null);
  const [callList, setCallList] = useState<ListAttendance | null>(null);
  const [date, setDate] = useState(_date(today));
  const [license, setLicense] = useState<getLicenses[]>([]);
  const [rangeDate, setRangeDate] = useState<RangeDate>({
    startDate: '',
    endDate: '',
  });

  const users = useSelector((state: RootState) => state.listUsers);

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
      ? users?.filter(
          user => callListUserIds?.includes(user.id) && user.status === true
        )
      : users?.filter(user => user.status === true);
  }, [callList?.users, users]);
  const getTodayData = async () => {
    const res = await axiosInstance.get(
      `/list/attendance/?startDate=${_date(today)}`
    );
    setCallLists(res.data);
    return res.data;
  };
  const verifyLicenses = async () => {
    await axiosInstance.post('/license/expired');
  };
  // borrar listas de ayer que no tengan asuarios
  const deleteLists = async () => {
    const res = await axiosInstance.delete('/list');
    return res.data;
  };
  const generateAttendance = () => {
    // if (sendItems.length !== users?.length) {
    //   return SnackbarUtilities.error('Upps, te olvidaste de alguien');
    // }
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
      setLicense(res.data.licenses);

      setSendItems(res.data.mainData);
    });
  };
  const callNotification = () => {
    socket.emit('client:call-notification');
  };
  const addCall = async () => {
    await axiosInstance.get('/license/active');
    verifyLicenses();
    getLicenses();
    const todayNow = new Date();
    const hours = todayNow.getHours().toString().padStart(2, '0');
    const min = todayNow.getMinutes().toString().padStart(2, '0');
    const hour = `${hours}:${min}`;
    const res = await axiosInstance.get(
      `/list/attendance/?startDate=${_date(todayNow)}`
    );
    if (!(CALLS.length > res.data.length)) return;
    const title = CALLS[res.data.length];
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
    // if (sendItems.length !== users?.length) {
    //   return SnackbarUtilities.error('Upps, No guardaste la lista');
    // }
    const response = await axiosInstance.get(
      `/list/attendance/range/?startDate=${date}&endDate=${date}`
    );
    const newData: AttendanceRange[] = response.data;
    // if (!newData[0].list.length) {
    //   return SnackbarUtilities.error('Datos no guardados');
    // }
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
  const deleteLastList = async () => {
    await deleteLists();
    await getTodayData();
    setCallList(null);
  };
  // console.log(callLists)
  return (
    <div className="attendance">
      <Navbar title="asistencia" />
      <div className="attendance-content">
        <span className="attendance-date">
          <img
            src="/svg/calendary-icon.svg"
            alt=""
            className="attendance-icon"
          />
          <Input
            type="date"
            onChange={getDate}
            classNameMain="attendace-date-filter"
            max={_date(today)}
            defaultValue={_date(today)}
          />
          <div className="attendance-call-container">
            {callLists?.map(data => (
              <div
                className="attendance-call-status"
                onClick={() => {
                  showAttendanceUsers(data);
                }}
                key={data.id}
              >
                {!data?.users.length && (
                  <CloseIcon
                    onClick={deleteLastList}
                    className="attendance-icon-close"
                  />
                )}
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
            {callLists?.length !== 22 &&
              isCompletCallAttendance &&
              todayVerify && (
                <Button
                  onClick={addCall}
                  className="attendance-add-btn"
                  // icon="plus"
                  text="Añadir Nueva Lista"
                  variant="outline"
                />
              )}
          </div>
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
                  <Button text="Guardar Lista" onClick={generateAttendance} />
                </div>
              )}
              <div className="attendance-card-container" ref={componentRef}>
                <div className="attendance-header">
                  <div className="attendance-list-text hide-field">ITEM</div>
                  <div className="attendance-list-text hide-field">CUARTOS</div>
                  <div className="attendance-list-text">APELLIDO Y NOMBRE</div>
                  <div className="attendance-list-text hide-field">DNI</div>
                  <div className="attendance-list-text hide-field">CELULAR</div>
                  <div className="attendance-list-text hide-field">EQUIPO</div>
                  <div className="attendance-list-text hide-field">USUARIO</div>
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
                  <div className="attendance-list-text attendance-config head-l">
                    S
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
                      color="secondary"
                      disabled={callLists?.[0].users.length === 0}
                      variant="outline"
                      full
                    />

                    <Button
                      text="Descargar Excel"
                      icon="report-excel-icon"
                      onClick={() => genarteReportDaily('excel')}
                      color="secondary"
                      variant="outline"
                      full
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
                      color="secondary"
                      variant="outline"
                      borderRadius={3}
                      full
                    />
                    <Button
                      text="Reporte en Excel"
                      onClick={() => genarteReportRange('excel')}
                      icon="report-excel-icon"
                      color="secondary"
                      variant="outline"
                      borderRadius={3}
                      full
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
      </div>

      {/* <input type='datetime-local' onChange={e=> console.log(e.target.value)}/> */}
    </div>
  );
};
