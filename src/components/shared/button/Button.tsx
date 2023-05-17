import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}
const Button = ({
  className,
  text,
  onClick,
  type,
  ...otherProps
}: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`${className}`}
      type={type}
      {...otherProps}
    >
      {text}
    </motion.button>
  );
};

Button.defaultProps = {
  icon: null,
  onClick: null,
};

export default Button;
