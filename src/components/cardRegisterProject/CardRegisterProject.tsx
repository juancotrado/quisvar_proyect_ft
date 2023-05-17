import { motion } from 'framer-motion';
import './CardRegisterProject.css';
import { Input, Select, TextArea } from '..';

const CardRegisterProject = () => {
  const data1 = [
    //endpoint data answer
    { name: 'Salud' },
    { name: 'Saneamiento' },
    { name: 'Carreteras' },
  ];
  const data2 = [
    //endpoint data answer
    { name: 'Gonzalo' },
    { name: 'Diego' },
    { name: 'Adolfo' },
  ];

  return (
    <div className="card-register-user">
      <h1>REGISTRO DE PROYECTOS</h1>
      <Input label="Nombre del Proyeto" placeholder="Nombre" />
      <div className="col-input">
        <Select label="Coordinador" data={data2} />
        <Select label="Area de trabajo" data={data1} />
      </div>
      <div className="col-input">
        <Input label="Fecha Inicio" type="date" />
        <Input label="Fecha Limite" type="date" />
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

export default CardRegisterProject;
