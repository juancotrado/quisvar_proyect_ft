import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './button.css';
import { CSSProperties } from 'react';
import { ButtonType, Size, Variant } from '../../types';
import { ColorKeys, COLOR_CSS } from '../../utils/cssData';

type Position = 'center' | 'left' | 'right';
interface ButtonProps extends HTMLMotionProps<'button'> {
  text?: string;
  icon?: string;
  imageStyle?: string;
  iconSize?: number;
  variant?: Variant;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  textColor?: ColorKeys;
  borderColor?: ColorKeys;
  size?: Size;
  buttonType?: ButtonType;
  color?: ColorKeys;
  style?: CSSProperties;
  position?: Position;
  borderRadius?: number;
  full?: boolean;
}
export const Button = ({
  className,
  text,
  imageStyle = '',
  icon,
  iconSize = 1,
  disabled,
  borderRadius,
  size = 'xs',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  color = 'primary',
  textColor,
  full,
  borderColor,
  position,
  variant = 'solid',
  style,
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

  const getVarianStyles = (variant: Variant): CSSProperties => {
    const backgroundColor = COLOR_CSS[color];
    const txtColor = textColor
      ? COLOR_CSS[textColor]
      : variant == 'solid'
      ? 'white'
      : COLOR_CSS[color];

    const brdColor = borderColor ? COLOR_CSS[borderColor] : COLOR_CSS[color];

    switch (variant) {
      case 'solid':
        return {
          backgroundColor,
          color: txtColor,
          borderColor: brdColor,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: txtColor,
          borderColor: brdColor,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          color: txtColor,
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          color: txtColor,
          textDecoration: 'underline',
        };
    }
  };
  const getPositionStyles = (position?: Position): CSSProperties => {
    switch (position) {
      case 'center':
        return { marginInline: 'auto' };
      case 'left':
        return { marginInlineEnd: 'auto' };
      case 'right':
        return { marginInlineStart: 'auto' };
      default:
        return {};
    }
  };
  const buttonStyles: CSSProperties = {
    padding: !!text ? getSizeStyles(size).padding : '',
    fontSize: getSizeStyles(size).fontsize,
    borderRadius,
    width: full ? '100%' : 'auto',
    ...getPositionStyles(position),
    ...getVarianStyles(variant),
    ...style,
  };

  const motionProps = !disabled
    ? {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 1 },
      }
    : {};

  //
  const Button = () => (
    <motion.button
      {...motionProps}
      disabled={disabled}
      className={`${className} button-${variant}  btn-common btn-send`}
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
  return position ? (
    <div style={{ width: '100%' }}>
      <Button />
    </div>
  ) : (
    <Button />
  );
};

export default Button;
