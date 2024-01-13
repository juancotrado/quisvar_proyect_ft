import { useState } from 'react';
import {
  Equipment as Equip,
  Option,
  WorkStation,
} from '../../../../types/types';
import './equipment.css';
import Button from '../../../button/Button';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import DotsRight from '../../../shared/dotsRight/DotsRight';
import { axiosInstance } from '../../../../services/axiosInstance';

interface EquipmentProps {
  data: WorkStation;
  onSave?: () => void;
  openCard: (open: boolean, id: number) => void;
  handleEdit: (open: boolean, identifier: number, data: Equip) => void;
  handleEditWS: (open: boolean, data: WorkStation) => void;
}

const Equipment = ({
  data,
  openCard,
  handleEdit,
  handleEditWS,
  onSave,
}: EquipmentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleDelete = (id: number) => {
    axiosInstance.delete(`/equipment/${id}`).then(() => onSave?.());
  };
  const handleDeleteWS = (id: number) => {
    axiosInstance.delete(`/workStation/${id}`).then(() => onSave?.());
  };
  const options: Option[] = [
    {
      name: 'Editar',
      type: 'button',
      icon: 'pencil',
      function: () => handleEditWS(true, data),
    },
    {
      name: 'Eliminar',
      type: 'button',
      icon: 'trash-red',
      function: () => handleDeleteWS(data.id),
    },
  ];
  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>
        <ContextMenuTrigger className="ule-items" id={`ws-${data.id}`}>
          <p className="ule-h3">{data.name}</p>
          <div className="ule-info">
            <p className="ule-h3">P. totales: {data.total}</p>
            <p className="ule-h3">
              P. disponibles: {data.total - data.equipment.length}
            </p>
          </div>
          <div
            className="ule-icon-overlay"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img src="/svg/mdi_question.svg" className="ule-icon-size" />
            {isHovered && (
              <div className="isOn-overlay">
                <p className="isOn-overlay-text">{data.description}</p>
              </div>
            )}
          </div>
          <img src="/svg/ep_arrow-up-bold.svg" className="ule-icon-size" />
        </ContextMenuTrigger>
        <DotsRight data={options} idContext={`ws-${data.id}`} />
      </div>
      {isOpen && (
        <div className="ule-items-area">
          <div className="ule-item-header">
            <h3 className="ule-size">USUARIO</h3>
            <h3 className="ule-size">PERSONAL ASIGNADO</h3>
          </div>
          {data.equipment.map(equipment => {
            const optionsData: Option[] = [
              {
                name: 'Editar',
                type: 'button',
                icon: 'pencil',
                function: () => handleEdit(true, equipment.id, equipment),
              },
              {
                name: 'Eliminar',
                type: 'button',
                icon: 'trash-red',
                function: () => handleDelete(equipment.id),
              },
            ];
            return (
              <div key={equipment.id}>
                <ContextMenuTrigger
                  className="ule-item-body"
                  key={equipment.id}
                  id={`ule-item-${equipment.id}`}
                >
                  <h3 className="ule-size-pc">
                    <img src="/svg/pc-icon.svg" className="ule-icon-size" />
                    {equipment.user?.profile.userPc ?? '---'}
                  </h3>
                  <h3 className="ule-size">
                    {equipment.user?.profile.firstName}{' '}
                    {equipment.user?.profile.lastName}
                  </h3>
                </ContextMenuTrigger>
                <DotsRight
                  data={optionsData}
                  idContext={`ule-item-${equipment.id}`}
                />
              </div>
            );
          })}
          <Button
            icon="pc-icon"
            imageStyle="icon-pc"
            text="Agregar"
            onClick={() => openCard(true, data.id)}
            className="ule-btn-pc"
          />
        </div>
      )}
    </>
  );
};

export default Equipment;
