import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProcedureList } from '../../components';
import './Procedure.css';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import Button from '../../components/shared/button/Button';
const initialItems: sendItemsProps = {
  id: 0,
  details: '',
};
interface sendItemsProps {
  id: number;
  details: string;
}
const Procedure = () => {
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>();
  //   const [form, setForm] = useState<sendItemsProps>(initialItems);
  const [selectedUserId, setSelectedUserId] = useState<number>();
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
    // setSelectedRadioValue(value);
    // setSelectedUserId(id);
  };

  const filterList = useMemo(
    () => users?.filter(user => user.status === true),
    [users]
  );
  console.log(sendItems);

  return (
    <div className="procedure container">
      <div className="procedure-head">
        <div>
          <h1 className="main-title">
            <span className="main-title-span">Trámites</span>
          </h1>
        </div>
      </div>
      <div className="procedure-card-container">
        <div className="procedure-header">
          <div className="procedure-list-text">ITEM</div>
          <div className="procedure-list-text">CUARTOS</div>
          <div className="procedure-list-text">APELLIDO Y NOMBRE</div>
          <div className="procedure-list-text">DNI</div>
          <div className="procedure-list-text">CELULAR</div>
          <div className="procedure-list-text">EQUIPO</div>
          <div className="procedure-list-text">USUARIO</div>
          <div className="procedure-list-text procedure-p">P</div>
          <div className="procedure-list-text procedure-t">T</div>
          <div className="procedure-list-text procedure-f">F</div>
          <div className="procedure-list-text procedure-g">G</div>
          <div className="procedure-list-text procedure-m">M</div>
          <div className="procedure-list-text procedure-l">L</div>
        </div>
        {filterList?.map((user, index) => (
          <ProcedureList
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

export default Procedure;
