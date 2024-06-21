import './CardRegisterUser.css';
import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import {
  isOpenCardOffice$,
  isOpenCardProfession$,
  isOpenCardRegisterUser$,
} from '../../../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  GeneralFile,
  RoleForm,
  Profession,
  Office,
} from '../../../../../../types';
import {
  validateEmail,
  validateWhiteSpace,
  capitalizeText,
  SnackbarUtilities,
  validateDNI,
  validateOnlyNumbers,
  validateRuc,
  validateRepeatPassword,
} from '../../../../../../utils';
import {
  AdvancedSelectCrud,
  Button,
  CloseIcon,
  Input,
  Modal,
  Select,
} from '../../../../../../components';
import { Subscription } from 'rxjs';
import { useJurisdiction } from '../../../../../../hooks';
import { DEGREE_DATA, GENDER, OfficeSelect, UserForm } from '../../models';
import { CarRegisterSwornDeclaration } from '..';
import { CardAddProfession } from '../cardAddProfession';
import { CardAddOffice } from '../cardAddOffice';

interface CardRegisterUserProps {
  onSave?: () => void;
  generalFiles: GeneralFile[] | null;
}

const CardRegisterUser = ({ onSave, generalFiles }: CardRegisterUserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [offices, setOffices] = useState<null | OfficeSelect[]>(null);
  const [roles, setRoles] = useState<RoleForm[] | null>(null);
  const [professions, setProfessions] = useState<Profession[] | null>(null);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<UserForm>();

  const {
    departaments,
    districts,
    provinces,
    handleGetDistricts,
    handleGetProvinces,
    setJurisdictionSelectData,
  } = useJurisdiction();

  useEffect(() => {
    getProfession();
    getOffices();
  }, []);

  const getOffices = () => {
    const url = `/office?includeUsers=false`;
    axiosInstance.get<Office[]>(url).then(res => {
      const offices = res.data.map(el => ({
        value: String(el.id),
        id: el.id,
        label: el.name,
      }));
      setOffices(offices);
    });
  };
  const getProfession = (data?: Profession) => {
    if (data) setValue('job', data);
    axiosInstance.get(`/profession`).then(res => {
      setProfessions(res.data);
    });
  };
  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisterUser$.getSubject.subscribe(
      data => {
        const { isOpen, user, roles } = data;
        setRoles(roles);
        setIsOpen(isOpen);
        const offices = user?.offices.map(({ office }) => ({
          value: String(office.id),
          id: office.id,
          label: office.name,
        }));
        if (user?.id) {
          const { profile, id, email, address, ruc, roleId } = user;
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
            description: profile.description,
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
            gender: profile.gender,
            offices,
          });
        }
      }
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const onSubmit: SubmitHandler<UserForm> = async data => {
    const { cv, declaration, id, offices, ...resData } = data;
    const officeIds = offices.map(office => office.id);
    const newData = { ...resData, job: resData.job.value, officeIds };
    if (id) {
      await axiosInstance.put(`/profile/${id}`, newData);
    } else {
      const fileCv = cv?.[0] as File;
      const fileDeclaration = declaration?.[0] as File;
      const { officeIds, ...body } = newData;
      const formData = new FormData();
      for (const [key, value] of Object.entries(body)) {
        formData.append(key, String(value));
      }
      formData.append('fileUserCv', fileCv);
      formData.append('fileUserDeclaration', fileDeclaration);
      formData.append('officeIds', JSON.stringify(officeIds));
      await axiosInstance.post(`/users`, formData);
    }
    successfulShipment();
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
    reset({ id: null });
  };

  const handleCreateProfession = (label: string) => {
    isOpenCardProfession$.setSubject = {
      isOpen: true,
      data: {
        value: '',
        abrv: '',
        label,
        amount: 0,
      },
    };
  };

  const handleCreateOffice = (label: string) => {
    const body = {
      name: label,
    };
    axiosInstance.post<Office>('/office', body).then(({ data }) => {
      const { offices } = watch();
      setValue('offices', [
        ...(offices ?? []),
        { id: data.id, label: data.name, value: String(data.id) },
      ]);
      getOffices();
    });
  };
  const handleEditProfession = ({ abrv, label, value, amount }: Profession) => {
    isOpenCardProfession$.setSubject = {
      isOpen: true,
      data: {
        abrv,
        label,
        value,
        amount,
      },
    };
  };
  const handleEditOffice = ({ label, id }: OfficeSelect) => {
    isOpenCardOffice$.setSubject = {
      isOpen: true,
      data: {
        id,
        name: label,
      },
    };
  };
  const userData = watch();
  const { id: userId } = userData;

  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register">
        <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
          <CloseIcon onClick={closeFunctions} />
          <h1>
            {userId ? 'EDITAR DATOS DE USUARIO' : 'REGISTRO DE NUEVO USUARIO'}
          </h1>
          <fieldset>
            <legend className="card-register-title-info">
              Datos de Personales
            </legend>
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
                <Select
                  label="Género:"
                  {...register('gender', {
                    validate: { validateWhiteSpace },
                  })}
                  name="gender"
                  data={GENDER}
                  extractValue={({ abrv }) => abrv}
                  renderTextField={({ value }) => value}
                  errors={errors}
                />
              </div>
              {!userId && (
                <div className="col-input">
                  <Input
                    {...register('password', {
                      required: true,
                    })}
                    name="password"
                    errors={errors}
                    placeholder="Contraseña"
                    type="password"
                    autoComplete="new-password"
                    label="Contraseña:"
                  />

                  <Input
                    {...register('confirmPassword', {
                      required: true,
                      validate: val =>
                        validateRepeatPassword(val, watch('password')),
                    })}
                    name="confirmPassword"
                    errors={errors}
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
                    onChange: handleGetProvinces,
                  })}
                  name="department"
                  data={departaments}
                  extractValue={({ nombre_ubigeo }) => nombre_ubigeo}
                  renderTextField={({ nombre_ubigeo }) => nombre_ubigeo}
                  errors={errors}
                />
                <Select
                  label="Provincia:"
                  {...register('province', {
                    validate: { validateWhiteSpace },
                    onChange: handleGetDistricts,
                  })}
                  name="province"
                  data={provinces}
                  extractValue={({ nombre_ubigeo }) => nombre_ubigeo}
                  renderTextField={({ nombre_ubigeo }) => nombre_ubigeo}
                  errors={errors}
                />
                <Select
                  label="Distrito:"
                  {...register('district', {
                    validate: { validateWhiteSpace },
                  })}
                  name="district"
                  data={districts}
                  extractValue={({ nombre_ubigeo }) => nombre_ubigeo}
                  renderTextField={({ nombre_ubigeo }) => nombre_ubigeo}
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
              {offices && (
                <AdvancedSelectCrud
                  defaultValue={watch('offices')}
                  control={control}
                  name="offices"
                  options={offices}
                  errors={errors}
                  styleVariant="primary"
                  label="Oficina:"
                  isMulti
                  onCreateOption={handleCreateOffice}
                  onEditOption={handleEditOffice}
                  onSave={getOffices}
                  urlDelete={'/office'}
                />
              )}
              <div className="col-input">
                {professions && (
                  <AdvancedSelectCrud
                    control={control}
                    name="job"
                    options={professions}
                    errors={errors}
                    styleVariant="primary"
                    label="Profesión:"
                    onCreateOption={handleCreateProfession}
                    onEditOption={handleEditProfession}
                    onSave={getProfession}
                    urlDelete={'/profession'}
                  />
                )}
                {roles && (
                  <Select
                    label="Rol:"
                    {...register('roleId', {
                      validate: { validateWhiteSpace },
                      valueAsNumber: true,
                    })}
                    extractValue={({ id }) => id}
                    renderTextField={({ name }) => name}
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
                  extractValue={({ value }) => value}
                  renderTextField={({ value }) => value}
                  errors={errors}
                />
              </div>
              <div className="col-input">
                <Input
                  {...register('ruc', {
                    validate: { validateRuc },
                  })}
                  placeholder="ruc"
                  type="number"
                  errors={errors}
                  label="RUC:"
                />
                <Input
                  {...register('description', {})}
                  placeholder="cargo"
                  type="text"
                  errors={errors}
                  label="Cargo:"
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
          </fieldset>
          <fieldset>
            <legend className="card-register-title-info">
              Datos de Referencia
            </legend>
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
          </fieldset>
          <div className="btn-build">
            <Button
              text={userId ? 'GUARDAR' : 'CREAR'}
              whileTap={{ scale: 0.9 }}
              styleButton={4}
              type="submit"
            />
          </div>
        </form>
        {roles && (
          <CarRegisterSwornDeclaration
            generalFiles={generalFiles}
            userData={userData}
            roles={roles}
          />
        )}
      </div>
      <CardAddProfession onSave={getProfession} />
      <CardAddOffice onSave={getOffices} />
    </Modal>
  );
};

export default CardRegisterUser;
