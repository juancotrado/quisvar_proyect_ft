import { useMemo, useState } from 'react';
import { AttendanceList } from '../../components';
import './Attendance.css';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import formatDate from '../../utils/formatDate';
interface sendItemsProps {
  usersId: number;
  status: string;
}
const Attendance = () => {
  const [sendItems, setSendItems] = useState<sendItemsProps[]>([]);
  const { listUsers: users } = useSelector((state: RootState) => state);
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

  const filterList = useMemo(
    () => users?.filter(user => user.status === true),
    [users]
  );
  // const zonaHorariaPeru = 'America/Lima';
  //   const formattedDated = new Date().toLocaleString('es-PE', { timeZone: zonaHorariaPeru });
  //   // console.log(formattedDated);
  const generateAttendance = async () => {
    axiosInstance
      .post(`/list/attendance/1`, sendItems)
      .then(res => console.log(res));
  };
  const zonaHorariaPeru = 'America/Lima';
  const fechaActual = new Date().toLocaleString('es-PE', {
    timeZone: zonaHorariaPeru,
  });

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
        <h4>{fechaActual.split(',')[0]}</h4>
        <Button text="primer llamado" />
        <Button text="segundo llamado" />
        <Button text="tercer llamado" />
        <Button text=" + " />
      </span>
      <div className="attendance-card-container">
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
        {filterList?.map((user, index) => (
          <AttendanceList
            key={user.id}
            onRadioChange={handleRadioChange}
            user={user}
            index={index}
          />
        ))}
      </div>
      <div className="attendance-btn-area">
        <Button text="Comenzar" />
        <Button text="Guardar" onClick={generateAttendance} />
      </div>
    </div>
  );
};

export default Attendance;
