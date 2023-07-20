import { SubmitHandler, useForm } from 'react-hook-form';
import './sidebarSpecialityAddLvl.css';
import { useState } from 'react';
import { Input } from '../../..';
import Button from '../../../shared/button/Button';
import DotsOption, { Option } from '../../../shared/dots/DotsOption';
import { axiosInstance } from '../../../../services/axiosInstance';

type DataForm = { name: string; cod: string };
interface SidebarSpecialityAddLvlProps {
  idValue: number;
  onSave?: () => void;
}
const SidebarSpecialityAddLvl = ({
  onSave,
  idValue,
}: SidebarSpecialityAddLvlProps) => {
  const [addLevel, setAddLevel] = useState<boolean>(false);
  const { handleSubmit, register, reset } = useForm<DataForm>();

  const onSubmitData: SubmitHandler<DataForm> = async data => {
    const newData = { ...data, sectorId: idValue };
    await axiosInstance.post('/specialities', newData);
    setAddLevel(false);
    onSave?.();
    reset();
  };
  const optionsData: Option[] = [
    {
      name: 'Cancelar',
      type: 'button',
      icon: 'close',
      function: () => setAddLevel(!addLevel),
    },
    {
      name: 'Guardar',
      type: 'submit',
      icon: 'save',
    },
  ];
  const handleAddlevel = () => setAddLevel(!addLevel);
  return (
    <form
      onSubmit={handleSubmit(onSubmitData)}
      className="sidebarSpecialityAddLvl"
    >
      {addLevel ? (
        <>
          <div className="sidebarSpecialityAddLvl-inputs">
            <Input
              label="Nombre:"
              {...register('name')}
              name="name"
              className="sidebarSpecialityAddLvl-input"
            />
            <Input
              label="Nombre Corto:"
              {...register('cod')}
              name="cod"
              className="sidebarSpecialityAddLvl-input"
            />
          </div>
          <DotsOption
            notPositionRelative
            data={optionsData}
            className="sidebarSpecialityAddLvl-menu-dots-option"
          />
        </>
      ) : (
        <div
          className="sidebarSpecialityAddLvl-add-content"
          onClick={handleAddlevel}
        >
          <span className="sidebarSpecialityAddLvl-add-span">
            AÑADIR ESPECIALIDAD
          </span>
          <Button
            type="button"
            icon={'plus'}
            className="sidebarSpecialityAddLvl-btn"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 1.1 }}
          />
        </div>
      )}
    </form>
  );
};

export default SidebarSpecialityAddLvl;
