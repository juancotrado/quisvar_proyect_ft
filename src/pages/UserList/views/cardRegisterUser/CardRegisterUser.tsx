/* eslint-disable react-hooks/exhaustive-deps */
import './CardRegisterUser.css';
import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenCardRegisterUser$ } from '../../../../services/sharingSubject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserForm, User, WorkStation, GeneralFile } from '../../../../types';
import {
  validateEmail,
  validateWhiteSpace,
  capitalizeText,
  deleteExtension,
  SnackbarUtilities,
  getListByRole,
} from '../../../../utils';
import { Button, Input, Modal, Select } from '../../../../components';
import { Subscription } from 'rxjs';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useJurisdiction } from '../../../../hooks';
import { JOB_DATA } from '../../models';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SwornDeclarationPdf } from '../../pdfGenerator';

interface CardRegisterUserProps {
  onSave?: () => void;
  onClose?: () => void;
  user?: User | null;
  workStations?: WorkStation[];
  generalFiles: GeneralFile[] | null;
}
const degreeData = [
  { id: 1, value: 'Egresado' },
  { id: 2, value: 'Bachiller' },
  { id: 3, value: 'Titulado' },
  { id: 4, value: 'Magister' },
  { id: 5, value: 'Doctorado' },
];

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
  job: '',
  cv: null,
  declaration: null,
  department: '',
  province: '',
  declarations: [],
  district: '',
  typeDeclaration: 'technical',
  firstNameRef: '',
  lastNameRef: '',
  phoneRef: '',
  addressRef: '',
  role: '',
  room: '',
  userPc: '',
  declarationDate: '',
};

const CardRegisterUser = ({
  user,
  onSave,
  onClose,
  generalFiles,
}: CardRegisterUserProps) => {
  const [errorPassword, setErrorPassword] = useState<{ [key: string]: any }>();
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const { userSession } = useSelector((state: RootState) => state);

  const {
    departaments,
    districts,
    provinces,
    handleGetDistricts,
    handleGetProvinces,
    setJurisdictionSelectData,
  } = useJurisdiction();

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisterUser$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: InitialValues,
  });

  useEffect(() => {
    if (user?.id) {
      const { profile, id, email, address, ruc } = user;
      const {
        dni,
        firstName,
        lastName,
        phone,
        degree,
        job,
        department,
        district,
        province,
        addressRef,
        firstNameRef,
        lastNameRef,
        phoneRef,
        room,
        userPc,
      } = profile;
      setJurisdictionSelectData(department, province);
      reset({
        id,
        email,
        dni,
        firstName,
        lastName,
        phone,
        degree,
        job,
        address,
        ruc,
        department,
        province,
        district,
        declarations: [],
        addressRef,
        firstNameRef,
        lastNameRef,
        room,
        userPc,
        phoneRef,
      });
    } else {
      reset(InitialValues);
    }
  }, [user]);
  const onSubmit: SubmitHandler<UserForm> = async data => {
    const { cv, declaration, declarations, id, typeDeclaration, ...newData } =
      data;
    if (id) {
      axiosInstance.put(`/profile/${data.id}`, data).then(successfulShipment);
    } else {
      const fileCv = cv?.[0] as File;
      const fileDeclaration = declaration?.[0] as File;
      const formData = new FormData();
      for (const [key, value] of Object.entries(newData)) {
        formData.append(key, String(value));
      }
      formData.append('fileUserCv', fileCv);
      formData.append('fileUserDeclaration', fileDeclaration);
      const headers = {
        'Content-type': 'multipart/form-data',
      };
      axiosInstance
        .post(`/users`, formData, { headers })
        .then(successfulShipment);
    }
  };

  const searchUserForDNI = () => {
    const dni = watch('dni');
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
          declarations: [],
        });
      });
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

  const dataForm = watch();
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <div className="card-register">
        <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
          <span className="close-icon" onClick={closeFunctions}>
            <img src="/svg/close.svg" alt="pencil" />
          </span>
          <h1>
            {user ? 'EDITAR DATOS DE USUARIO' : 'REGISTRO DE NUEVO USUARIO'}
          </h1>
          <h3 className="card-register-title-info">Datos de Personales:</h3>

          <div className="card-register-content">
            <div className="col-input">
              <Input
                {...register('dni', {
                  required: true,
                  maxLength: {
                    value: 9,
                    message: 'Asegurese de escribir los 8 digitos del DNI',
                  },
                  minLength: {
                    value: 8,
                    message: 'Asegurese de escribir los 8 digitos del DNI',
                  },
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
                label="Nombres"
                errors={errors}
              />
              <Input
                {...register('lastName')}
                placeholder="Apellidos"
                errors={errors}
                label="Apellidos"
              />
            </div>
            {!user?.id && (
              <div className="col-input">
                {!user && (
                  <Input
                    {...register('password', { required: true })}
                    errors={errors}
                    placeholder="Contraseña"
                    type="password"
                    autoComplete="no"
                    label="Contraseña"
                  />
                )}
                {!user && (
                  <Input
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
                {...register('address')}
                placeholder="Dirección"
                label="Dirección:"
                errors={errors}
              />
              <Input
                {...register('phone')}
                placeholder="Celular"
                label="Celular:"
                type="number"
                errors={errors}
              />
              <Input
                {...register('room')}
                placeholder="Cuarto"
                label="Cuarto:"
                type="text"
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
                data={departaments}
                itemKey="nombre_ubigeo"
                textField="nombre_ubigeo"
                onChange={handleGetProvinces}
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
                onChange={handleGetDistricts}
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
              <Input
                {...register('userPc')}
                placeholder="Usuario(00)"
                type="text"
                errors={errors}
                label="Usuario(00)"
              />
            </div>
            <div className="col-input">
              <Select
                isRelative
                label="Profesión:"
                {...register('job', {
                  validate: { validateWhiteSpace },
                })}
                data={JOB_DATA}
                itemKey="value"
                textField="value"
                errors={errors}
              />
              {!user?.id && (
                <Select
                  isRelative
                  label="Rol:"
                  {...register('role', {
                    validate: { validateWhiteSpace },
                  })}
                  // defaultValue={user.role}
                  name="role"
                  itemKey="id"
                  textField="value"
                  data={getListByRole(userSession.role)}
                />
              )}

              <Select
                isRelative
                label="Grado:"
                {...register('degree')}
                name="degree"
                data={degreeData}
                itemKey="value"
                textField="value"
                errors={errors}
              />

              <Input
                {...register('ruc')}
                placeholder="ruc"
                type="text"
                errors={errors}
                label="ruc"
              />
            </div>
            {!user?.id && (
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
              </div>
            )}
          </div>
          <h3 className="card-register-title-info">Datos de Referencia:</h3>
          <div className="card-register-content">
            <div className="col-input">
              <Input
                {...register('firstNameRef', { required: true })}
                placeholder="Nombres"
                label="Nombres"
                errors={errors}
              />
              <Input
                {...register('lastNameRef')}
                placeholder="Apellidos"
                errors={errors}
                label="Apellidos"
              />
            </div>
            <div className="col-input">
              <Input
                {...register('addressRef')}
                placeholder="Dirección"
                label="Dirección"
                errors={errors}
              />
              <Input
                {...register('phoneRef')}
                placeholder="Celular"
                label="Celular"
                type="number"
                errors={errors}
              />
            </div>
          </div>
          <div className="btn-build">
            <Button
              text={user ? 'GUARDAR' : 'CREAR'}
              className="btn-area"
              whileTap={{ scale: 0.9 }}
              type="submit"
            />
          </div>
        </form>
        <div className="card-register-sworn-declaration">
          <h2 className="card-register-sworn-declaration-title">
            Generar declaración jurada
          </h2>
          <h4 className="card-register-sworn-declaration-subtitle">
            Selecctionar tipo
          </h4>
          <div className="card-register-radio-container">
            <div className="card-register-radio-input">
              <input
                type="radio"
                id="technical"
                value="technical"
                {...register('typeDeclaration')}
                name="typeDeclaration"
              />
              <label
                htmlFor="technical"
                className="card-register-radio-input-text"
              >
                Técnico
              </label>
            </div>
            <div className="card-register-radio-input">
              <input
                type="radio"
                id="administrative"
                value="administrative"
                {...register('typeDeclaration')}
                name="typeDeclaration"
              />
              <label
                htmlFor="administrative"
                className="card-register-radio-input-text"
              >
                Administrativos
              </label>
            </div>
          </div>
          <h4 className="card-register-sworn-declaration-subtitle">Fecha</h4>
          <input
            type="text"
            {...register('declarationDate')}
            name="declarationDate"
            placeholder="03 de Enero del 2023"
          />
          <h4 className="card-register-sworn-declaration-subtitle">
            Seleccionar directivas
          </h4>
          <div>
            <div className="card-register-sworn-declaration-select">
              <input
                type="checkbox"
                className="card-register-dropdown-check"
                defaultChecked={false}
              />
              <h3>Directivas</h3>
              <img
                src="/svg/down.svg"
                className="card-register-sworn-declaration-arrow"
              />
            </div>
            <div className="card-register-sworn-declaration-dropdown-content">
              <ul className="card-register-sworn-declaration-dropdown-sub">
                {generalFiles?.map(generalFile => (
                  <label
                    key={generalFile.id}
                    className="card-register-sworn-declaration-check-container"
                  >
                    <input
                      type="checkbox"
                      value={generalFile.name}
                      {...register('declarations')}
                    />
                    {deleteExtension(generalFile.name)}
                  </label>
                ))}
              </ul>
            </div>
          </div>
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
      </div>
    </Modal>
  );
};

export default CardRegisterUser;
