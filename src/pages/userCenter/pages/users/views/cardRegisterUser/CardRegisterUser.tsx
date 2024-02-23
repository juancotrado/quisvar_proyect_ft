/* eslint-disable react-hooks/exhaustive-deps */
import './CardRegisterUser.css';
import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { isOpenCardRegisterUser$ } from '../../../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserForm, GeneralFile, RoleForm } from '../../../../../../types';
import {
  validateEmail,
  validateWhiteSpace,
  capitalizeText,
  SnackbarUtilities,
  validateDNI,
  validateOnlyNumbers,
  validateRuc,
} from '../../../../../../utils';
import { Button, Input, Modal, Select } from '../../../../../../components';
import { Subscription } from 'rxjs';
import { useJurisdiction, useValidatePassword } from '../../../../../../hooks';
import { DEGREE_DATA, INITIAL_VALUES_USER, JOB_DATA } from '../../models';
import { CarRegisterSwornDeclaration } from '..';

interface CardRegisterUserProps {
  onSave?: () => void;
  generalFiles: GeneralFile[] | null;
}

const CardRegisterUser = ({ onSave, generalFiles }: CardRegisterUserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState<RoleForm[] | null>(null);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: INITIAL_VALUES_USER,
  });
  const { errorPassword, verifyPasswords } = useValidatePassword(
    watch('password')
  );
  const {
    departaments,
    districts,
    provinces,
    handleGetDistricts,
    handleGetProvinces,
    setJurisdictionSelectData,
  } = useJurisdiction();

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisterUser$.getSubject.subscribe(
      data => {
        const { isOpen, user, roles } = data;
        setRoles(roles);
        setIsOpen(isOpen);
        if (user?.id) {
          console.log(user);
          const { profile, id, email, address, ruc, roleId } = user;
          console.log(user);
          const { department, province, district } = profile;
          setJurisdictionSelectData(department, province);
          reset({
            id,
            email,
            address,
            ruc,
            department,
            province,
            district,
            dni: profile.dni,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            degree: profile.degree,
            job: profile.job,
            addressRef: profile.addressRef,
            firstNameRef: profile.firstNameRef,
            lastNameRef: profile.lastNameRef,
            room: profile.room,
            userPc: profile.userPc,
            roleId,
            phoneRef: profile.phoneRef,
          });
        } else {
          reset(INITIAL_VALUES_USER);
        }
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const onSubmit: SubmitHandler<UserForm> = async data => {
    const { cv, declaration, id, ...newData } = data;
    console.log(newData);
    if (id) {
      axiosInstance.put(`/profile/${id}`, data).then(successfulShipment);
    } else {
      const fileCv = cv?.[0] as File;
      const fileDeclaration = declaration?.[0] as File;
      const formData = new FormData();
      for (const [key, value] of Object.entries(newData)) {
        formData.append(key, String(value));
      }
      formData.append('fileUserCv', fileCv);
      formData.append('fileUserDeclaration', fileDeclaration);

      axiosInstance.post(`/users`, formData).then(successfulShipment);
    }
  };

  const searchUserForDNI = () => {
    const { dni } = watch();
    if (dni.length !== 8)
      return SnackbarUtilities.warning(
        'Asegurese de escribir los 8 digitos del DNI'
      );
    axiosInstance
      .get(
        `https://apiperu.dev/api/dni/${dni}?api_token=9a12c65ca41f46f89a08a564be455a611d07d54069b3454766309d35bcc35511`
      )
      .then(res => {
        if (!res.data.success) return SnackbarUtilities.error(res.data.message);
        const { apellido_paterno, apellido_materno, nombres } = res.data.data;
        reset({
          firstName: capitalizeText(nombres),
          lastName: `${capitalizeText(apellido_paterno)} ${capitalizeText(
            apellido_materno
          )}`,
        });
      });
  };
  const successfulShipment = () => {
    onSave?.();
    closeFunctions();
  };

  const closeFunctions = () => {
    setIsOpen(false);
    reset();
  };

  const userData = watch();
  const { id: userId } = userData;

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register">
        <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
          <span className="close-icon" onClick={closeFunctions}>
            <img src="/svg/close.svg" alt="pencil" />
          </span>
          <h1>
            {userId ? 'EDITAR DATOS DE USUARIO' : 'REGISTRO DE NUEVO USUARIO'}
          </h1>
          <h3 className="card-register-title-info">Datos de Personales:</h3>

          <div className="card-register-content">
            <div className="col-input">
              <Input
                {...register('dni', {
                  required: true,
                  validate: validateDNI,
                })}
                placeholder="N°"
                label="DNI"
                errors={errors}
                type="number"
                handleSearch={searchUserForDNI}
              />
              <Input
                {...register('firstName', { required: true })}
                placeholder="Nombres"
                label="Nombres:"
                errors={errors}
              />
              <Input
                {...register('lastName', { required: true })}
                placeholder="Apellidos"
                errors={errors}
                label="Apellidos:"
                autoComplete="on"
              />
            </div>
            {!userId && (
              <div className="col-input">
                <Input
                  {...register('password', {
                    required: true,
                  })}
                  errors={errors}
                  placeholder="Contraseña"
                  type="password"
                  autoComplete="new-password"
                  label="Contraseña:"
                />
                <Input
                  errors={errorPassword}
                  name="verifyPassword"
                  onBlur={verifyPasswords}
                  placeholder="Confirmar contraseña"
                  type="password"
                  autoComplete="new-password"
                  label="Confirmar contraseña:"
                />
              </div>
            )}
            <div className="col-input">
              <Input
                {...register('email', {
                  required: true,
                  validate: validateEmail,
                })}
                errors={errors}
                placeholder="Correo"
                label="Correo:"
                name="email"
              />
              <Input
                {...register('address', { required: true })}
                name="address"
                placeholder="Dirección"
                label="Dirección:"
                errors={errors}
              />
              <Input
                {...register('phone', {
                  validate: validateOnlyNumbers,
                })}
                placeholder="Celular"
                label="Celular:"
                type="number"
                errors={errors}
              />

              <Input
                {...register('room')}
                placeholder="Cuarto:"
                label="Cuarto:"
                type="text"
              />
            </div>
            <div className="col-input">
              <Select
                label="Departamento:"
                {...register('department', {
                  validate: { validateWhiteSpace },
                })}
                name="department"
                data={departaments}
                itemKey="nombre_ubigeo"
                textField="nombre_ubigeo"
                onChange={handleGetProvinces}
                errors={errors}
              />
              <Select
                label="Provincia:"
                {...register('province', {
                  validate: { validateWhiteSpace },
                })}
                name="province"
                data={provinces}
                itemKey="nombre_ubigeo"
                onChange={handleGetDistricts}
                textField="nombre_ubigeo"
                errors={errors}
              />
              <Select
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
              <Input
                {...register('userPc')}
                placeholder="Usuario(00)"
                type="text"
                errors={errors}
                label="Usuario(00):"
              />
            </div>
            <div className="col-input">
              <Select
                label="Profesión:"
                {...register('job', {
                  validate: { validateWhiteSpace },
                })}
                data={JOB_DATA}
                itemKey="value"
                textField="value"
                errors={errors}
              />
              {roles && (
                <Select
                  label="Rol:"
                  {...register('roleId', {
                    validate: { validateWhiteSpace },
                    valueAsNumber: true,
                  })}
                  itemKey="id"
                  textField="name"
                  data={roles}
                  errors={errors}
                />
              )}
              <Select
                label="Grado:"
                {...register('degree', {
                  validate: { validateWhiteSpace },
                })}
                name="degree"
                data={DEGREE_DATA}
                itemKey="value"
                textField="value"
                errors={errors}
              />
              <Input
                {...register('ruc', {
                  validate: { validateRuc },
                })}
                placeholder="ruc"
                type="number"
                errors={errors}
                label="RUC:"
              />
            </div>
            {!userId && (
              <div className="col-input">
                <Input
                  type="file"
                  label="CV:"
                  placeholder="cv"
                  {...register('cv', { required: !!userData })}
                  errors={errors}
                />
                <Input
                  type="file"
                  label="Declaracion Jurada:"
                  placeholder="declaration"
                  {...register('declaration', { required: !!userData })}
                  errors={errors}
                />
              </div>
            )}
          </div>
          <h3 className="card-register-title-info">Datos de Referencia:</h3>
          <div className="card-register-content">
            <div className="col-input">
              <Input
                {...register('firstNameRef')}
                placeholder="Nombres"
                label="Nombres:"
                errors={errors}
              />
              <Input
                {...register('lastNameRef')}
                placeholder="Apellidos"
                errors={errors}
                label="Apellidos:"
              />
            </div>
            <div className="col-input">
              <Input
                {...register('addressRef')}
                placeholder="Dirección"
                label="Dirección:"
                errors={errors}
              />
              <Input
                {...register('phoneRef', {
                  validate: validateOnlyNumbers,
                })}
                placeholder="Celular"
                label="Celular:"
                type="number"
                errors={errors}
              />
            </div>
          </div>
          <div className="btn-build">
            <Button
              text={userId ? 'GUARDAR' : 'CREAR'}
              whileTap={{ scale: 0.9 }}
              styleButton={4}
              type="submit"
            />
          </div>
        </form>
        <CarRegisterSwornDeclaration
          generalFiles={generalFiles}
          userData={userData}
        />
      </div>
    </Modal>
  );
};

export default CardRegisterUser;
