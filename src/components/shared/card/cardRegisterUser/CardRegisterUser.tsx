/* eslint-disable react-hooks/exhaustive-deps */
import './CardRegisterUser.css';
import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenCardRegisterUser$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputText from '../../Input/Input';
import { UserForm, User, WorkStation, Ubigeo } from '../../../../types/types';
import {
  validateEmail,
  validateWhiteSpace,
} from '../../../../utils/customValidatesForm';
import { Input, Select } from '../../..';
import { Subscription } from 'rxjs';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SwornDeclarationPdf from '../../swornDeclarationPdf/SwornDeclarationPdf';
import provincesJson from '../../../../utils/ubigeo/provincias.json';
import distritosJson from '../../../../utils/ubigeo/distritos.json';
import departamentsJson from '../../../../utils/ubigeo/departamentos.json';
import axios from 'axios';
interface CardRegisterUserProps {
  onSave?: () => void;
  onClose?: () => void;
  user?: User | null;
  workStations?: WorkStation[];
}

const InitialValues: UserForm = {
  id: 0,
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  degree: '',
  address: '',
  ruc: '',
  description: '',
  job: '',
  cv: null,
  declaration: null,
  department: '',
  province: '',
  district: '',
};

const CardRegisterUser = ({ user, onSave, onClose }: CardRegisterUserProps) => {
  const [data, setData] = useState<UserForm>(InitialValues);
  const [provinces, setProvinces] = useState<Ubigeo[]>([]);
  const [districts, setDistricts] = useState<Ubigeo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisterUser$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const [errorPassword, setErrorPassword] = useState<{
    [key: string]: { [key: string]: string };
  }>();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: InitialValues,
  });
  useEffect(() => {
    if (user?.id) {
      const { profile, ..._data } = user;
      setData({
        ...profile,
        ..._data,
        cv: null,
        declaration: null,
        department: '',
        district: '',
        province: '',
      });
    } else {
      setData(InitialValues);
    }

    axios
      .get(
        'https://apiperu.dev/api/dni/73188660?api_token=b2bb916986bae680cf5bf44e01b443b70ea845b2640d33aaefde169c48abfe80'
      )
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }, [user]);

  useEffect(() => {
    setValue('id', data.id);
    setValue('email', data.email);
    setValue('password', data.password);
    setValue('dni', data.dni);
    setValue('firstName', data.firstName);
    setValue('lastName', data.lastName);
    setValue('phone', data.phone);
    setValue('job', data.job);
    setValue('degree', data.degree);
    setValue('description', data.description);
    setValue('address', data.address);
    setValue('ruc', data.ruc);
  }, [data]);

  const onSubmit: SubmitHandler<UserForm> = async data => {
    const fileCv = data.cv?.[0] as File;
    const fileDeclaration = data.declaration?.[0] as File;
    const formData = new FormData();
    // const workStationId = stationId;
    formData.append('fileUser', fileCv);
    formData.append('fileUser', fileDeclaration);
    formData.append('id', data.id + '');
    formData.append('degree', data.degree);
    formData.append('description', data.description);
    formData.append('dni', data.dni);
    formData.append('email', data.email);
    formData.append('firstName', data.firstName);
    formData.append('job', data.job);
    formData.append('lastName', data.lastName);
    formData.append('password', data.password);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('ruc', data.ruc);
    if (data.id) {
      axiosInstance.put(`/profile/${data.id}`, data).then(successfulShipment);
    } else {
      const headers = {
        'Content-type': 'multipart/form-data',
      };
      axiosInstance
        .post(`/users?typeFile=cv`, formData, { headers })
        .then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    onSave?.();
    setIsOpen(false);
    reset();
  };

  const closeFunctions = () => {
    setIsOpen(false);
    onClose?.();
    setErrorPassword({});
    reset();
  };

  const verifyPasswords = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const error = {
      verifyPassword: { message: 'Las contraseñas no coinciden' },
    };
    watch('password') !== target.value
      ? setErrorPassword(error)
      : setErrorPassword({});
  };

  const handleGetProvinces = (value: string) => {
    const findDepartament = departamentsJson.find(
      ubigeo => ubigeo.nombre_ubigeo === value
    );
    const idDepartament = findDepartament?.id_ubigeo;
    const provinciasData =
      provincesJson[idDepartament as keyof typeof provincesJson];
    setProvinces(provinciasData);
  };
  const handleGetDistricts = (value: string) => {
    const findProvice = provinces.find(
      ubigeo => ubigeo.nombre_ubigeo === value
    );
    const idProvince = findProvice?.id_ubigeo;
    const districsData =
      distritosJson[idProvince as keyof typeof distritosJson];
    setDistricts(districsData);
  };
  const dataForm = watch();
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>
          {user ? 'EDITAR DATOS DE USUARIO' : 'REGISTRO DE NUEVO USUARIO'}
        </h1>
        <div className="col-input">
          <InputText
            {...register('dni', { required: true, maxLength: 9 })}
            placeholder="N°"
            label="DNI"
            errors={errors}
            type="number"
          />
          <InputText
            {...register('firstName', { required: true })}
            placeholder="Nombres"
            label="Nombres"
            errors={errors}
          />
          <InputText
            {...register('lastName')}
            placeholder="Apellidos"
            errors={errors}
            label="Apellidos"
          />
        </div>
        {!user?.id && (
          <div className="col-input">
            {!user && (
              <InputText
                {...register('password', { required: true })}
                errors={errors}
                placeholder="Contraseña"
                type="password"
                autoComplete="no"
                label="Contraseña"
              />
            )}
            {!user && (
              <InputText
                errors={errorPassword}
                name="verifyPassword"
                onBlur={e => verifyPasswords(e)}
                placeholder="Confirmar contraseña"
                type="password"
                autoComplete="no"
                label="Confirmar contraseña"
              />
            )}
          </div>
        )}
        <div className="col-input">
          <InputText
            {...register('email', {
              required: true,
              validate: validateEmail,
            })}
            errors={errors}
            placeholder="Correo"
            label="Correo"
            name="email"
          />
          <InputText
            {...register('address')}
            placeholder="Dirección"
            label="Dirección"
            errors={errors}
          />
          <InputText
            {...register('phone')}
            placeholder="Celular"
            label="Celular"
            type="number"
            errors={errors}
          />
        </div>
        <div className="col-input">
          <Select
            isRelative
            label="Departamento:"
            {...register('department', {
              validate: { validateWhiteSpace },
            })}
            name="department"
            data={departamentsJson}
            itemKey="nombre_ubigeo"
            textField="nombre_ubigeo"
            onChange={e => handleGetProvinces(e.target.value)}
            errors={errors}
          />
          <Select
            isRelative
            label="Provincia:"
            {...register('province', {
              validate: { validateWhiteSpace },
            })}
            name="province"
            data={provinces}
            itemKey="nombre_ubigeo"
            onChange={e => handleGetDistricts(e.target.value)}
            textField="nombre_ubigeo"
            errors={errors}
          />
          <Select
            isRelative
            label="Distrito:"
            {...register('district', {
              validate: { validateWhiteSpace },
            })}
            name="district"
            data={districts}
            itemKey="nombre_ubigeo"
            textField="nombre_ubigeo"
            errors={errors}
          />
        </div>
        <div className="col-input">
          <InputText
            {...register('job')}
            placeholder="Profesión"
            type="text"
            label="Profesión"
            errors={errors}
          />
          <InputText
            {...register('degree')}
            placeholder="Grado"
            type="text"
            errors={errors}
            label="Grado"
          />
          <InputText
            {...register('description')}
            placeholder="Cargo"
            type="text"
            errors={errors}
            label="Cargo"
          />
          <InputText
            {...register('ruc')}
            placeholder="ruc"
            type="text"
            errors={errors}
            label="ruc"
          />
        </div>
        {/* <div className="col-station-area">
          <label className="input-label">Asignar equipo</label>
          <div className="user-station-list">
            {workStations &&
              workStations.map(workStation => {
                const [name, number] = workStation.name.split(' ');
                const slot = workStation.total - workStation.equipment.length;
                return (
                  <div className="user-station-pc" key={workStation.id}>
                    <h3>{name[0] + '-' + number}</h3>
                    <span
                      className="user-station"
                      onClick={() =>
                        setStationId(slot > 0 ? workStation.id : undefined)
                      }
                    >
                      <img src="/svg/pc-icon.svg" className="ule-icon-size" />
                      {slot}
                    </span>
                  </div>
                );
              })}
          </div>
        </div> */}
        {!user?.id && (
          <>
            <div className="col-input">
              <Input
                type="file"
                label="CV"
                placeholder="cv"
                {...register('cv', { required: !!user?.id })}
                errors={errors}
              />
              <Input
                type="file"
                label="Declaracion Jurada"
                placeholder="declaration"
                {...register('declaration', { required: !!user?.id })}
                errors={errors}
              />
              <PDFDownloadLink
                document={<SwornDeclarationPdf data={dataForm} />}
                fileName={`Declaracion-Jurada.pdf`}
                className="generateOrderService-preview-pdf"
              >
                <figure className="cardRegisteVoucher-figure">
                  <img src={`/svg/preview-pdf.svg`} />
                </figure>
                Declaracion Jurada
              </PDFDownloadLink>
            </div>
          </>
        )}
        <div className="btn-build">
          <Button
            text={user ? 'GUARDAR' : 'CREAR'}
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardRegisterUser;
