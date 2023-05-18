import { motion } from 'framer-motion';
import './CardRegisterUser.css';
import { Input, Select } from '../../..';

interface CardRegisterUserProps {
  onSave?: () => void;
  dataRegisterUser?: User | null;
}

type User = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
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

const CardRegisterUser = ({
  dataRegisterUser,
  onSave,
}: CardRegisterUserProps) => {
  const [data, setData] = useState<User>(InitialValues);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (dataRegisterUser) {
      setData(dataRegisterUser);
      console.log(data);
    }
  }, [dataRegisterUser]);
  const data1 = [
    //endpoint data answer
    { id: 1, name: 'Salud' },
    { id: 2, name: 'Saneamiento' },
    { id: 3, name: 'Carreteras' },
  ];
  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataRegisterUser) {
      axiosInstance
        .patch(`/users/${data.id}`, data)
        .then(successfulShipment)
        .catch(err => console.log(err.message));
    } else {
      axiosInstance
        .post(`/users`, data)
        .then(successfulShipment)
        .catch(err => console.log(err.message));
    }
  };
  const successfulShipment = () => {
    onSave?.();
    setData(InitialValues);
  };
  const handleChange = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setData({ ...data, [name]: value });
    }, 250);
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
    setData(InitialValues);
  };

  return (
    <div className="card-register-user">
      <h1>REGISTRO DE NUEVO USUARIO</h1>
      <Input placeholder="Correo" title="Correo" label="Correo" />
      <Input placeholder="Contraseña" type="password" label="Contraseña" />
      <div className="col-input">
        <Input placeholder="Nombres" label="Nombres" />
        <Input placeholder="Apellidos" label="Apellidos" />
      </div>
      <div className="col-input">
        <Input placeholder="N°" label="DNI" />
        <Input placeholder="Celular" label="Celular" />
        <Select label="Area" data={data1} itemKey="id" textField="name" />
      </div>
      <div className="btn-build">
        <motion.button className="btn" whileTap={{ scale: 0.9 }}>
          CREAR
        </motion.button>
      </div>
    </div>
  );
};

export default CardRegisterUser;
