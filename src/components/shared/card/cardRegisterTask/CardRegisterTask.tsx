import { motion } from 'framer-motion';
import './CardRegisterTask.css';
import { Input, TextArea } from '../../..';

const CardRegisterTask = () => {
  return (
    <div className="card-register-user">
      <h1>REGISTRO DE TAREAS</h1>
      <Input label="Nombre de la tarea" placeholder="Nombre" />
      {/* <Select label="Proyecto" data={data1} /> */}
      <div className="col-input">
        {/* <Select label="Area" data={data2} /> */}
        <Input label="Precio" placeholder="S/ 00.00" type="number" />
      </div>
      <TextArea label="Descripción" placeholder="Opcional" />
      <div className="btn-build">
        <motion.button className="btn" whileTap={{ scale: 0.9 }}>
          CREAR
        </motion.button>
      </div>
    </div>
  );
};

export default CardRegisterTask;
