import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './button.css';
import { STYLE_BUTTON } from './buttonDefinitions';
import { CSSProperties } from 'react';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  imageStyle?: string;
  styleButton?: number;
  style?: CSSProperties;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  iconSize?: number;
}
export const Button = ({
  className,
  text,
  onClick,
  type,
  imageStyle = '',
  icon,
  iconSize = 1,
  disabled,
  styleButton = 1,
  style,
  ...otherProps
}: ButtonProps) => {
  const styleIcon: CSSProperties = {
    width: `${iconSize}rem`,
  };
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      disabled={disabled}
      style={style}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`${STYLE_BUTTON[styleButton]} ${className} ${
        disabled && 'btn-disabled'
      }`}
      type={type}
      {...otherProps}
    >
      {icon && (
        <figure className={`${imageStyle} `} style={styleIcon}>
          <img
            src={`/svg/${icon}.svg`}
            style={{ height: '100%', width: '100%' }}
          />
        </figure>
      )}
      {text}
    </motion.button>
  );
};

Button.defaultProps = {
  icon: null,
  onClick: null,
};

export default Button;
