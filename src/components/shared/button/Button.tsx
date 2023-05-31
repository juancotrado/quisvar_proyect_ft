import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './button.css';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}
const Button = ({
  className,
  text,
  onClick,
  type,
  icon,
  ...otherProps
}: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 1 }}
      onClick={onClick}
      className={`btn-main ${className}`}
      type={type}
      {...otherProps}
    >
      {icon && <img src={`/svg/${icon}.svg`} />}
      {text}
    </motion.button>
  );
};

Button.defaultProps = {
  icon: null,
  onClick: null,
};

export default Button;
