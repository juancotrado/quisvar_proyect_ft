/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from 'framer-motion';
import { axiosInstance } from '../../../../services/axiosInstance';
import './CardRegisterArea.css';
import { useEffect, useState } from 'react';
import { container } from '../../../../animations/animations';
import InputText from '../../Input/Input';
import DropDownSimple from '../../../dropDownSimple/DropDownSimple';
import { WorkAreaForm } from '../../../../types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import useListUsers from '../../../../hooks/useListUsers';

interface CardRegisterAreaProps {
  onSave?: (name: string) => void;
  onClose?: () => void;
  projectId?: number;
  dataWorkArea?: WorkAreaForm | null;
  isUnique?: boolean;
}

type CoordinatorType = {
  id: number;
  name: string;
};

const InitialValues: WorkAreaForm = {
  id: 0,
  name: '',
  userId: 0,
  projectId: 0,
};

const CardRegisterArea = ({
  dataWorkArea,
  onSave,
  projectId,
  onClose,
  isUnique,
}: CardRegisterAreaProps) => {
  const [data, setData] = useState<WorkAreaForm>(InitialValues);
  const [coordinator, setCoordinator] = useState<CoordinatorType>();
  const { handleSubmit, register, setValue } = useForm<WorkAreaForm>();
  const { users } = useListUsers(['MOD', 'ADMIN']);

  useEffect(() => {
    if (dataWorkArea) {
      setData(dataWorkArea);
    }
  }, [dataWorkArea]);

  useEffect(() => {
    setValue('name', data.name);
    setValue('id', data.id);
    setValue('projectId', data.projectId);
    setValue('userId', data.userId);
  }, [data]);

  const onSubmit: SubmitHandler<WorkAreaForm> = values => {
    const userId = coordinator?.id ?? data.userId;
    const workareaData = { ...values, userId, projectId };
    axiosInstance.put(`/workareas/${values.id}`, workareaData).then(() => {
      onSave?.(coordinator ? coordinator.name : handleGetUserById());
      onClose?.();
    });
  };

  const handleGetUserById = () => {
    const findUser = users.find(u => u.id === dataWorkArea?.userId);
    if (findUser) return findUser.name;
    return '';
  };

  return (
    <motion.form
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={container}
      className="card-register-area"
      onSubmit={handleSubmit(onSubmit)}
    >
      <span className="close-icon" onClick={onClose}>
        <img src="/svg/close.svg" alt="pencil" />
      </span>
      {!isUnique && (
        <InputText
          {...register('name')}
          placeholder="nombre"
          className="input-project"
          label="Nombre del área"
        />
      )}
      <DropDownSimple
        label="Coordinador"
        type="search"
        defaultInput={handleGetUserById()}
        className="dropdown-area"
        selector
        data={users}
        textField="name"
        itemKey="id"
        valueInput={(name, id) => setCoordinator({ id: parseInt(id), name })}
      />
      <button className="btn-area">Guardar</button>
    </motion.form>
  );
};

export default CardRegisterArea;
