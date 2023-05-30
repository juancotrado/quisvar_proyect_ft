import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { axiosInstance } from '../../../services/axiosInstance';
import './button.css';
import { useState } from 'react';
import Button from './Button';
import { dropIn } from '../../../animations/animations';
import Portal from '../../portal/Portal';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  url?: string;
  icon: string;
  onSave?: () => void;
  customOnClick?: () => void;
}
const ButtonDelete = ({
  className,
  text,
  type,
  url,
  icon,
  onSave,
  customOnClick,
  ...otherProps
}: ButtonProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleCloseButton = () => {
    setIsAlertOpen(!isAlertOpen);
  };

  const handleSendDelete = async () => {
    if (customOnClick) {
      customOnClick();
      setIsAlertOpen(false);

      return;
    }
    await axiosInstance.delete(`${url}`).then(() => {
      onSave?.();
      setIsAlertOpen(false);
    });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCloseButton}
        className={` btn-main ${className} btn-delete `}
        type={type}
        {...otherProps}
      >
        {icon && <img src={`/svg/${icon}.svg`} alt={`${icon}`} />}
        {text}
      </motion.button>

      {isAlertOpen && (
        <Portal wrapperId="modal">
          <div
            className="alert-modal-main"
            role="dialog"
            onClick={handleCloseButton}
          >
            <motion.div
              className="alert-modal-children"
              variants={dropIn}
              onClick={e => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="leave"
            >
              <img src="/svg/trashdark.svg" />
              <h3>{`¿Estas seguro que deseas eliminar este registro ${url}?`}</h3>
              <div className="container-btn">
                <Button
                  text="No, cancelar"
                  onClick={handleCloseButton}
                  className="btn-alert "
                />
                <Button
                  className=" btn-alert  btn-delete"
                  text="Si, estoy seguro"
                  onClick={handleSendDelete}
                />
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </>
  );
};

ButtonDelete.defaultProps = {
  icon: null,
};

export default ButtonDelete;
