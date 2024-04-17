import { Subscription } from 'rxjs';
import { Button, CloseIcon, Input, Modal } from '../../../../../../components';
import './cardAddProfession.css';
import { useEffect, useRef, useState } from 'react';
import { isOpenCardProfession$ } from '../../../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Profession } from '../../../../../../types';
import {
  validateWhiteSpace,
  validateOnlyDecimals,
} from '../../../../../../utils';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../../store';
import { getListUsers } from '../../../../../../store/slices/listUsers.slice';

interface CardAddProfessionProps {
  onSave?: (data?: Profession) => void;
}
const CardAddProfession = ({ onSave }: CardAddProfessionProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Profession>();
  const handleIsOpen = useRef<Subscription>(new Subscription());
  useEffect(() => {
    handleIsOpen.current = isOpenCardProfession$.getSubject.subscribe(
      ({ isOpen, data }) => {
        setIsOpen(isOpen);
        if (data) {
          const { abrv, label, value, amount } = data;
          reset({
            abrv,
            label,
            value,
            amount,
          });
        }
      }
    );

    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<Profession> = async ({
    abrv,
    label,
    value,
    amount,
  }) => {
    const body = {
      abrv,
      label,
      amount,
    };
    if (value) {
      await axiosInstance.patch(`/profession/${value}`, body);
      onSave?.();
    } else {
      const res = await axiosInstance.post<Profession>(`/profession`, body);
      dispatch(getListUsers());
      onSave?.(res.data);
    }
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
        <h1>{watch('value') ? 'Editar' : 'Agregar'} Profesión</h1>
        <div className="col-input">
          <Input
            label="Nombre:"
            {...register('label', {
              validate: { validateWhiteSpace },
            })}
            name="label"
            placeholder="Nombre..."
            errors={errors}
            type="text"
          />
          <Input
            label="Abreviatura:"
            {...register('abrv', {
              validate: { validateWhiteSpace },
            })}
            name="abrv"
            placeholder="Abreviatura..."
            errors={errors}
            type="text"
          />
          <Input
            label="Monto:"
            {...register('amount', {
              validate: { validateWhiteSpace, validateOnlyDecimals },
              valueAsNumber: true,
            })}
            name="amount"
            placeholder="Monto..."
            errors={errors}
          />
        </div>

        <Button
          text={watch('value') ? 'GUARDAR' : 'CREAR'}
          type="submit"
          styleButton={4}
        />
      </form>
    </Modal>
  );
};

export default CardAddProfession;
