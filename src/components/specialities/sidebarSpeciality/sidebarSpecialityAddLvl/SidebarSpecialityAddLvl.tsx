import { SubmitHandler, useForm } from 'react-hook-form';
import './sidebarSpecialityAddLvl.css';
import { useState } from 'react';
import { Input } from '../../..';
import Button from '../../../shared/button/Button';
import DotsOption, { Option } from '../../../shared/dots/DotsOption';
import { axiosInstance } from '../../../../services/axiosInstance';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../utils/customValidatesForm';

type DataForm = { name: string; cod: string };
interface SidebarSpecialityAddLvlProps {
  idValue: number;
  onSave?: () => void;
  keyNameId: 'sectorId' | 'specialitiesId';
}

const urlPost = {
  sectorId: '/specialities',
  specialitiesId: '/typespecialities',
};
const SidebarSpecialityAddLvl = ({
  onSave,
  keyNameId,
  idValue,
}: SidebarSpecialityAddLvlProps) => {
  const [addLevel, setAddLevel] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<DataForm>();

  const onSubmitData: SubmitHandler<DataForm> = async data => {
    const url = urlPost[keyNameId];
    const newData = { ...data, [keyNameId]: idValue };
    await axiosInstance.post(url, newData);
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
              {...register('name', {
                validate: { validateWhiteSpace, validateCorrectTyping },
              })}
              name="name"
              className="sidebarSpecialityAddLvl-input"
              errors={errors}
            />
            {keyNameId === 'sectorId' && (
              <Input
                label="Nombre Corto:"
                {...register('cod', {
                  validate: { validateWhiteSpace, validateCorrectTyping },
                })}
                name="cod"
                className="sidebarSpecialityAddLvl-input"
                errors={errors}
              />
            )}
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
          <span className="sidebarSpecialityAddLvl-add-span">AÑADIR NIVEL</span>
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
