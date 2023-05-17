import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { axiosInstance } from '../../../services/axiosInstance';
import './button.css';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  url: string;
  onSave?: () => void;
}
const ButtonDelete = ({
  className,
  text,
  type,
  url,
  onSave,
  ...otherProps
}: ButtonProps) => {
  const handleCloseButton = () => {
    axiosInstance
      .delete(`${url}`)
      .then(onSave)
      .catch(err => console.log(err));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleCloseButton}
      className={` btn-main ${className} btn-delete `}
      type={type}
      {...otherProps}
    >
      {text}
    </motion.button>
  );
};

ButtonDelete.defaultProps = {
  icon: null,
};

export default ButtonDelete;
