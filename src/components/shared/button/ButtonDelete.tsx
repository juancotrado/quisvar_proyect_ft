import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { axiosInstance } from '../../../services/axiosInstance';
import './button.css';
import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { dropIn } from '../../../animations/animations';
import Portal from '../../portal/Portal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import InputText from '../Input/Input';
import { Subscription } from 'rxjs';
import { isOpenButtonDelete$ } from '../../../services/sharingSubject';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  url?: string;
  icon: string;
  onSave?: () => void;
  customOnClick?: () => void;
  notIsVisible?: boolean;
  imageStyle?: string;
  // sizeIcon?: boolean;
  passwordRequired?: boolean;
}
const ButtonDelete = ({
  notIsVisible = false,
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
  const [customFuction, setCustomFuction] = useState<(() => void) | null>(null);
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
    if (customFuction) {
      customFuction();
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

  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenButtonDelete$.getSubject.subscribe(value => {
      setIsAlertOpen(value.isOpen);
      setCustomFuction(value.function);
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  return (
    <>
      <motion.button
        // whileHover={{ scale: 1.05 }}
        // whileTap={{ scale: 0.9 }}
        onClick={handleCloseButton}
        className={`${className} btn-main  btn-delete ${
          notIsVisible && 'btn-hiden'
        }`}
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
              <span className="close-icon" onClick={handleCloseButton}>
                <img src="/svg/close.svg" alt="pencil" />
              </span>
              {!askPassword ? (
                <>
                  <img src="/svg/trashdark.svg" className="alert-modal-trash" />
                  <h3>{`¿Estas seguro que deseas eliminar este registro ${
                    customFuction ? '' : url
                  }?`}</h3>
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
                  <div className="modal-text-input">
                    <InputText
                      label="Ingrese su contraseña"
                      autoComplete="no"
                      placeholder="Contraseña"
                      onChange={e => setPassword(e.target.value)}
                      type="password"
                    />
                  </div>
                  <div className="container-btn">
                    <Button
                      type="button"
                      text="Cancelar"
                      onClick={handleCloseButton}
                      className="modal-btn-cancel"
                    />
                    <Button
                      text="Confirmar"
                      onClick={handleVerifyPassword}
                      className="modal-btn-confirm"
                    />
                  </div>
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
