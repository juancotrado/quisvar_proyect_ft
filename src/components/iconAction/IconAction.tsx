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
}: IconActionProps) => {
  const style: CSSProperties = {
    cursor: 'pointer',
    width: `${size}rem`,
    height: `${size}rem`,
    left: `${left}rem`,
    right: `${right}rem`,
    top: `${top}rem`,
    bottom: `${bottom}rem`,
    zIndex,
  };
  return (
    <figure
      className={`${position !== 'none' && 'iconAction'} ${className} ${
        iconTwo && 'iconAction-hover'
      }`}
      style={style}
      onClick={e => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <img src={`/svg/${icon}.svg`} alt={icon} className="normal" />
      {iconTwo && (
        <img src={`/svg/${iconTwo}.svg`} alt={iconTwo} className="hover" />
      )}
    </figure>
  );
};

export default IconAction;
