import { color, motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './button.css';
import { STYLE_BUTTON } from './buttonDefinitions';
import { CSSProperties } from 'react';
import { Size, Variant } from '../../types';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  icon?: string;
  imageStyle?: string;
  styleButton?: number;
  iconSize?: number;
  variant?: Variant;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  colorText?: string;
  size?: Size;
}
export const Button = ({
  className,
  text,
  imageStyle = '',
  icon,
  iconSize = 1,
  disabled,
  styleButton = 4,
  size = 'xs',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  colorText,
  variant = 'solid',
  ...otherProps
}: ButtonProps) => {
  const styleIcon: CSSProperties = {
    width: `${iconSize}rem`,
  };

  const getSizeStyles = (size: Size) => {
    switch (size) {
      case 'xs':
        return { padding: '0.5rem', fontsize: '0.75rem' };
      case 'sm':
        return { padding: '0.75rem', fontsize: '0.875rem' };
      case 'md':
        return { padding: '1rem', fontsize: '1rem' };
      case 'lg':
        return { padding: '1.5rem', fontsize: '1.125rem' };
    }
  };
  const buttonStyles: CSSProperties = {
    padding: !!text ? getSizeStyles(size).padding : '',
    fontSize: getSizeStyles(size).fontsize,
  };
  if (colorText) {
    buttonStyles.color = colorText;
  }
  const motionProps = !disabled
    ? {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 1 },
      }
    : {};

  return (
    <motion.button
      {...motionProps}
      disabled={disabled}
      className={`${className} button-${variant} btn-common ${STYLE_BUTTON[styleButton]}  `}
      style={buttonStyles}
      {...otherProps}
    >
      {icon && (
        <figure className={`${imageStyle} `} style={styleIcon}>
          <img src={`/svg/${icon}.svg`} />
        </figure>
      )}

      {!!LeftIcon && LeftIcon}
      {text}
      {!!RightIcon && RightIcon}
    </motion.button>
  );
};

export default Button;
