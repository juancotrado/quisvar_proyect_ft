import { motion } from 'framer-motion';
import Portal from './Portal';
import './modal.css';

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  leave: {
    opacity: 0,
    y: '-100vh',
  },
};

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onChangeStatus?: () => void;
}

const Modal = ({ children, isOpen, onChangeStatus }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <Portal wrapperId="modal">
      <motion.div
        onClick={onChangeStatus}
        role="dialog"
        className="modal-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { delay: 2} }}
      >
        <motion.div
          className={`modal-children`}
          onClick={e => e.stopPropagation()}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="leave"
        >
          {children}
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default Modal;
