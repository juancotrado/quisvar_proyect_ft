import './CardRegisterUser.css';
import Select from '../../select/Select';
import { useEffect } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
import { useForm } from 'react-hook-form';
import InputText from '../../Input/Input';
interface CardRegisterUserProps {
  onSave?: () => void;
  dataRegisterUser?: User | null;
}

enum UserRole {
  'ADMIN',
  'EMPLOYEE',
  'MOD',
}
type User = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role?: UserRole;
  status?: boolean;
};
type Profile = {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
};
const InitialValues = {
  id: 0,
  email: '',
  password: '',
  profile: {
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
  },
};

const roles = [{ role: 'ADMIN' }, { role: 'EMPLOYEE' }, { role: 'MOD' }];

const CardRegisterUser = ({
  dataRegisterUser,
  onSave,
}: CardRegisterUserProps) => {
  // const [data, setData] = useState<User>(InitialValues);
  // const debounceRef = useRef<NodeJS.Timeout>();
  // console.log(data);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: InitialValues,
  });

  useEffect(() => {
    if (dataRegisterUser) {
      reset(dataRegisterUser);
      setValue('status', dataRegisterUser.status);
    }
  }, [dataRegisterUser]);

  const onSubmit = async (values: User) => {
    // console.log(values.status === 'true');
    let passData = {
      email: values.email,
      password: values.password,
      firstName: values.profile.firstName,
      lastName: values.profile.lastName,
      dni: values.profile.dni,
      phone: values.profile.phone,
    };
    if (dataRegisterUser) {
      let editData = {
        role: values.role,
        status: values.status,
      };
      axiosInstance
        .patch(`/users/${dataRegisterUser.id}`, editData)
        .then(successfulShipment);
      // window.location.reload();
    } else {
      axiosInstance.post(`/users`, passData).then(successfulShipment);
      // window.location.reload();
    }
  };

  const successfulShipment = () => {
    onSave?.();
    reset(InitialValues);
    window.location.reload();
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
    reset(InitialValues);
  };
  return (
    <Modal size={50}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>
          {dataRegisterUser
            ? 'EDITAR DATOS DE USUARIO'
            : 'REGISTRO DE NUEVO USUARIO'}
        </h1>
        <InputText
          {...register('email', {
            required: true,
            pattern:
              /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/i,
          })}
          errors={errors}
          placeholder="Correo"
          label="Correo"
          name="email"
          disabled={dataRegisterUser ? true : false}
        />
        {!dataRegisterUser ? (
          <InputText
            {...register('password', { required: true })}
            placeholder="Contraseña"
            type="password"
            label="Contraseña"
          />
        ) : (
          ''
        )}
        <div className="col-input">
          <InputText
            {...register('profile.firstName', { required: true })}
            placeholder="Nombres"
            label="Nombres"
            disabled={dataRegisterUser ? true : false}
          />
          <InputText
            {...register('profile.lastName')}
            placeholder="Apellidos"
            label="Apellidos"
            disabled={dataRegisterUser ? true : false}
          />
        </div>
        <div className="col-input">
          <InputText
            {...register('profile.dni', { required: true })}
            placeholder="N°"
            label="DNI"
            type="number"
            disabled={dataRegisterUser ? true : false}
          />
          <InputText
            {...register('profile.phone')}
            placeholder="Celular"
            label="Celular"
            type="number"
            disabled={dataRegisterUser ? true : false}
          />
        </div>
        {dataRegisterUser ? (
          <div className="col-input">
            <Select
              {...register('role')}
              label="Rol"
              defaultValue={dataRegisterUser.role}
              data={roles}
              name="role"
              itemKey="role"
              textField="role"
            />
            <div className="input-check">
              <label className="input-label">Estado</label>
              <div className="cheack-content">
                <input
                  type="checkbox"
                  id="selectCheckbox"
                  {...register('status')}
                />
                <p>{watch('status') ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
            {/* <Select
              {...register('status')}
              label="Status"
              defaultValue={dataRegisterUser.status ? 'Activo' : 'Inactivo'}
              data={status}
              name="status"
              itemKey="status"
              textField="status"
            /> */}
          </div>
        ) : (
          ''
        )}
        <div className="btn-build">
          <Button
            text={dataRegisterUser ? 'GUARDAR' : 'CREAR'}
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
