import { motion } from 'framer-motion';
import Portal from './Portal';
import './modal.css';
import { isOpenModal$ } from '../../services/sharingSubject';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { dropIn } from '../../animations/animations';

interface ModalProps {
  children: React.ReactNode;
  size?: number;
  isOpenProp?: boolean;
}
const Modal = ({ children, size, isOpenProp }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenModal$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

  if (isOpenProp !== undefined) {
    if (!isOpenProp) return null;
  } else {
    if (!isOpen) return null;
  }
  return (
    <Portal wrapperId="modal">
      <motion.div
        // onClick={() => setIsOpen(false)}
        role="dialog"
        className="modal-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { delay: 2 } }}
      >
        <motion.div
          className={`modal-children`}
          onClick={e => e.stopPropagation()}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="leave"
          style={{ minWidth: `${size ? size : 100}%` }}
        >
          {children}
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default Modal;
