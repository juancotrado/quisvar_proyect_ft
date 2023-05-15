import { motion } from 'framer-motion';
import './CardRegisterArea.css';
import { Input } from '..';

const CardRegisterArea = () => {
  return (
    <div className="card-register-area">
      <h1>REGISTRO DE PROYECTOS</h1>
      <div className="col">
        <Input label="Nombre" placeholder="Nombre" />
        <div className="btn-build">
          <motion.button className="btn-area" whileTap={{ scale: 0.9 }}>
            CREAR
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CardRegisterArea;
