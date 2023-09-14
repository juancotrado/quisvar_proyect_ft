import { useMemo, useState } from 'react';
import { AttendanceList } from '../../components';
import './Attendance.css';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import Button from '../../components/shared/button/Button';
interface sendItemsProps {
  id: number;
  details: string;
}
const Attendance = () => {
  const [sendItems, setSendItems] = useState<sendItemsProps[]>([]);
  const { listUsers: users } = useSelector((state: RootState) => state);
  const handleRadioChange = (details: string, id: number) => {
    const findId = sendItems.find(item => item.id === id);
    if (findId) {
      const filterList = sendItems.map(item =>
        item.id === id ? { ...item, details } : item
      );
      setSendItems(filterList);
    } else {
      setSendItems([...sendItems, { id, details }]);
    }
  };

  const filterList = useMemo(
    () => users?.filter(user => user.status === true),
    [users]
  );
  console.log(sendItems);

  return (
    <div className="attendance container">
      <div className="attendance-head">
        <div>
          <h1 className="main-title">
            <span className="main-title-span">Asistencia</span>
          </h1>
        </div>
      </div>
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
      <Button text="Guardar" />
    </div>
  );
};

export default Attendance;
