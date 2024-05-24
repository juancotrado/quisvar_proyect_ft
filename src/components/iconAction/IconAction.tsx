import { CSSProperties } from 'react';
import './iconAction.css';

interface IconActionProps {
  onClick?: () => void;
  className?: string;
  left?: number;
  size?: number;
  right?: number;
  bottom?: number;
  top?: number;
  icon: string;
  iconTwo?: string;
  position?: 'none' | 'auto';
  zIndex?: number;
  shadow?: boolean;
  text?: string;
}
const IconAction = ({
  onClick,
  className,
  size = 1,
  bottom,
  left,
  right,
  top,
  icon,
  iconTwo,
  position,
  zIndex,
  shadow,
  text,
}: IconActionProps) => {
  const style: CSSProperties = {
    cursor: 'pointer',
    maxWidth: `${size}rem`,
    maxHeight: `${size}rem`,
    minWidth: `${size}rem`,
    minHeight: `${size}rem`,
    left: `${left}rem`,
    right: `${right}rem`,
    top: `${top}rem`,
    bottom: `${bottom}rem`,
    zIndex,
  };
  const Icon = (
    <figure
      className={`${
        position !== 'none' && !text && 'iconAction'
      } ${className} ${iconTwo && 'iconAction-hover'}`}
      style={style}
      onClick={e => {
        if (text) return;
        e.stopPropagation();
        onClick?.();
      }}
    >
      <img
        src={`/svg/${icon}.svg`}
        alt={icon}
        className={`normal ${shadow && 'IconAction-shadown'}`}
      />
      {iconTwo && (
        <img src={`/svg/${iconTwo}.svg`} alt={iconTwo} className="hover" />
      )}
    </figure>
  );

  return text ? (
    <div
      className="iconAction-container"
      onClick={e => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {Icon} {text}
    </div>
  ) : (
    Icon
  );
};

export default IconAction;
