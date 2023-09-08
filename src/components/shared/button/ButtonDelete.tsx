import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { axiosInstance } from '../../../services/axiosInstance';
import './button.css';
import { useState } from 'react';
import Button from './Button';
import { dropIn } from '../../../animations/animations';
import Portal from '../../portal/Portal';
import { Input } from '../..';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import InputText from '../Input/Input';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  url?: string;
  icon: string;
  onSave?: () => void;
  customOnClick?: () => void;
  imageStyle?: string;
  // sizeIcon?: boolean;
  passwordRequired?: boolean;
}
const ButtonDelete = ({
  // sizeIcon,
  className,
  text,
  type,
  url,
  icon,
  onSave,
  imageStyle = '',
  customOnClick,
  passwordRequired,
  ...otherProps
}: ButtonProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [askPassword, setAskPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const handleCloseButton = () => {
    setAskPassword(false);
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
  const { userSession } = useSelector((state: RootState) => state);
  const handleVerifyPassword = () => {
    const data = {
      dni: userSession.profile.dni,
      password: password,
    };
    axiosInstance
      .post('/auth/login', data)
      .then(() => {
        handleSendDelete();
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <motion.button
        // whileHover={{ scale: 1.05 }}
        // whileTap={{ scale: 0.9 }}
        onClick={handleCloseButton}
        className={`${className} btn-main  btn-delete`}
        type={type}
        {...otherProps}
      >
        {icon && (
          <img
            src={`/svg/${icon}.svg`}
            alt={`${icon}`}
            className={`${
              text ? 'btn-main-text' : 'btn-main-img'
            } ${imageStyle} `}
          />
        )}
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
              {!askPassword ? (
                <>
                  <img src="/svg/trashdark.svg" className="alert-modal-trash" />
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
                      type="button"
                      onClick={
                        passwordRequired
                          ? () => setAskPassword(true)
                          : handleSendDelete
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <img src="/svg/trashdark.svg" className="alert-modal-trash" />
                  <InputText
                    label="Ingrese su contraseña"
                    placeholder="Contraseña"
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    style={{ flex: 1 }}
                  />

                  <Button
                    text="Confirmar"
                    onClick={handleVerifyPassword}
                    className="modal-btn-confirm"
                  />
                </>
              )}
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
