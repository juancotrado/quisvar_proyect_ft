import InputText from '../../Input/Input';
import Button from '../../button/Button';
import './cardEditInformation.css';
import { motion, AnimatePresence } from 'framer-motion';

const CardEditInformation = ({ isOpen, onClose }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '+100%' }}
          animate={{ x: 0 }}
          exit={{ x: '+100%' }}
          transition={{ duration: 1 }}
          className="modal-edit-info"
        >
          <div className="col-input">
            <h1>INFORMACIÓN BÁSICA</h1>
            <div className="col-input">
              <Button text="CANCEL" onClick={onClose} />
              <Button text="GUARDAR" className="bg-inverse" />
            </div>
          </div>
          <div className="divider"></div>
          <div className="col-input">
            <InputText name="firstName" label="Nombres" />
            <InputText name="lastName" label="Apellidos" />
          </div>
          <InputText name="puesto" label="Puesto" />
          <InputText name="email" label="Email" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardEditInformation;
