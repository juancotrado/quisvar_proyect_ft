import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Subscription } from 'rxjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import './cardAssing.css';
import { Equipment } from '../../../../types/types';
import Button from '../../button/Button';
import { isOpenCardAssing$ } from '../../../../services/sharingSubject';
import InputText from '../../Input/Input';
import { validateWhiteSpace } from '../../../../utils/customValidatesForm';
import SelectOptions from '../../select/Select';
import useListUsers from '../../../../hooks/useListUsers';

const CardAssign = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasId, setHasId] = useState<number>(0);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const { users } = useListUsers();
  console.log(users);

  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<Equipment>();
  useEffect(() => {
    handleIsOpen.current = isOpenCardAssing$.getSubject.subscribe(value => {
      setIsOpen(value.isOpen);
      setHasId(value.id);
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<Equipment> = async data => {
    const file = data.doc?.[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', data.name);
    formData.append('userId', data.userId.toString());
    formData.append('workStationId', hasId.toString());
    formData.append('description', data.description);
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance
      .post(`/equipment`, formData, { headers })
      .then(successfulShipment);
  };
  const successfulShipment = () => {
    // onSave?.();
    setIsOpen(false);
    reset();
  };
  const closeFunctions = () => {
    setIsOpen(false);
    // onClose?.();
    // setErrorPassword({});
    reset();
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Asignar Ordenador</h1>
        <div className="col-input">
          <InputText
            {...register('name', {
              validate: { validateWhiteSpace },
            })}
            placeholder="000"
            label="Remoto"
            errors={errors}
          />
        </div>
        <div className="col-input">
          <InputText
            {...register('description', {
              validate: { validateWhiteSpace },
            })}
            label="Descripcion"
            errors={errors}
          />
        </div>
        <div className="col-input">
          <InputText
            {...register('doc')}
            placeholder=""
            errors={errors}
            label="Documento"
            type="file"
          />
        </div>

        <SelectOptions
          data={users}
          textField="name"
          itemKey="id"
          {...register('userId')}
        />
        <div className="btn-build">
          <Button
            // text={user ? 'GUARDAR' : 'CREAR'}
            text="Crear"
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardAssign;
