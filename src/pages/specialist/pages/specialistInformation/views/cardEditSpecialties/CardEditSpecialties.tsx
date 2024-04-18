import React, { useEffect, useRef, useState } from 'react';
import { Button, CloseIcon, Input, Modal } from '../../../../../../components';
import { validateWhiteSpace } from '../../../../../../utils';
import { AppDispatch } from '../../../../../../store';
import { useDispatch } from 'react-redux';
import { Subscription } from 'rxjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { getListUsers } from '../../../../../../store/slices/listUsers.slice';
import { isOpenCardOffice$ } from '../../../../../../services/sharingSubject';
import { OfficeClass } from '../../../../../../types';

interface CardAddOfficeProps {
  onSave?: () => void;
}

const CardAddOffice = ({ onSave }: CardAddOfficeProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfficeClass>();
  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardOffice$.getSubject.subscribe(
      ({ isOpen, data }) => {
        setIsOpen(isOpen);
        if (data) {
          const { name, id } = data;
          reset({
            name,
            id,
          });
        }
      }
    );

    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const onSubmit: SubmitHandler<OfficeClass> = async ({ name, id }) => {
    const body = {
      name,
    };

    await axiosInstance.put(`/listSpecialties/${id}`, body);
    dispatch(getListUsers());
    onSave?.();
    closeFunctions();
  };

  const closeFunctions = () => {
    setIsOpen(false);
    reset({});
  };

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-users"
        autoComplete="off"
      >
        <CloseIcon onClick={closeFunctions} />
        <h1>Editar Especialista</h1>
        <div className="col-input">
          <Input
            label="Nombre:"
            {...register('name', {
              validate: { validateWhiteSpace },
            })}
            name="name"
            placeholder="Nombre..."
            errors={errors}
            type="text"
          />
        </div>
        <Button text="GUARDAR" type="submit" styleButton={4} />
      </form>
    </Modal>
  );
};

export default CardAddOffice;
