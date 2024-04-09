import { Subscription } from 'rxjs';
import { Button, CloseIcon, Input, Modal } from '../../../../../../components'
import './cardAddProfession.css'
import { useEffect, useRef, useState } from 'react';
import { isOpenCardProfession$ } from '../../../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Profession } from '../../../../../../types';
import { validateWhiteSpace } from '../../../../../../utils';
import { axiosInstance } from '../../../../../../services/axiosInstance';

interface CardAddProfessionProps {
  onSave?: () => void;

}
const CardAddProfession = ({ onSave }: CardAddProfessionProps) => {
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
    handleIsOpen.current = isOpenCardProfession$.getSubject.subscribe(({ isOpen, data }) => {
      setIsOpen(isOpen);
      if (data) {
        const { abrv, label, value } = data
        reset({
          abrv, label, value
        });
      }
    });

    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<Profession> = async ({ abrv, label, value }) => {
    const body = {
      abrv, label
    }
    let res
    if (value) {
      res = await axiosInstance.patch(`/profession/${value}`, body)
    } else {
      res = await axiosInstance.post(`/profession`, body)
    }
    console.log("res Profesio", res.data)
    onSave?.()
    closeFunctions()
  }
  const closeFunctions = () => {
    setIsOpen(false);
    reset({});
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <CloseIcon onClick={closeFunctions} />
        <h1>Agregar Profesión</h1>
        <div className="col-input">
          <Input
            {...register('label', {
              validate: { validateWhiteSpace },
            })}
            placeholder="Nombre..."
            label="Nombre:"
            errors={errors}
            type="text"
          />
          <Input
            {...register('abrv')}
            placeholder="abrv..."
            label="Abreviatura"
            errors={errors}
            type="text"
          />
        </div>


        <div className="btn-build">
          <Button
            text={watch('value') ? 'GUARDAR' : 'CREAR'}
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
            styleButton={4}
          />
        </div>
      </form>
    </Modal>
  )
}

export default CardAddProfession