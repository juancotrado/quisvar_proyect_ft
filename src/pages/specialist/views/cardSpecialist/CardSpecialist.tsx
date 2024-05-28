import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import './cardSpecialist.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Profession, Specialists } from '../../../../types';
import { isOpenCardSpecialist$ } from '../../../../services/sharingSubject';

import {
  Input,
  Button,
  Modal,
  CloseIcon,
  Select,
} from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
import { DEGREE_DATA, TUITION } from '../../../userCenter/pages/users/models';
import {
  validateDNI,
  validateOnlyNumbers,
  validateWhiteSpace,
} from '../../../../utils';
type CardSpecialistProps = {
  onSave?: () => void;
};
const CardSpecialist = ({ onSave }: CardSpecialistProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Specialists | undefined>(undefined);
  const [professions, setProfessions] = useState<Profession[] | null>(null);
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
    getProfession();
    if (data) {
      reset(data);
    } else {
      reset({});
    }
  }, [data, reset]);
  useEffect(() => {
    handleIsOpen.current = isOpenCardSpecialist$.getSubject.subscribe(value => {
      setIsOpen(value.isOpen);
      setData(value.data);
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const getProfession = () => {
    // if (data) setValue('career', data.label);
    axiosInstance.get(`/profession`).then(res => {
      setProfessions(res.data);
    });
  };
  const closeFunctions = () => {
    reset({});
    setIsOpen(false);
    // onSave?.();
  };
  const onSubmit: SubmitHandler<Specialists> = async data => {
    const fileCv = data.cvFile?.[0] as File;
    const fileAgreement = data.agreementFile?.[0] as File;
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
    formData.append('tuition', data.tuition);
    formData.append('email', data.email);
    formData.append('inscription', data.inscription);
    formData.append('inscriptionDate', data.inscriptionDate.toString());
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance.post(`/specialists`, formData, { headers }).then(() => {
      closeFunctions();
      onSave?.();
    });
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
        <CloseIcon onClick={() => closeFunctions()} />
        <h2>Registrar nuevo especialista</h2>

        <div className="specialist-col">
          <Input
            styleInput={4}
            label="Nombres"
            {...register('firstName', { required: true })}
            name="firstName"
            errors={errors}
          />
          <Input
            styleInput={4}
            label="Apellidos"
            {...register('lastName', { required: true })}
            name="lastName"
            errors={errors}
          />
        </div>

        <div className="specialist-col">
          <Input
            styleInput={4}
            label="DNI"
            {...register('dni', { required: true, validate: validateDNI })}
            name="dni"
            errors={errors}
          />
          <Select
            label="Grado:"
            {...register('degree', {
              validate: { validateWhiteSpace },
            })}
            name="degree"
            data={DEGREE_DATA}
            extractValue={({ value }) => value}
            renderTextField={({ value }) => value}
            errors={errors}
          />
          {professions && (
            <Select
              label="Profesión:"
              {...register('career', {
                validate: { validateWhiteSpace },
              })}
              name="career"
              data={professions}
              extractValue={({ label }) => label}
              renderTextField={({ label }) => label}
              errors={errors}
            />
          )}
        </div>
        <div className="specialist-col">
          <Select
            label="Colegiatura"
            {...register('tuition', {
              validate: { validateWhiteSpace },
            })}
            name="tuition"
            data={TUITION}
            extractValue={({ value }) => value}
            renderTextField={({ value }) => value}
            errors={errors}
          />
          <Input
            styleInput={4}
            label="Nº de Inscripcion"
            {...register('inscription', { required: true })}
            name="inscription"
            errors={errors}
          />
          <Input
            styleInput={4}
            label="Fecha de inscripcion"
            {...register('inscriptionDate', { required: true })}
            name="inscriptionDate"
            type="date"
            errors={errors}
          />
        </div>
        <div className="specialist-col">
          {/* <Input styleInput={4} label="Areas de Especialidad" /> */}
          <Input
            styleInput={4}
            label="Celular"
            {...register('phone', {
              required: true,
              validate: validateOnlyNumbers,
            })}
            name="phone"
            minLength={9}
            maxLength={9}
            errors={errors}
          />
          <Input
            styleInput={4}
            label="Correo"
            {...register('email', { required: true })}
            name="email"
            errors={errors}
          />
          {/* <Input styleInput={4}
            label="Tarifa"
            {...register('price')}
            name="price"
            errors={errors}
          /> */}
        </div>
        <div className="specialist-col">
          <Input
            styleInput={4}
            label="Curriculum Vitae"
            type="file"
            {...register('cvFile')}
            name="cvFile"
            errors={errors}
          />
          <Input
            styleInput={4}
            label="Documento de Acuerdo"
            type="file"
            {...register('agreementFile')}
            name="agreementFile"
            errors={errors}
          />
        </div>
        <Button
          text={data ? 'Actualizar' : 'Guardar'}
          type="submit"
          styleButton={4}
        />
      </form>
    </Modal>
  );
};

export default CardSpecialist;
