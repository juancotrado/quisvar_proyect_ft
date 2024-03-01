import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import './cardSpecialist.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Specialists } from '../../../../types';
import { isOpenCardSpecialist$ } from '../../../../services/sharingSubject';
import { Input, Button, Modal, CloseIcon } from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
type CardSpecialistProps = {
  onSave?: () => void;
};
const CardSpecialist = ({ onSave }: CardSpecialistProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<Specialists>();
  useEffect(() => {
    handleIsOpen.current = isOpenCardSpecialist$.getSubject.subscribe(value =>
      setIsOpen(value.isOpen)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const closeFunctions = () => {
    setIsOpen(false);
    reset({});
    onSave?.();
  };
  const onSubmit: SubmitHandler<Specialists> = async data => {
    const fileCv = data.cv?.[0] as File;
    const fileAgreement = data.agreement?.[0] as File;
    const formData = new FormData();
    formData.append('dni', data.dni);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('phone', data.phone);
    formData.append('career', data.career);
    formData.append('degree', data.degree);
    formData.append('fileAgreement', fileAgreement);
    formData.append('fileCv', fileCv);
    formData.append('price', '3000');
    formData.append('CIP', data.CIP);
    formData.append('email', data.email);
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance
      .post(`/specialists`, formData, { headers })
      .then(closeFunctions);
    // const newData = {
    //     dni: data.dni,
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     phone: data.phone,
    //     career: data.career,
    //     degree: data.degree,
    //     agreement: "",
    //     cv: "",
    //     price: data.price,
    // }
    // axiosInstance.post(`/specialists/`, newData).then(closeFunctions);
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-specialist">
        <CloseIcon onClick={closeFunctions} />
        <h1>Registrar nuevo especialista</h1>

        <div className="specialist-col">
          <Input
            label="Nombres"
            placeholder="Nombres"
            {...register('firstName', { required: true })}
            name="firstName"
            errors={errors}
          />
          <Input
            label="Apellidos"
            placeholder="Apellidos"
            {...register('lastName', { required: true })}
            name="lastName"
            errors={errors}
          />
        </div>

        <div className="specialist-col">
          <Input
            label="Profesion"
            placeholder="Profesion"
            {...register('career', { required: true })}
            name="career"
            errors={errors}
          />
          <Input
            label="Grado"
            placeholder="Grado"
            {...register('degree', { required: true })}
            name="degree"
            errors={errors}
          />
          <Input
            label="Colegiatura"
            placeholder="Colegiatura"
            {...register('CIP', { required: true })}
            name="CIP"
            errors={errors}
          />
        </div>
        <div className="specialist-col">
          <Input
            label="DNI"
            placeholder="DNI"
            {...register('dni', { required: true })}
            name="dni"
            errors={errors}
          />
          <Input
            label="Correo"
            placeholder="Correo"
            {...register('email', { required: true })}
            name="email"
            errors={errors}
          />
        </div>
        <div className="specialist-col">
          {/* <Input label="Areas de Especialidad" /> */}
          <Input
            label="Celular"
            placeholder="Celular"
            type="number"
            {...register('phone', { required: true })}
            name="phone"
            errors={errors}
          />
          {/* <Input
            label="Tarifa"
            placeholder="S/. 00.00"
            {...register('price')}
            name="price"
            errors={errors}
          /> */}
        </div>
        <div className="specialist-col">
          <Input
            label="Curriculum Vitae"
            type="file"
            {...register('cv')}
            name="cv"
            errors={errors}
          />
          <Input
            label="Documento de Acuerdo"
            type="file"
            {...register('agreement')}
            name="agreement"
            errors={errors}
          />
        </div>
        <Button text="Guardar" type="submit" />
      </form>
    </Modal>
  );
};

export default CardSpecialist;
