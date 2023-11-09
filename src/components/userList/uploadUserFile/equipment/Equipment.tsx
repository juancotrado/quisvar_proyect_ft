import { useState } from 'react';
import { WorkStation } from '../../../../types/types';
import './equipment.css';
import Button from '../../../shared/button/Button';

interface Equipment {
  data: WorkStation;
  openCard: (id: number) => void;
}

const Equipment = ({ data, openCard }: Equipment) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className="ule-items" onClick={() => setIsOpen(!isOpen)}>
        <p className="ule-h3">{data.name}</p>
        <div className="ule-info">
          <p className="ule-h3">P. en uso: {data.total}</p>
          <p className="ule-h3">
            P. disponibles: {data.total - data.equipment.length}
          </p>
        </div>
        <img src="/svg/mdi_question.svg" className="ule-icon-size" />
        <img src="/svg/ep_arrow-up-bold.svg" className="ule-icon-size" />
      </div>
      {isOpen && (
        <div className="ule-items-area">
          <div className="ule-item-header">
            <h3 className="ule-size">PANTALLA</h3>
            <h3 className="ule-size">USUARIO</h3>
          </div>
          {data.equipment.map(equipment => (
            <div className="ule-item-body" key={equipment.id}>
              <h3 className="ule-size-pc">
                <img src="/svg/pc-icon.svg" className="ule-icon-size" />
                {equipment.name}
              </h3>
              <h3 className="ule-size">
                {equipment.user?.profile.firstName}{' '}
                {equipment.user?.profile.lastName}
              </h3>
            </div>
          ))}
        </div>
      )}
      <Button
        icon="pc-icon"
        imageStyle="icon-pc"
        text="Agregar"
        onClick={() => openCard(data.id)}
        className="ule-btn-pc"
      />
    </>
  );
};

export default Equipment;
