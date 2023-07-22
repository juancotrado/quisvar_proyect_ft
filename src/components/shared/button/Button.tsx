import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './button.css';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  imageStyle?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}
const Button = ({
  className,
  text,
  onClick,
  type,
  imageStyle = '',
  icon,
  ...otherProps
}: ButtonProps) => {
  return (
    <motion.button
      // whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`btn-main ${className}`}
      type={type}
      {...otherProps}
    >
      {icon && <img src={`/svg/${icon}.svg`} className={imageStyle} />}
      {text}
    </motion.button>
  );
};

Button.defaultProps = {
  icon: null,
  onClick: null,
};

export default Button;
