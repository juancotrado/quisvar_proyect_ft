import { SubmitHandler, useForm } from 'react-hook-form';
import './sidebarSpecialityAddLvl.css';
import { MouseEvent, useState } from 'react';
import { Input } from '../../..';
import Button from '../../../shared/button/Button';
import DotsOption, { Option } from '../../../shared/dots/DotsOption';
import { axiosInstance } from '../../../../services/axiosInstance';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../utils/customValidatesForm';
import { isOpenCardRegisteProject$ } from '../../../../services/sharingSubject';
import colors from '../../../../utils/json/colorSidebar.json';

type DataForm = { name: string; cod: string };
interface SidebarSpecialityAddLvlProps {
  idValue: number;
  onSave?: () => void;
  keyNameId: 'sectorId' | 'specialitiesId' | 'typespecialityId' | 'noId';
  nameLevel?: string;
}

const urlPost = {
  sectorId: '/specialities',
  specialitiesId: '/typespecialities',
  typespecialityId: '',
  noId: '/sector',
};
const SidebarSpecialityAddLvl = ({
  onSave,
  keyNameId,
  idValue,
  nameLevel = 'Añadir Nivel',
}: SidebarSpecialityAddLvlProps) => {
  const [addLevel, setAddLevel] = useState<boolean>(false);
  const [isClickRight, setIsClickRight] = useState(false);
  const handleClickRigth = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsClickRight(!isClickRight);
  };
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
  const handleAddlevel = () => {
    console.log({ keyNameId });
    if (keyNameId === 'typespecialityId') {
      isOpenCardRegisteProject$.setSubject = {
        isOpen: true,
        typeSpecialityId: idValue,
      };
      return;
    }
    setAddLevel(!addLevel);
  };
  const type =
    keyNameId === 'sectorId'
      ? 'specialities'
      : keyNameId === 'specialitiesId'
      ? 'typespecialities'
      : keyNameId === 'typespecialityId'
      ? 'projects'
      : 'sector';

  const style = {
    borderLeft: `thick solid ${colors[type]}`,
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitData)}
      className="sidebarSpecialityAddLvl"
      style={style}
    >
      {addLevel ? (
        <>
          <div
            className="sidebarSpecialityAddLvl-inputs"
            onContextMenu={handleClickRigth}
          >
            <Input
              label="Nombres:"
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
            isClickRight={isClickRight}
            data={optionsData}
            className="sidebarSpecialityAddLvl-menu-dots-option"
          />
        </>
      ) : (
        <div
          className="sidebarSpecialityAddLvl-add-content"
          onClick={handleAddlevel}
        >
          <span className="sidebarSpecialityAddLvl-add-span">{nameLevel}</span>
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
