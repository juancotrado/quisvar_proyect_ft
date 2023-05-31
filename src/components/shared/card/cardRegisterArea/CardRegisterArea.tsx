/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from 'framer-motion';
import { Input, TextArea } from '../../..';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Modal from '../../../portal/Modal';
import Button from '../../button/Button';
import './CardRegisterArea.css';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { container } from '../../../../animations/animations';
import InputText from '../../Input/Input';
import DropDownSimple from '../../select/DropDownSimple';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { WorkAreaForm } from '../../../../types/types';
import { SubmitHandler, useForm } from 'react-hook-form';

interface CardRegisterAreaProps {
  onSave?: () => void;
  onClose?: () => void;
  projectId?: number;
  dataWorkArea?: WorkAreaForm | null;
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
}: CardRegisterAreaProps) => {
  const [data, setData] = useState<WorkAreaForm>(InitialValues);
  const { listUsers } = useSelector((state: RootState) => state);
  const [coordinator, setCoordinator] = useState<CoordinatorType>();
  const { handleSubmit, register, setValue, watch } = useForm<WorkAreaForm>();

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

  const users = useMemo(
    () =>
      listUsers
        ? listUsers
            .map(({ profile, ...props }) => ({
              name: `${profile.firstName} ${profile.lastName}`,
              ...props,
            }))
            .filter(u => u.role !== 'EMPLOYEE')
        : [],
    [listUsers]
  );

  const onSubmit: SubmitHandler<WorkAreaForm> = values => {
    const userId = coordinator?.id;
    console.log({ ...values, userId, projectId });
  };

  // const handleGetUserById = () => {
  //   const findUser = data.userId;
  //   const aw =
  // };

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
      <InputText
        {...register('name')}
        placeholder="nombre"
        className="input-project"
      />
      <DropDownSimple
        defaultInput={''}
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
